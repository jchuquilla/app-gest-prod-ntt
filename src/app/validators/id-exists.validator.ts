import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {ProductService} from '../services/product.service';

export function idExistsValidator(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const id = control.value;
    if (!id)
      return of(null); //No se valida si el campo de texto está vacío

    return productService.verifyIdentifier(id).pipe(
      map(exists => (exists ? { idExists: true } : null)),
      catchError(() => of(null)) // en caso de error, no bloquear el formulario
    );
  };
}
