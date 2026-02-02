class Singleton {
  constructor() {
    if (Singleton.instancia) {
      return Singleton.instancia;
    }

    this.fechaCreacion = new Date();
    this.valor = "Soy la instancia única";

    Singleton.instancia = this;
  }

  obtenerValor() {
    return this.valor;
  }
}

const instancia1 = new Singleton();
const instancia2 = new Singleton();

console.log(instancia1 === instancia2);