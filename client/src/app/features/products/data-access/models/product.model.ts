export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imgUrl?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}
