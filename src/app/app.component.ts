import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductoComponent} from './pages/producto/producto.component';
import {LayoutComponent} from './pages/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductoComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-gest-prod-ntt';
}
