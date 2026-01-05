import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';
import { ProductUpsertFormComponent } from '../../ui/product-upsert-form/product-upsert-form.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products-create-page',
  standalone: true,
  imports: [ProductUpsertFormComponent],
  templateUrl: './products-create-page.component.html',
  styleUrl: './products-create-page.component.scss'
})
export class ProductsCreatePageComponent {
  saving = false;
  error: string | null = null;

  constructor(
    private api: ProductsApiService,
    private router: Router
  ) {}

  onCreate(dto: ProductUpsertDto): void {
    this.saving = true;
    this.error = null;

    this.api.create(dto)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to create product. Please try again.';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
