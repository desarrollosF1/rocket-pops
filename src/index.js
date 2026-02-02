class InterruptorBus {
  static #instancia;
  #queue = [];

  constructor() {
    if (InterruptorBus.#instancia) return InterruptorBus.#instancia;
    InterruptorBus.#instancia = this;
  }

  /**
   * @param {Object} configuracion
   * @param {any|Function} configuracion.accion - La promesa o función a ejecutar
   * @param {Function} configuracion.callback - Lo que se hace después
   */
  async procesar(configuracion) {
    const { accion, callback } = configuracion;

    try {
      // Promise.resolve es el "truco" agnóstico:
      // Si 'accion' es una función, la ejecuta. Si es un valor/promesa, la envuelve.
      const resultado = await (typeof accion === 'function' ? accion() : Promise.resolve(accion));

      // Si hay un callback, lo ejecutamos con el resultado de la promesa
      if (callback && typeof callback === 'function') {
        callback(resultado);
      }
      
      return resultado;
    } catch (error) {
      console.error("Error en el interruptor:", error);
      throw error;
    }
  }
}

// --- EJEMPLOS DE USO AGNÓSTICO ---

const bus = new InterruptorBus();

// 1. Caso API (Promesa directa)
bus.procesar({
  accion: fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json()),
  callback: (data) => console.log("API respondio:", data.title)
});

// 2. Caso Usuario/Lógica (Función que devuelve promesa)
bus.procesar({
  accion: () => new Promise(res => setTimeout(() => res("OK"), 2000)),
  callback: (res) => console.log("Proceso tardío terminado:", res)
});

// 3. Caso Valor simple (Ni siquiera es promesa)
bus.procesar({
  accion: "Valor inmediato",
  callback: (res) => console.log("Ejecución inmediata:", res)
});














class Notificador {
  // Aquí guardaremos todos los mensajes pendientes
  static #cola = [];
  static #visible = false;

  // Método estático: permite llamar a Notificador.mostrar() sin 'new'
  static mostrar(mensaje, opciones = {}) {
    const nuevoMensaje = { mensaje, ...opciones };
    
    // 1. Agregamos a la cola
    this.#cola.push(nuevoMensaje);
    
    // 2. Intentamos procesar
    this.#procesarCola();
  }

  static async #procesarCola() {
    // Si ya hay algo en pantalla, no hacemos nada; el actual llamará a esto al terminar
    if (this.#visible || this.#cola.length === 0) return;

    this.#visible = true;
    const actual = this.#cola.shift();

    // Lógica para mostrar el mensaje en el DOM
    await this.#renderizar(actual);

    // Al terminar (por tiempo o click), marcamos como no visible y seguimos
    this.#visible = false;
    this.#procesarCola();
  }

  static #renderizar(data) {
    return new Promise((resolve) => {
      console.log("Mostrando:", data.mensaje);
      
      // Simulamos que el mensaje dura 2 segundos o se cierra con un click
      setTimeout(() => {
        console.log("Mensaje cerrado");
        resolve();
      }, 2000);
    });
  }
}

// EL USUARIO SOLO HACE ESTO:
Notificador.mostrar("Primer mensaje");
Notificador.mostrar("Segundo mensaje (esperará al primero)");
Notificador.mostrar("Segundo mensaje (esperará al primero)");
Notificador.mostrar("Segundo mensaje (esperará al primero)");
Notificador.mostrar("Segundo mensaje (esperará al primero)");
Notificador.mostrar("Segundo mensaje (esperará al primero)");

// import { modal } from './templates/popup.js';
// const eventos = [
//     {
//         // popup_asset: "src/assets/game_asset.webp",
//         popup_asset: "src/assets/tibia_wallpaper.webp",
//         type: "image",
//         rules: {
//             frequency: "once",
//             action: async ()=>{
//                 const requestUrl = "https://pokeapi.co/api/v2/berry/1/";
//                 return await axios({
//                     method:'get',
//                     url: requestUrl
//                 }).then(function (response) {
//                     console.log(response.data);
//                 }).catch(function (error) {
//                     console.error("Error fetching data:", error);
//                 });
//             },
//         },
//     }
// ]

// const body = document.querySelector('body');
// function showAtFirst() {
//     body.insertAdjacentHTML('afterbegin', modal.template(eventos[0]));
//     const popupModal = document.querySelector('.modal-container');
//     const cardContainer = document.querySelector('.card-container');
//     const buttonDismiss = document.querySelector('.button-dismiss');
//     const buttonCancel = document.querySelector('.button-action.cancel');
//     const buttonConfirm = document.querySelector('.button-action.confirm');

//     popupModal.style.display = 'flex';
//     const dissmissTime = 300; //ms

//     buttonDismiss.addEventListener('click', () => {
//         closePopup();
//     });

//     buttonCancel.addEventListener('click', () => {
//         closePopup();
//     });

//     buttonConfirm.addEventListener('click', () => {
//         /**
//          * Aqui va la accion de confirmar.
//          * Esta acción debe ser una promesa si se quiere hacer algo asincrono antes de cerrar el popup.
//          * Ejemplo:
//          * eventos[0].rules.action().then(()=>{
//          *      closePopup();
//          * });
//          */
//         eventos[0].rules.action().finally(()=>{
//             closePopup();
//         });
//     });

//     window.addEventListener('keydown', (event) => {
//         if (event.key === 'Escape') {
//             closePopup();
//         }
//     });

//     let isClickInside = false;
//     cardContainer.addEventListener('mousedown', () => {
//         isClickInside = true;
//     });

//     window.addEventListener('mouseup', (event) => {
//         if (!cardContainer.contains(event.target) && !isClickInside) {
//             closePopup();
//         }
//         isClickInside = false;
//     });

//     function closePopup() {
//         cardContainer.style.animation = `slidedown ${dissmissTime/900}s ease-in`;
//         setTimeout(() => {
//             popupModal.style.display = 'none';
//         }, dissmissTime);
//     }
// }

// showAtFirst()
