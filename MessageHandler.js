class MessageCoroutine {
    static instancia;
    #fechaCreacion;
    #valor;
    #messages  = [];

    static #dispatcher = {}

    constructor() {
        if (MessageCoroutine.instancia) {
            return MessageCoroutine.instancia;
        }

        this.#fechaCreacion = new Date();
        this.#valor = "Soy la instancia única";
        this.#messages = [];

        MessageCoroutine.instancia = this;
    }


    // PENDIENTE DE TERMINAR
    saveMessage(messageData) {
        const { timer, message, action } = messageData;
        this.#messages.push(message);

        if (action && typeof action === 'function') {
            // action();
            MessageCoroutine.#dispatcher[action] = action;
        }

        if (callbackMethod == 'function') {
            callbackMethod();
        }

        if (timer) {
            setTimeout(() => {
                this.#messages = this.#messages.filter(msg => msg !== message);
            }, timer);
        }
    }

    async addQueueFIFO() {
        await esperarAccionUsuario('mi-tarea-1');
    }






    // Función que genera el bloqueo
    esperarAccionUsuario(id) {
        return new Promise((resolve) => {
            // Guardamos la capacidad de resolver esta promesa en nuestro objeto global
            despachador[id] = resolve;
        });
    }

    // Esta es la función que llamarías desde un onClick, un evento o un ID
    liberarTarea(id) {
        if (despachador[id]) {
            despachador[id](); // ¡Aquí se "despacha" la promesa!
            delete despachador[id]; // Limpiamos para no ocupar memoria
        }
    }







    get valor() {
        return this.#valor;
    }

    get fechaCreacion() {
        return this.#fechaCreacion;
    }

    get messages() {
        return this.#messages;
    }

    cambiarValor(nuevoTexto) {
        this.#valor = nuevoTexto;
    }

    agregarMensaje(mensaje) {
        this.#messages.push(mensaje);
    }
}

// Uso
const app1 = new MessageCoroutine();
const app2 = new MessageCoroutine();
console.log(app1.valor); // "Soy la instancia única"
console.log(app1 === app2); // true (misma instancia)