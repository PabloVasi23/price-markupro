
export type ProductSource = 'manual' | 'excel' | 'csv' | 'image' | 'url' | 'backup';

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  currency: string;
  source: ProductSource;
  lastUpdated: string;
}

export interface ProcessedProductItem extends ProductItem {
  calculatedCostLocal: number; 
  sellerPrice: number; 
  suggestedPrice: number;
}

export type RoundingRule = 'none' | '99' | '00' | '10' | '50' | '100' | '500' | '1000';

export type PricingTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5' | 'custom';

export interface AppSettings {
  businessName: string;
  exchangeRate: number;
  roundingRule: RoundingRule;
  markups: Record<PricingTier, number>;
  activeTier: PricingTier;
  clientAdjustment: number; // Margen adicional para el precio sugerido
  globalCurrency: string;
  visibility: {
    baseCost: boolean;
    sellerPrice: boolean;
    suggestedPrice: boolean;
  };
}

export interface ImportSummary {
  added: number;
  updated: number;
  skipped: number;
  total: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  DATABASE = 'DATABASE',
  SAVED_LISTS = 'SAVED_LISTS'
}

export interface ExtractedData {
  items: {
    name: string;
    brand: string;
    originalPrice: number;
    currency: string;
  }[];
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface SavedList {
  id: string;
  name: string;
  items: ProductItem[];
  date: string;
}
