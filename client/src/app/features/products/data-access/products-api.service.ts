import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "./models/product.model";
import { Observable } from "rxjs";
import { ProductUpsertDto } from "./models/product-upsert.dto";

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
}
