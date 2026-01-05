import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ProductsEditPageComponent } from './products-edit-page.component';

describe('ProductsEditPageComponent', () => {
  let component: ProductsEditPageComponent;
  let fixture: ComponentFixture<ProductsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsEditPageComponent, NoopAnimationsModule],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
