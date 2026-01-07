import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';
import { Product } from '../../data-access/models/product.model';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductUpsertFormComponent } from '../../ui/product-upsert-form/product-upsert-form.component';

@Component({
  selector: 'app-products-edit-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ProductUpsertFormComponent],
  templateUrl: './products-edit-page.component.html',
  styleUrl: './products-edit-page.component.scss',
})
export class ProductsEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ProductsApiService);

  productId: string | null = null;
  initialValue: ProductUpsertDto | null = null;
  loading = true;
  saving = false;
  error: string | null = null;

  private readonly returnQueryParams: Params = 
    this.router.getCurrentNavigation()?.extras?.state?.['queryParams'] || {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.productId = id;
      this.loadProduct(id);
    } else {
      this.error = 'Product ID is missing';
      this.loading = false;
    }
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.api
      .getById(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (product: Product) => {
          this.initialValue = this.mapToDto(product);
        },
        error: (err: { error?: { message?: string } }) => {
          this.error = err?.error?.message || 'Failed to load product. Please try again.';
        },
      });
  }

  private mapToDto(product: Product): ProductUpsertDto {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      status: product.status,
      imgUrl: product.imgUrl,
    };
  }

  onUpdate(dto: ProductUpsertDto): void {
    if (!this.productId) return;

    this.saving = true;
    this.error = null;

    this.api
      .update(this.productId, dto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.navigateBack(),
        error: (err: { error?: { message?: string } }) => {
          this.error = err?.error?.message || 'Failed to update product. Please try again.';
        },
      });
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/products'], {
      queryParams: this.returnQueryParams,
    });
  }
}
