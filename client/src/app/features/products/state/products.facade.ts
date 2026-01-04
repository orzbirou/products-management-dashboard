import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { Product } from '../data-access/models/product.model';
import { ProductsApiService } from '../data-access/products-api.service';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  constructor(private api: ProductsApiService) {}

  private readonly allProductsSubject = new BehaviorSubject<Product[]>([]);
  public readonly allProducts$ = this.allProductsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this.errorSubject.asObservable();

  loadAll(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.api
      .getAll()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (products) => this.allProductsSubject.next(products),
        error: () => this.errorSubject.next('Failed to load products'),
      });
  }
}
