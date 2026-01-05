export type ProductStatusFilter = 'all' | 'active' | 'inactive';

export interface ProductsQuery {
  q: string;
  status: ProductStatusFilter;
  sortBy: 'none' | 'createdAt' | 'price' | 'name';
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export const DEFAULT_PRODUCTS_QUERY: ProductsQuery = {
  q: '',
  status: 'all',
  sortBy: 'none',
  sortDir: 'asc',
  page: 0,
  pageSize: 10
};

