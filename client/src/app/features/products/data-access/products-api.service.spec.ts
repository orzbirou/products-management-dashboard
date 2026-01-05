import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsApiService } from './products-api.service';
import { Product } from './models/product.model';
import { ProductUpsertDto } from './models/product-upsert.dto';

describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsApiService]
    });
    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all products', () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 10.99,
          status: 'active',
          imgUrl: 'http://example.com/img1.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      service.getAll().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(1);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getById', () => {
    it('should fetch a product by id', () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10.99,
        status: 'active',
        imgUrl: 'http://example.com/img1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      service.getById('1').subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('create', () => {
    it('should create a new product', () => {
      const dto: ProductUpsertDto = {
        name: 'New Product',
        description: 'New Description',
        price: 19.99,
        status: 'active',
        imgUrl: 'http://example.com/new.jpg'
      };

      const mockResponse: Product = {
        id: '2',
        ...dto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      service.create(dto).subscribe(product => {
        expect(product).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing product', () => {
      const dto: ProductUpsertDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 29.99,
        status: 'inactive',
        imgUrl: 'http://example.com/updated.jpg'
      };

      const mockResponse: Product = {
        id: '1',
        ...dto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      service.update('1', dto).subscribe(product => {
        expect(product).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a product', () => {
      service.delete('1').subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
