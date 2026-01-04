export interface ProductUpsertDto {
  name: string;
  description?: string;
  price: number;
  imgUrl?: string;
  status: 'active' | 'inactive';
}
