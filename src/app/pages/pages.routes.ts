import {Routes} from '@angular/router';
import {ProductoComponent} from './producto/producto.component';
import {ProductoEditarComponent} from './producto/producto-editar/producto-editar.component';

export const pagesRoutes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductoComponent },
  { path: 'products/new', component: ProductoEditarComponent },
  { path: 'products/edit/:id', component: ProductoEditarComponent }
]
