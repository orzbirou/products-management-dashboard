import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductUpsertDto } from '../../data-access/models/product-upsert.dto';

interface ProductForm {
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  status: FormControl<'active' | 'inactive' | 'draft'>;
  imgUrl: FormControl<string>;
}

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
  private fb = inject(NonNullableFormBuilder);

  @Input() initialValue: ProductUpsertDto | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() saving = false;
  @Input() error: string | null = null;

  @Output() submitted = new EventEmitter<ProductUpsertDto>();
  @Output() cancelled = new EventEmitter<void>();

  readonly form = this.fb.group<ProductForm>({
    name: this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(60),
    ]),
    description: this.fb.control('', [Validators.maxLength(300)]),
    price: this.fb.control(0, [Validators.required, Validators.min(0.01)]),
    status: this.fb.control('active', [Validators.required]),
    imgUrl: this.fb.control('', [Validators.pattern(/^https?:\/\/.+/)]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    const initialValueChange = changes['initialValue'];
    if (initialValueChange?.currentValue) {
      this.form.patchValue(initialValueChange.currentValue);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
