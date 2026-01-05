import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductUpsertDto } from './models/product-upsert.dto';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private readonly baseUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(dto: ProductUpsertDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, dto);
  }

  update(id: string, dto: ProductUpsertDto): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
