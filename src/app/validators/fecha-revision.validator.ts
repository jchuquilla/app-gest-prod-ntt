import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaRevisionValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const liberacion = group.get('fechaLiberacion')?.value;
    const revision = group.get('fechaRevision')?.value;

    if (!liberacion || !revision) return null;

    const fechaLiberacion = new Date(liberacion);
    const fechaRevision = new Date(revision);

    // Sumar 1 año exacto
    const fechaEsperada = new Date(fechaLiberacion);
    fechaEsperada.setFullYear(fechaLiberacion.getFullYear() + 1);

    const esValida =
      fechaRevision.getFullYear() === fechaEsperada.getFullYear() &&
      fechaRevision.getMonth() === fechaEsperada.getMonth() &&
      fechaRevision.getDate() === fechaEsperada.getDate();

    return esValida ? null : { revisionIncorrecta: true };
  };
}
