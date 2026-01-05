import { Product } from "./product.model";

export interface ProductsListState {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}