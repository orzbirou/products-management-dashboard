import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductUpsertFormComponent } from './product-upsert-form.component';

describe('ProductUpsertFormComponent', () => {
  let component: ProductUpsertFormComponent;
  let fixture: ComponentFixture<ProductUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductUpsertFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when name is empty', () => {
    expect(component.form.valid).toBeFalsy();
    expect(component.form.get('name')?.hasError('required')).toBeTruthy();
  });

  it('should not emit submitted when form is invalid', () => {
    spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(component.submitted.emit).not.toHaveBeenCalled();
  });

  it('should emit submitted when form is valid', () => {
    spyOn(component.submitted, 'emit');
    component.form.patchValue({
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      status: 'active',
      imgUrl: 'https://example.com/image.jpg',
    });
    component.onSubmit();
    expect(component.submitted.emit).toHaveBeenCalledWith({
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      status: 'active',
      imgUrl: 'https://example.com/image.jpg',
    });
  });

  it('should emit cancelled when cancel is clicked', () => {
    spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should patch form values when initialValue changes', () => {
    const initialValue = {
      name: 'Existing Product',
      description: 'Existing Description',
      price: 20.99,
      status: 'inactive' as const,
      imgUrl: 'https://example.com/existing.jpg',
    };
    component.initialValue = initialValue;
    component.ngOnChanges({
      initialValue: {
        currentValue: initialValue,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.form.value).toEqual(initialValue);
  });
});
