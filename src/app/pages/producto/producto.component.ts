import {Component, HostListener, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Product} from '../../model/product';
import {Router, RouterLink} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-producto',
  imports: [
    FormsModule,
    DatePipe,
    NgForOf,
    RouterLink,
    NgIf,
    ConfirmDialogComponent
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

  searchText = '';
  rowsPerPage = 5;
  private typingTimeout: any;
  filteredProducts: Product[] = [];
  products: Product[] = [];

  menuVisible = false;
  menuX = 0;
  menuY = 0;
  productoSeleccionado: Product | null = null;
  mostrarModal = false;

  skeletonRows = Array(this.rowsPerPage).fill(0);
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe(response => {
      this.products = response.data;
      this.isLoading = false;
      this.applyFilter();
    })
  }

  applyFilter() {
    const valBusqueda = this.searchText.toLowerCase();
    this.filteredProducts = valBusqueda ? this.products
      .filter(product =>
        product.name.toLowerCase().includes(valBusqueda.toLowerCase()) ||
        product.description.toLowerCase().includes(valBusqueda.toLowerCase()) ||
        product.id.toLowerCase().includes(valBusqueda.toLowerCase())
      ): this.products;

    this.updateFilteredProducts();
  }

  updateFilteredProducts(){
    this.filteredProducts = this.filteredProducts.slice(0, this.rowsPerPage);
    console.log(this.filteredProducts);
  }

  onItemsPerPageChange(): void {
    this.updateFilteredProducts();
  }

  onInput(event: any): void {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.applyFilter();
    }, 350)
  }

  abrirMenu(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.productoSeleccionado = product;
    this.menuVisible = true;
  }

  @HostListener('document:click')
  cerrarMenu(): void {
    this.menuVisible = false;
  }

  editar(product: Product){
    this.router.navigate(['pages/products/edit',product.id]);
  }

  abrirModal(producto: Product) {
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  eliminarProducto() {
    // lógica de eliminación
    this.productService.remove(this.productoSeleccionado.id).subscribe(response => {
      alert(response.message);
      this.productService.getAll().subscribe(response => {
        this.products = response.data;
        this.applyFilter();
      })
    });
    this.mostrarModal = false;
  }


}
