import { AsyncPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ProductsQueryResult } from '../../state/apply-products-query';
import { ProductsFacade } from '../../state/products.facade';



@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, DatePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './products-list-page.component.html',
  styleUrls: ['./products-list-page.component.scss'],
})
export class ProductsListPageComponent implements OnInit {
  public readonly loading$!: Observable<boolean>;
  public readonly error$!: Observable<string | null>;
  public readonly view$!: Observable<ProductsQueryResult>;

  displayedColumns: string[] = ['id','imgUrl', 'name', 'description', 'price', 'status', 'createdAt', 'updatedAt'];

  constructor(private facade: ProductsFacade) {
    this.loading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
    this.view$ = this.facade.view$;
  }

  ngOnInit(): void {
    this.facade.loadAll();
  }
}
