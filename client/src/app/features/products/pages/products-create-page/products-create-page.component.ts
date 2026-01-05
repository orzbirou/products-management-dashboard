import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  saving = false;
  error: string | null = null;
  private returnQueryParams: any = {};

  constructor(
    private api: ProductsApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.returnQueryParams = navigation?.extras?.state?.['queryParams'] || {};
  }

  onCreate(dto: ProductUpsertDto): void {
    this.saving = true;
    this.error = null;

    this.api
      .create(dto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/products'], {
            queryParams: this.returnQueryParams,
          });
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Failed to create product. Please try again.';
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/products'], {
      queryParams: this.returnQueryParams,
    });
  }
}
