import { SignalRecord, SignalType, CompositeFingerprint } from './FeedbackContract';
import * as crypto from 'crypto';

export interface ISignalRegistry {
  register(signal: Omit<SignalRecord, 'id' | 'fingerprint'>): SignalRecord;
  get(id: string): SignalRecord | undefined;
  list(): SignalRecord[];
}

export class SignalRegistry implements ISignalRegistry {
  private store: Map<string, SignalRecord> = new Map();

  public register(data: Omit<SignalRecord, 'id' | 'fingerprint'>): SignalRecord {
    const id = crypto.randomUUID();
    const fingerprint = this.buildFingerprint(data.type, data.features);
    
    const record: SignalRecord = {
      ...data,
      id,
      fingerprint
    };

    this.store.set(id, record);
    return record;
  }

  public get(id: string): SignalRecord | undefined {
    return this.store.get(id);
  }

  public list(): SignalRecord[] {
    return Array.from(this.store.values());
  }

  /**
   * Deterministic fingerprinting
   * ∀ features ∈ {F1, F2...Fn} -> Sort(Keys(F))
   */
  private buildFingerprint(type: SignalType, features: { [key: string]: number }): CompositeFingerprint {
    const sortedKeys = Object.keys(features).sort();
    const featureString = sortedKeys
      .map(key => `${key}:${features[key].toFixed(2)}`)
      .join('|');
    
    return `${type}|${featureString}`;
  }
}

export const signalRegistry = new SignalRegistry();
