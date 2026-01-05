import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, Observable, startWith } from 'rxjs';
import { ProductsListState } from '../../data-access/models/product-list-view';
import { ProductsFacade } from '../../state/products.facade';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductStatusFilter } from '../../data-access/models/products-query.model';
import { ProductsApiService } from '../../data-access/products-api.service';
import { finalize } from 'rxjs';

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
  statusControl = new FormControl<ProductStatusFilter>('all', { nonNullable: true });

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
    private api: ProductsApiService
  ) {
    this.loading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
    this.view$ = this.facade.productsListView$;

    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((q) => this.facade.setQuery({ q }));

    this.statusControl.valueChanges
      .pipe(
        startWith(this.statusControl.value),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((status) => this.facade.setQuery({ status }));
  }

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onPageChange(e: PageEvent): void {
    this.facade.setQuery({ page: e.pageIndex, pageSize: e.pageSize });
  }

  onSortChange(sort: Sort): void {
    if (!sort.direction) {
      this.facade.setQuery({ sortBy: 'none', sortDir: 'asc' });
      return;
    }

    const sortBy = sort.active as 'name' | 'price' | 'createdAt';

    this.facade.setQuery({
      sortBy,
      sortDir: sort.direction,
    });
  }

  goToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/products', id]);
  }

  deleteProduct(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    this.deletingIds.add(id);
    this.api.delete(id)
      .pipe(
        finalize(() => this.deletingIds.delete(id))
      )
      .subscribe({
        next: () => {
          this.facade.loadAll();
        },
        error: (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }
}
