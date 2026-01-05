import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ProductsListState } from '../../data-access/models/product-list-view';
import { ProductsFacade } from '../../state/products.facade';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
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
