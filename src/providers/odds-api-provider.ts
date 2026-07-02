export interface MarketProvider {
  getOdds(): Promise<any>;
}

export class OddsApiProvider implements MarketProvider {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getOdds(): Promise<any> {
    if (!this.apiKey) {
      console.warn("ODDS_API_KEY is not defined. Falling back to simulated live odds.");
    }
    return {
      provider: "odds-api",
      timestamp: Date.now(),
      odds: []
    };
  }
}

export class MockMarketProvider implements MarketProvider {
  async getOdds(): Promise<any> {
    return {
      provider: "mock",
      timestamp: Date.now(),
      odds: []
    };
  }
}

export class CachedMarketProvider implements MarketProvider {
  private provider: MarketProvider;
  private cacheTtlMs: number;
  private cachedData: any = null;
  private lastFetched: number = 0;

  constructor(provider: MarketProvider, cacheTtlMs: number) {
    this.provider = provider;
    this.cacheTtlMs = cacheTtlMs;
  }

  async getOdds(): Promise<any> {
    const now = Date.now();
    if (!this.cachedData || now - this.lastFetched > this.cacheTtlMs) {
      this.cachedData = await this.provider.getOdds();
      this.lastFetched = now;
    }
    return this.cachedData;
  }
}
