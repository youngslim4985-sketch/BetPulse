export interface SdkConfig {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  backoffFactor?: number;
}

export interface MarketStateResponse {
  symbol: string;
  canonicalPrice: number;
  impliedProbability: number;
  lbsScore: number;
  classification: string;
  lastUpdated: number;
}

export class LineBreakerSdk {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;
  private backoffFactor: number;
  private activeWs: WebSocket | null = null;

  constructor(config: SdkConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required to initialize the LineBreakerSdk.');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.linebreaker.io/v1';
    this.timeoutMs = config.timeoutMs || 5000;
    this.maxRetries = config.maxRetries || 3;
    this.backoffFactor = config.backoffFactor || 2;
  }

  /**
   * Safe fetching wrapper supporting timeouts and exponential backoff
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-SDK-Client': 'linebreaker-typescript-sdk@1.0.0',
      ...options.headers
    };

    let attempt = 0;
    
    while (attempt < this.maxRetries) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(id);

        if (response.ok) {
          return await response.json() as T;
        }

        // Retry on 429 (Too Many Requests) or 5xx server issues
        if (response.status === 429 || response.status >= 500) {
          attempt++;
          if (attempt >= this.maxRetries) {
            throw new Error(`API Request Failed. Status: ${response.status} | ${response.statusText}`);
          }
          
          // Compute exponential backoff time (factor ** attempt * 100ms) plus jitter
          const delay = Math.pow(this.backoffFactor, attempt) * 100 + Math.random() * 50;
          console.warn(`[SDK] Request failed with status ${response.status}. Retrying in ${delay.toFixed(0)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Fast fail on 401 Unauthorized, 403 Forbidden, 404 Not Found
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP Exception: ${response.status} ${response.statusText}`
        );

      } catch (err: any) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
          throw new Error(`SDK Connection Timeout exceeded (${this.timeoutMs}ms) calling ${url}.`);
        }
        throw err;
      }
    }

    throw new Error('SDK execution maximum retry limit reached without successful response.');
  }

  /**
   * Retrieves live Line Breaker Scores (LBS™) for a matching market symbol
   */
  public async getMarketLBS(symbol: string): Promise<MarketStateResponse> {
    return this.request<MarketStateResponse>(`/lbs/live/${symbol}`);
  }

  /**
   * Subscribes to real-time WebSockets streaming line-broker modifications
   */
  public connectWebSocket(
    onMessage: (data: { event: string; payload: any }) => void,
    onError?: (err: Event) => void
  ): void {
    if (this.activeWs) {
      this.activeWs.close();
    }

    const wsUrl = this.baseUrl.replace('http', 'ws') + '/stream';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Send key auth handshake
      ws.send(JSON.stringify({
        action: 'auth',
        token: this.apiKey
      }));
    };

    ws.onmessage = (event) => {
      try {
        const cleanData = JSON.parse(event.data);
        onMessage(cleanData);
      } catch (err) {
        console.error('[SDK] WS message parse error', err);
      }
    };

    ws.onerror = (err) => {
      if (onError) onError(err);
    };

    ws.onclose = () => {
      console.log('[SDK] WebSocket connection lost. Reconnect logic should apply here.');
    };

    this.activeWs = ws;
  }

  /**
   * Cleans active socket bindings
   */
  public disconnect(): void {
    if (this.activeWs) {
      this.activeWs.close();
      this.activeWs = null;
    }
  }
}
