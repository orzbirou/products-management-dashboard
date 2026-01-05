import { Routes } from '@angular/router';
import { ProductsCreatePageComponent } from './features/products/pages/products-create-page/products-create-page.component';
import { ProductsEditPageComponent } from './features/products/pages/products-edit-page/products-edit-page.component';
import { ProductsListPageComponent } from './features/products/pages/products-list-page/products-list-page.component';

export const routes: Routes = [
  { path: 'products', component: ProductsListPageComponent },
  { path: 'products/new', component: ProductsCreatePageComponent },
  { path: 'products/:id', component: ProductsEditPageComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];
