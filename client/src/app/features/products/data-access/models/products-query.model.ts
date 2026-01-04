export interface ProductQuery {
  q: string;
  status?: 'active' | 'inactive';
  sortBy: 'createdAt' | 'price' | 'name';
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
