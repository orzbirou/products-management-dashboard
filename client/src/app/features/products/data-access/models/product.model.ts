export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imgUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
