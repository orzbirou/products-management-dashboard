import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';
import { Product } from '../../data-access/models/product.model';
import { ProductUpsertFormComponent } from '../../ui/product-upsert-form/product-upsert-form.component';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-products-edit-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ProductUpsertFormComponent],
  templateUrl: './products-edit-page.component.html',
  styleUrl: './products-edit-page.component.scss'
})
export class ProductsEditPageComponent implements OnInit {
  productId: string | null = null;
  initialValue: ProductUpsertDto | null = null;
  loading = true;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductsApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProduct(this.productId);
      } else {
        this.error = 'Product ID is missing';
        this.loading = false;
      }
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.api.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (product: Product) => {
          this.initialValue = this.mapToDto(product);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load product. Please try again.';
        }
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
    if (!this.productId) {
      return;
    }

    this.saving = true;
    this.error = null;

    this.api.update(this.productId, dto)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to update product. Please try again.';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
