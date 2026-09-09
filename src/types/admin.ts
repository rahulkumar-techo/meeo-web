export interface SalesMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Archival Preorder';
}

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemsCount: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  createdAt: string;
}
