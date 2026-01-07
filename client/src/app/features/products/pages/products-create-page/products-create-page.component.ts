import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductUpsertFormComponent } from '../../ui/product-upsert-form/product-upsert-form.component';

@Component({
  selector: 'app-products-create-page',
  standalone: true,
  imports: [ProductUpsertFormComponent],
  templateUrl: './products-create-page.component.html',
  styleUrl: './products-create-page.component.scss',
})
export class ProductsCreatePageComponent {
  private readonly api = inject(ProductsApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  saving = false;
  error: string | null = null;

  private readonly returnQueryParams: Params = 
    this.router.getCurrentNavigation()?.extras?.state?.['queryParams'] || {};

  onCreate(dto: ProductUpsertDto): void {
    this.saving = true;
    this.error = null;

    this.api
      .create(dto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.navigateBack(),
        error: (err: { error?: { message?: string } }) => {
          this.error = err?.error?.message || 'Failed to create product. Please try again.';
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
