import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCreatePageComponent } from './products-create-page.component';

describe('ProductsCreatePageComponent', () => {
  let component: ProductsCreatePageComponent;
  let fixture: ComponentFixture<ProductsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
