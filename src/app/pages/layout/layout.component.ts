import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ProductoComponent} from '../producto/producto.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, ProductoComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
