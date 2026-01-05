import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsCreatePageComponent } from './products-create-page.component';
import { ProductsApiService } from '../../data-access/products-api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsCreatePageComponent', () => {
  let component: ProductsCreatePageComponent;
  let fixture: ComponentFixture<ProductsCreatePageComponent>;
  let apiService: jasmine.SpyObj<ProductsApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ProductsApiService', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductsCreatePageComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductsApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ProductsApiService) as jasmine.SpyObj<ProductsApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ProductsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to products list on successful create', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 10.99,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    apiService.create.and.returnValue(of(mockProduct));

    component.onCreate({
      name: 'Test Product',
      price: 10.99,
      status: 'active'
    });

    expect(apiService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should set error on failed create', () => {
    apiService.create.and.returnValue(throwError(() => ({ error: { message: 'Failed to create' } })));

    component.onCreate({
      name: 'Test Product',
      price: 10.99,
      status: 'active'
    });

    expect(component.error).toBe('Failed to create');
  });

  it('should navigate to products list on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
