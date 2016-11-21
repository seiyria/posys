export class StockItem {
  id: number;
  sku: string;
  stockId: string;
  photoUrl: string;
  description: string;
  departmentId: number;
  taxable: boolean;
  cost: number;
  salePrice: number;
  quanity: number;
  reorderThreshold: number;
  reorderUpToAmount: number;

  constructor() { }
}
