/**
 * Librería FIFO para mostrar SweetAlerts secuenciales, sin solapamientos
 * @author Jamiel Jackson
 * @version 1.1.2
 */
const swalQueue = [];
let isSwapping = true;

const swapper = {
    fire: (swalData, callbackSwal = null) => {
        // Agregar a la cola
        // ========================================
        swalQueue.push({ swalData, callbackSwal });
        // Si no hay otro sweet alert en proceso, inicia el proceso de la cola
        // ========================================
        processQueue();
    },
    close: () => {
        // Cerrar todos los sweet alerts en proceso
        // ========================================
        Swal.close();
        // Llamar al método para procesar el siguiente en la cola si hay alguno
        // ========================================
        processQueue();
    },
}

/**
 * Procesa la cola de sweet alerts
 *
 * Verifica si hay sweet alerts en la cola y si no hay uno en proceso.
 * Si se cumplen las condiciones, saca el primer elemento de la cola y lo procesa.
 * Luego, una vez que se haya procesado, ejecuta el callback y finalmente
 * vuelve a llamar a este método para procesar el siguiente en la cola.
 * ========================================
 */
function processQueue() {
    // Evitar que se ejecute si no hay alertas en la cola o si hay otro alerta en proceso
    // ========================================
    if (!isSwapping || swalQueue.length === 0) return;
    // Ejecutar el primer alerta en la cola y lo saca para procesar el siguiente
    // ========================================
    const { swalData, callbackSwal } = swalQueue.shift();

    isSwapping = false;
    Swal.fire(swalData)
    .then((result) => {
        if (callbackSwal) {
            // Llamar callback, sea cual sea el resultado
            // ========================================
            callbackSwal(result);
        }
    })
    .finally(() => {
        // Si no hay más alertas en la cola, terminar el bucle
        // ========================================
        if (swalQueue.length === 0) {
            isSwapping = false;
            swalQueue.length = [];
            return; // No hay más alertas en la cola
        }
        isSwapping = true;
        processQueue(); // Procesar siguiente alerta
    });
}