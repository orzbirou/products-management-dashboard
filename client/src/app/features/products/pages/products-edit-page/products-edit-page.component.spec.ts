import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsEditPageComponent } from './products-edit-page.component';

describe('ProductsEditPageComponent', () => {
  let component: ProductsEditPageComponent;
  let fixture: ComponentFixture<ProductsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
