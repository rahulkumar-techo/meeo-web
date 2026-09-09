export interface FilterState {
  category: string;
  subCategory?: string;
  priceRange: [number, number];
  materials: string[];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  searchQuery: string;
  sortBy: string;
  viewMode: 'grid3' | 'grid4' | 'list';
}

export interface ReviewItem {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
  attributes?: {
    tactileFeel: string;
    durability: string;
    ergonomics: string;
  };
}
