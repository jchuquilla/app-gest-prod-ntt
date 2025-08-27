import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {fechaRevisionValidator} from '../../../validators/fecha-revision.validator';
import {Product} from '../../../model/product';
import {ProductService} from '../../../services/product.service';
import {idExistsValidator} from '../../../validators/id-exists.validator';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-producto-editar',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './producto-editar.component.html',
  styleUrl: './producto-editar.component.css'
})
export class ProductoEditarComponent implements OnInit{

  form: FormGroup;
  hoy: string;
  isEdit: boolean;
  idProducto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    const ahora = new Date();
    this.hoy = ahora.toISOString().split('T')[0]; // "2025-08-26"

    this.createForm();

    this.idProducto = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.idProducto;
    this.initForm();

  }

  initForm(){
    if(this.isEdit){
      this.productService.getOne(this.idProducto).subscribe(response => {
        const prod:Product = response;
        this.createForm();
        this.form.controls['id'].setValue(prod.id);
        this.form.controls['id'].disable();
        this.form.controls['nombre'].setValue(prod.name);
        this.form.controls['descripcion'].setValue(prod.description);
        this.form.controls['logo'].setValue(prod.logo);
        this.form.controls['fechaLiberacion'].setValue(prod.date_release);
        this.form.controls['fechaRevision'].setValue(prod.date_revision);
      });

    }
  }

  createForm(){
    this.form = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [idExistsValidator(this.productService)],
        updateOn: 'blur'
      }],
      nombre: new FormControl(null, [Validators.minLength(5), Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: new FormControl(null, [Validators.required]),
      fechaLiberacion: ['', Validators.required],
      fechaRevision: ['', Validators.required],
    },{validators: fechaRevisionValidator()});
  }

  onSubmit() {
    if (this.form.valid) {
      const product: Product = new Product();
      product.name = this.form.value['nombre'];
      product.description = this.form.value['descripcion'];
      product.logo = this.form.value['logo'];
      product.date_release  = this.form.value['fechaLiberacion'];
      product.date_revision  = this.form.value['fechaRevision'];
      if(!this.isEdit){
        product.id = this.form.value['id'];
        this.productService.createItem(product).subscribe(response => {
          this.router.navigate(['pages/products']);
          alert(response.message);
        });
      }else{
        this.productService.updateItem(this.idProducto, product).subscribe(response => {
          this.router.navigate(['pages/products']);
          alert(response.message);
        });
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.form.reset();
  }


}
