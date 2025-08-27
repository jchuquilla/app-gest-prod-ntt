export const environment = {
  PREFIJO: 'http',
  DOMINIO: 'localhost:3002',
  CONTEXTO: 'bp',
  get HOST(){
    return `${this.PREFIJO}://${this.DOMINIO}/${this.CONTEXTO}`;
  }
};
