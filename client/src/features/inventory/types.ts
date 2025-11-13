/**
 * Shared inventory domain types for frontend mapping helpers.
 * These keep the route page and tab components in sync without
 * depending directly on the generated API types (which can change).
 */

export type FeedSizeCategory = 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';

export interface FeedRecord {
  id: number;
  name: string;
  brand: string;
  sizeCategory: FeedSizeCategory;
  pelletSizeMm?: number;
  proteinPercentage?: number;
  fatPercentage?: number;
  carbohydratePercentage?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedPurchaseRecord {
  id: number;
  feed: number;
  purchaseDate: string;
  quantityKg: number;
  costPerKg: number;
  supplier: string;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedContainerRecord {
  id: number;
  name: string;
  capacityKg: number;
  location?: string;
  containerType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedContainerStockRecord {
  id: number;
  feedContainer: number;
  feedPurchase: number;
  quantityKg: number;
  costPerKg: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedingEventRecord {
  id: number;
  batch: number;
  container: number;
  feed: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: number;
  batchBiomassKg: number;
  feedingPercentage?: number;
  feedCost?: number;
  method: string;
  notes?: string;
  recordedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BatchFeedingSummaryRecord {
  id: number;
  batch: number;
  periodStart: string;
  periodEnd: string;
  totalFeedKg: number;
  averageBiomassKg?: number;
  averageFeedingPercentage?: number;
  feedConversionRatio?: number;
  totalFeedConsumedKg?: number;
  totalBiomassGainKg?: number;
  fcr?: number;
  createdAt: string;
  updatedAt: string;
}

