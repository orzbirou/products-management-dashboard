import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, finalize, map } from 'rxjs';

import { Product } from '../data-access/models/product.model';
import { ProductsApiService } from '../data-access/products-api.service';
import { DEFAULT_PRODUCTS_QUERY, ProductsQuery } from '../data-access/models/products-query.model';

import { applyProductsQuery, ProductsQueryResult } from './apply-products-query';
import { ProductsListState } from '../data-access/models/product-list-view';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  constructor(private api: ProductsApiService) {}

  private readonly allProductsSubject = new BehaviorSubject<Product[]>([]);
  public readonly allProducts$ = this.allProductsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this.errorSubject.asObservable();

  private readonly querySubject = new BehaviorSubject<ProductsQuery>(DEFAULT_PRODUCTS_QUERY);
  public readonly query$ = this.querySubject.asObservable();

  public readonly queryResult$ = combineLatest([this.allProducts$, this.query$]).pipe(
    map(([products, query]): ProductsQueryResult => applyProductsQuery(products, query))
  );

  // One stream for the list screen (keeps items/total in sync with page/pageSize)
  public readonly productsListView$ = combineLatest([this.queryResult$, this.query$]).pipe(
    map(([result, query]): ProductsListState => ({
      items: result.items,
      total: result.total,
      page: query.page,
      pageSize: query.pageSize,
    }))
  );

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

  setQuery(partial: Partial<ProductsQuery>): void {
    const current = this.querySubject.value;

    const next: ProductsQuery = { ...current, ...partial };

    const shouldResetPage =
      partial.q !== undefined ||
      partial.status !== undefined ||
      partial.sortBy !== undefined ||
      partial.sortDir !== undefined;

    if (shouldResetPage) {
      next.page = 0;
    }

    this.querySubject.next(next);
  }
}
