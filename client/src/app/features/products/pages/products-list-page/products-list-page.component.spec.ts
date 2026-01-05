import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductsApiService } from '../../data-access/products-api.service';
import { ProductsFacade } from '../../state/products.facade';
import { ProductsListPageComponent } from './products-list-page.component';

describe('ProductsListPageComponent', () => {
  let component: ProductsListPageComponent;
  let fixture: ComponentFixture<ProductsListPageComponent>;
  let mockFacade: jasmine.SpyObj<ProductsFacade>;
  let mockApiService: jasmine.SpyObj<ProductsApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockFacade = jasmine.createSpyObj(
      'ProductsFacade',
      ['loadAll', 'setQuery'],
      {
        loading$: of(false),
        error$: of(null),
        productsListView$: of({
          items: [],
          total: 0,
          page: 0,
          pageSize: 10,
        }),
      }
    );

    mockApiService = jasmine.createSpyObj('ProductsApiService', ['delete']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductsListPageComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductsFacade, useValue: mockFacade },
        { provide: ProductsApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockFacade.loadAll).toHaveBeenCalled();
  });

  it('should navigate to create page', () => {
    component.goToCreate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('should navigate to edit page with product id', () => {
    component.goToEdit('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '123']);
  });

  it('should update query when search control value changes', (done) => {
    setTimeout(() => {
      component.searchControl.setValue('test');
      setTimeout(() => {
        expect(mockFacade.setQuery).toHaveBeenCalledWith({ q: 'test' });
        done();
      }, 350);
    }, 50);
  });

  it('should update query when status control value changes', () => {
    component.statusControl.setValue('active');
    expect(mockFacade.setQuery).toHaveBeenCalledWith({ status: 'active' });
  });

  it('should delete product after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockApiService.delete.and.returnValue(of(undefined));

    component.deleteProduct('123', 'Test Product');

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Product"?'
    );
    expect(mockApiService.delete).toHaveBeenCalledWith('123');
  });

  it('should not delete product if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteProduct('123', 'Test Product');

    expect(mockApiService.delete).not.toHaveBeenCalled();
  });

  it('should track deleting state', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockApiService.delete.and.returnValue(of(undefined));

    expect(component.isDeleting('123')).toBe(false);
    component.deleteProduct('123', 'Test Product');
    expect(component.isDeleting('123')).toBe(false);
  });
});
