import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';

@Component({
  selector: 'app-product-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './product-upsert-form.component.html',
  styleUrls: ['./product-upsert-form.component.scss'],
})
export class ProductUpsertFormComponent implements OnChanges {
  @Input() initialValue: ProductUpsertDto | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() saving = false;
  @Input() error: string | null = null;

  @Output() submitted = new EventEmitter<ProductUpsertDto>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      description: ['', [Validators.maxLength(300)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      status: ['active' as 'active' | 'inactive', [Validators.required]],
      imgUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Product' : 'Edit Product';
  }

  get submitLabel(): string {
    return this.mode === 'create' ? 'Create' : 'Save';
  }
}
