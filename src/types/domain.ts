
export interface SoldDomain extends Domain {
  status: 'sold';
  saleDate: string;
  salePrice: number;
  purchasePrice: number;
  roi: number;
  buyer?: string;
  marketplace?: string; // Add marketplace property
  saleNotes?: string;
}
