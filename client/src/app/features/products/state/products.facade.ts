import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, finalize, map } from 'rxjs';

import { Product } from '../data-access/models/product.model';
import {
  DEFAULT_PRODUCTS_QUERY,
  ProductsQuery,
} from '../data-access/models/products-query.model';
import { ProductsApiService } from '../data-access/products-api.service';

import { ProductsListState } from '../data-access/models/product-list-view';
import {
  applyProductsQuery,
  ProductsQueryResult,
} from './apply-products-query';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  constructor(private api: ProductsApiService) {}

  // Core state: all products fetched from API
  private readonly allProductsSubject = new BehaviorSubject<Product[]>([]);
  public readonly allProducts$ = this.allProductsSubject.asObservable();

  // Loading and error state for UI feedback
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this.errorSubject.asObservable();

  // Current filter/sort/pagination state
  private readonly querySubject = new BehaviorSubject<ProductsQuery>(
    DEFAULT_PRODUCTS_QUERY
  );
  public readonly query$ = this.querySubject.asObservable();

  // Filtered and sorted products based on current query
  public readonly queryResult$ = combineLatest([
    this.allProducts$,
    this.query$,
  ]).pipe(
    map(
      ([products, query]): ProductsQueryResult =>
        applyProductsQuery(products, query)
    )
  );

  // Complete view state for list page (items + pagination info)
  public readonly productsListView$ = combineLatest([
    this.queryResult$,
    this.query$,
  ]).pipe(
    map(
      ([result, query]): ProductsListState => ({
        items: result.items,
        total: result.total,
        page: query.page,
        pageSize: query.pageSize,
      })
    )
  );

  // Fetch all products from API
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

  // Update query parameters and reset to page 0 when filters/sorting changes
  setQuery(partial: Partial<ProductsQuery>): void {
    const current = this.querySubject.value;

    const next: ProductsQuery = { ...current, ...partial };

    // Reset to first page when filters or sorting changes
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
