import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, Observable } from 'rxjs';
import { ProductsListState } from '../../data-access/models/product-list-view';
import { ProductStatusFilter } from '../../data-access/models/products-query.model';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductsFacade } from '../../state/products.facade';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    TitleCasePipe,
    DecimalPipe,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrls: ['./products-list-page.component.scss'],
})
export class ProductsListPageComponent implements OnInit {
  public readonly loading$!: Observable<boolean>;
  public readonly error$!: Observable<string | null>;
  public readonly view$!: Observable<ProductsListState>;

  searchControl = new FormControl<string>('', { nonNullable: true });
  statusControl = new FormControl<ProductStatusFilter>('all', {
    nonNullable: true,
  });

  deletingIds = new Set<string>();

  displayedColumns: string[] = [
    'id',
    'imgUrl',
    'name',
    'description',
    'price',
    'status',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  constructor(
    private facade: ProductsFacade,
    private router: Router,
    private route: ActivatedRoute,
    private api: ProductsApiService
  ) {
    this.loading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
    this.view$ = this.facade.productsListView$;

    const params = this.route.snapshot.queryParams;
    if (params['q']) {
      this.searchControl.setValue(params['q'], { emitEvent: false });
    }
    if (
      params['status'] &&
      ['all', 'active', 'inactive', 'draft'].includes(params['status'])
    ) {
      this.statusControl.setValue(params['status'], { emitEvent: false });
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((q) => {
        this.updateQueryParams({ q });
        this.facade.setQuery({ q });
      });

    this.statusControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((status) => {
        this.updateQueryParams({ status });
        this.facade.setQuery({ status });
      });
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const initialQuery: any = {};

    if (params['q']) initialQuery.q = params['q'];
    if (params['status']) initialQuery.status = params['status'];
    if (params['sortBy']) initialQuery.sortBy = params['sortBy'];
    if (params['sortDir']) initialQuery.sortDir = params['sortDir'];
    if (params['page']) initialQuery.page = parseInt(params['page'], 10);
    if (params['pageSize'])
      initialQuery.pageSize = parseInt(params['pageSize'], 10);

    if (Object.keys(initialQuery).length > 0) {
      this.facade.setQuery(initialQuery);
    }

    this.facade.loadAll();
  }

  onPageChange(e: PageEvent): void {
    this.updateQueryParams({ page: e.pageIndex, pageSize: e.pageSize });
    this.facade.setQuery({ page: e.pageIndex, pageSize: e.pageSize });
  }

  onSortChange(sort: Sort): void {
    if (!sort.direction) {
      this.updateQueryParams({ sortBy: 'none', sortDir: 'asc' });
      this.facade.setQuery({ sortBy: 'none', sortDir: 'asc' });
      return;
    }

    const sortBy = sort.active as 'name' | 'price' | 'createdAt';

    this.updateQueryParams({ sortBy, sortDir: sort.direction });
    this.facade.setQuery({
      sortBy,
      sortDir: sort.direction,
    });
  }

  private updateQueryParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  goToCreate(): void {
    this.router.navigate(['/products/new'], {
      state: { queryParams: this.route.snapshot.queryParams },
    });
  }

  goToEdit(id: string): void {
    this.router.navigate(['/products', id], {
      state: { queryParams: this.route.snapshot.queryParams },
    });
  }

  deleteProduct(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    this.deletingIds.add(id);
    this.api
      .delete(id)
      .pipe(finalize(() => this.deletingIds.delete(id)))
      .subscribe({
        next: () => {
          this.facade.loadAll();
        },
        error: (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.');
        },
      });
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }
}
