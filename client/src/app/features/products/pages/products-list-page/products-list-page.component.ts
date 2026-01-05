import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Observable, startWith } from 'rxjs';
import { ProductsListState } from '../../data-access/models/product-list-view';
import { ProductsFacade } from '../../state/products.facade';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
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


  displayedColumns: string[] = [
    'id',
    'imgUrl',
    'name',
    'description',
    'price',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor(private facade: ProductsFacade) {
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
}

