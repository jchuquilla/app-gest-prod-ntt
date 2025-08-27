import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Product} from '../model/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController

  const mockProduct: Product = {
    id: '123',
    logo: 'logo.png',
    name: 'Tarjeta',
    description: 'Crédito',
    date_release: '2025-08-26',
    date_revision: '2026-08-26'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // asegura que no queden peticiones pendientes
  });

  it('debe obtener todos los productos', () => {
    service.getAll().subscribe(response => {
      expect(response.data.length).toBe(2);
    });

    const req = httpMock.expectOne(`${service['url']}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [mockProduct, { ...mockProduct, id: '456' }] });
  });

  it('debe obtener un producto por ID', () => {
    service.getOne('123').subscribe(response => {
      expect(response.data.id).toBe('123');
    });

    const req = httpMock.expectOne(`${service['url']}/123`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProduct });
  });

  it('debe crear un producto', () => {
    service.createItem(mockProduct).subscribe(response => {
      expect(response.message).toBe('Creado');
    });

    const req = httpMock.expectOne(`${service['url']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ message: 'Creado' });
  });

  it('debe actualizar un producto', () => {
    service.updateItem('123', mockProduct).subscribe(response => {
      expect(response.message).toBe('Actualizado');
    });

    const req = httpMock.expectOne(`${service['url']}/123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ message: 'Actualizado' });
  });

  it('debe eliminar un producto', () => {
    service.remove('123').subscribe(response => {
      expect(response.message).toBe('Eliminado');
    });

    const req = httpMock.expectOne(`${service['url']}/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Eliminado' });
  });

});
