import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ProductStatusFilter, ProductsQuery } from '../../data-access/models/products-query.model';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductsFacade } from '../../state/products.facade';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule,
    AsyncPipe, DatePipe, TitleCasePipe, DecimalPipe,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrls: ['./products-list-page.component.scss'],
})
export class ProductsListPageComponent implements OnInit {
  private facade = inject(ProductsFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ProductsApiService);
  private destroyRef = inject(DestroyRef);

  public readonly loading$ = this.facade.loading$;
  public readonly error$ = this.facade.error$;
  public readonly view$ = this.facade.productsListView$;

  searchControl = new FormControl<string>('', { nonNullable: true });
  statusControl = new FormControl<ProductStatusFilter>('all', { nonNullable: true });

  deletingIds = new Set<string>();
  displayedColumns: string[] = ['id', 'imgUrl', 'name', 'description', 'price', 'status', 'createdAt', 'updatedAt', 'actions'];

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;

    this.initializeControls(params);
    this.setupFiltersSubscribers();

    this.facade.setQuery(this.parseParams(params));
    this.facade.loadAll();
  }

  private initializeControls(params: Params): void {
    if (params['q']) {
      this.searchControl.setValue(params['q'], { emitEvent: false });
    }
    const validStatuses: ProductStatusFilter[] = ['all', 'active', 'inactive', 'draft'];
    const statusFromParams = params['status'] as ProductStatusFilter;
    if (statusFromParams && validStatuses.includes(statusFromParams)) {
      this.statusControl.setValue(statusFromParams, { emitEvent: false });
    }
  }

  private setupFiltersSubscribers(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((q) => {
        const update = { q, page: 0 };
        this.updateQueryParams(update);
        this.facade.setQuery(update);
      });

    this.statusControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((status) => {
        const update = { status, page: 0 };
        this.updateQueryParams(update);
        this.facade.setQuery(update);
      });
  }

  private parseParams(params: Params): ProductsQuery {
    return {
      q: params['q'] || '',
      status: (params['status'] as ProductStatusFilter) || 'all',
      sortBy: (params['sortBy'] as any) || 'none',
      sortDir: (params['sortDir'] as 'asc' | 'desc') || 'asc',
      page: params['page'] ? parseInt(params['page'], 10) : 0,
      pageSize: params['pageSize'] ? parseInt(params['pageSize'], 10) : 10,
    };
  }

  onPageChange(e: PageEvent): void {
    const update = { page: e.pageIndex, pageSize: e.pageSize };
    this.updateQueryParams(update);
    this.facade.setQuery(update);
  }

  onSortChange(sort: Sort): void {
    const update = {
      sortBy: sort.direction ? (sort.active as any) : 'none',
      sortDir: (sort.direction as 'asc' | 'desc') || 'asc'
    };
    this.updateQueryParams(update);
    this.facade.setQuery(update);
  }

  private updateQueryParams(params: Partial<ProductsQuery & Params>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  deleteProduct(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    this.deletingIds.add(id);
    this.api.delete(id)
      .pipe(finalize(() => this.deletingIds.delete(id)))
      .subscribe({
        next: () => this.facade.loadAll(),
        error: () => alert('Failed to delete product.')
      });
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }

  goToCreate(): void {
    this.router.navigate(['/products/new'], { 
      state: { queryParams: this.route.snapshot.queryParams } 
    });
  }

  goToEdit(id: string): void {
    this.router.navigate(['/products', id], { 
      state: { queryParams: this.route.snapshot.queryParams } 
    });
  }
}
