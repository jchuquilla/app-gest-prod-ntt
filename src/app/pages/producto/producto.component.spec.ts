import {ProductoComponent} from './producto.component';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../model/product';
import {of} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('ProductoComponent', () => {

  let component: ProductoComponent;
  let fixture: ComponentFixture<ProductoComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProducts: Product[] = [
    { id: '111', name: 'Tarjeta Crédito', description: 'Tarjeta de Crédito', logo: 'TC', date_release: '', date_revision: '' },
    { id: '222', name: 'Tarjeta Débito', description: 'Tarjeta atada a Cuenta', logo: 'TD', date_release: '', date_revision: '' }
  ];

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll', 'remove']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ProductoComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductoComponent);
    component = fixture.componentInstance;

  });

  it('debe cargar productos y aplicar filtro al iniciar el componente', () => {
    productServiceSpy.getAll.and.returnValue(of({ data: mockProducts }));
    const spy = spyOn(component, 'applyFilter');

    component.ngOnInit();

    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(spy).toHaveBeenCalled();
  });

  it('debe filtrar productos por texto de búsqueda', () => {
    component.products = mockProducts;
    component.searchText = 'tarjeta créd';
    component.applyFilter();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain('Tarjeta Créd');
  });

  it('debe limitar productos según número de registros seleccionados', () => {
    component.filteredProducts = Array(10).fill(mockProducts[0]);
    component.rowsPerPage = 7; //selección número de registros
    component.updateFilteredProducts();

    expect(component.filteredProducts.length).toBe(7);
  });

  it('debe aplicar filtro simulando fin de escritura en la búsqued', fakeAsync(() => {
    const spy = spyOn(component, 'applyFilter');
    component.onInput({ target: { value: 'test' } });
    tick(350);
    expect(spy).toHaveBeenCalled();
  }));

  it('debe abrir el menú contextual con coordenadas y producto', () => {
    const mockEvent = new MouseEvent('contextmenu', { clientX: 100, clientY: 200 });
    const producto = mockProducts[0];

    component.abrirMenu(producto, mockEvent);

    expect(component.menuX).toBe(100);
    expect(component.menuY).toBe(200);
    expect(component.productoSeleccionado).toBe(producto);
    expect(component.menuVisible).toBeTrue();
  });

  it('debe cerrar el menú contextual', () => {
    component.menuVisible = true;
    component.cerrarMenu();
    expect(component.menuVisible).toBeFalse();
  });

  it('debe navegar al formulario de edición con el ID', () => {
    const producto = mockProducts[0];
    component.editar(producto);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['pages/products/edit', producto.id]);
  });

  it('debe mostrar y cerrar el modal correctamente', () => {
    const producto = mockProducts[0];
    component.abrirModal(producto);
    expect(component.mostrarModal).toBeTrue();
    expect(component.productoSeleccionado).toBe(producto);

    component.cerrarModal();
    expect(component.mostrarModal).toBeFalse();
  });

  it('debe eliminar producto y recargar lista', () => {
    const producto = mockProducts[0];
    component.productoSeleccionado = producto;

    productServiceSpy.remove.and.returnValue(of({ message: '"Product removed successfully' }));
    productServiceSpy.getAll.and.returnValue(of({ data: mockProducts }));
    const spy = spyOn(component, 'applyFilter');

    component.eliminarProducto();

    expect(productServiceSpy.remove).toHaveBeenCalledWith(producto.id);
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.mostrarModal).toBeFalse();
  });

})
