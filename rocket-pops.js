import nits from './data/nits.js';
import { ids } from './data/eventsId.js';

const STRICT_MODE = true;
const USER_NIT = Number(localStorage.getItem('nit')) || 0;
const USER_DEPA = localStorage.getItem('depaId') || -1;

const eventModal = document.getElementById('modal-event-card-container');
const cardContainer = document.getElementById('modal-card-container');
const popImage = document.getElementById("popup-image-id");
const buttonConfirm = document.getElementById("confirm-button-id");
const cancelConfirm = document.getElementById("cancel-button-id");
const closeConfirm = document.getElementById("close-button-id");

let buttonConfirmAction = () => {};
let buttonCancelAction = () => {};
let eventTemporalityCallback = () => {};
let currentEventIndex = 0;

const eventsPopup = [
    {
        eventId: `${ids.renovacionEnero}-${USER_NIT}`,
        resourceLink: "datastore/assets/popup/Renovacion_anticipada_v3.webp",
        frecuency: "daily",
        eventType: "image",
        rules: () => {
            return nits.includes(USER_NIT);
        },
        action: () => {
            window.open('https://wa.me/message/DDIFZKHNVRTON1', "_blank");
        },
        onCancel: () => {
            hideModal(currentEventIndex);
        },
        buttonsTextConfirm: '¡RENUEVA AHORA AQUÍ!',
        buttonsTextCancel: 'NO VER MÁS',
    },
    {
        eventId: `${ids.rh1a}-${USER_NIT}`,
        resourceLink: "datastore/assets/popup/RH1_BOGOTA.webp",
        frecuency: "daily",
        eventType: "image",
        rules: () => {
            return USER_DEPA == 1;
        },
        action: () => {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSe-47oF9k2mTiVT_VdsXTy48pVHJaFQDdjRO0gGF5UkjyP6dw/viewform', '_blank');
        },
        buttonsTextConfirm: 'ACCEDE AL FORMULARIO OFICIAL DANDO CLIC AQUÍ',
        buttonsTextCancel: 'NO VER MÁS',
    },
    {
        eventId: `${ids.rh1b}-${USER_NIT}`,
        resourceLink: "datastore/assets/popup/RH1_BOYACA.webp",
        frecuency: "daily",
        eventType: "image",
        rules: () => {
            return USER_DEPA == 5;
        },
        action: () => {
            window.open('https://calidad.farmatizate.com/sgcformpgir', '_blank');
        },
        buttonsTextConfirm: 'DESCARGAR EL FORMATO DANDO CLIC AQUÍ',
        buttonsTextCancel: 'NO VER MÁS',
    }
];

// Validación de IDs duplicados
(function () {
    try {
        if (!STRICT_MODE) return false;
        const isRepeated = eventsPopup.some((event, index) => {
            return eventsPopup.findIndex(e => e.eventId === event.eventId) !== index;
        });
        if (isRepeated) {
            console.error("⚠️ Tienes IDs de eventos duplicados. Los IDs duplicados evitan que los eventos se validen secuencialmente.");
        }
    } catch (error) {
        console.error({"Error: ": error});
    }
})();

closeConfirm.onclick = () => {
    hideModal(currentEventIndex)
};

function checkRunEvent(index) {
    const eventPop = eventsPopup[index];
    if (!eventPop || !eventPop.eventId) return false;
    
    const { frecuency = 'daily', eventId, rules = () => true } = eventPop;
    return rules() && validateEvent({ frecuency, eventId });
}

function runCurrentEvent(index) {
    if (index >= eventsPopup.length) {
        console.log("✅ No hay más eventos por mostrar");
        return;
    }

    if (checkRunEvent(index)) {
        showModal(index);
    } else {
        runCurrentEvent(index + 1);
    }
}

let isClickInside = false;
// ✅ Referencias a los handlers para poder removerlos después
let escHandler = null;
let outsideClickHandler = null;

function showModal(index) {
    currentEventIndex = index; // ✅ Actualizar el índice actual
    const eventPopData = eventsPopup[index];
    
    eventModal.style.display = 'flex';
    setModal(eventPopData, index); // ✅ Pasar el índice

    // ✅ Botones con índice correcto
    buttonConfirm.onclick = () => {
        buttonConfirmAction();
        hideModal(index);
    };

    cancelConfirm.onclick = () => {
        buttonCancelAction();
        hideModal(index);
    };

    // ✅ Crear handlers con closure para capturar el índice
    escHandler = (e) => {
        if (e.key === 'Escape') {
            hideModal(index);
        }
    };

    outsideClickHandler = (event) => {
        if (!cardContainer?.contains(event.target) && !isClickInside) {
            hideModal(index);
        }
        isClickInside = false;
    };

    // Añadir event listeners
    window.addEventListener('keydown', escHandler);
    cardContainer?.addEventListener('mousedown', () => { isClickInside = true; });
    window.addEventListener('mouseup', outsideClickHandler);
}

function setModal(eventPopData, index) { // ✅ Recibir índice
    const {
        resourceLink,
        eventType,
        action,
        onCancel,
        eventId,
        buttonsTextConfirm = "CONFIRMAR",
        buttonsTextCancel = "NO VOLVER A VER"
    } = eventPopData;

    buttonConfirm.innerHTML = buttonsTextConfirm;
    cancelConfirm.innerHTML = buttonsTextCancel;
    
    if (eventType === "image") {
        popImage.src = resourceLink;
    }

    // ✅ Las acciones solo ejecutan la lógica del negocio, no cierran el modal
    buttonConfirmAction = action || (() => {});
    
    buttonCancelAction = onCancel || (() => {
        // ✅ Marcar como "no volver a ver"
        localStorage.setItem(`show-once-${eventId}`, true);
    });
}

function hideModal(index) {
    const dissmissTime = 300;
    cardContainer.style.animation = `slidedown ${dissmissTime/1000}s ease-in`;
    popImage.src = "";
    
    // ✅ AQUÍ registras el evento (cuando se cierra el modal)
    eventTemporalityCallback();
    
    // Resetear callbacks
    buttonConfirmAction = () => {};
    buttonCancelAction = () => {};
    eventTemporalityCallback = () => {};

    buttonConfirm.innerHTML = "";
    cancelConfirm.innerHTML = "";

    setTimeout(() => {
        eventModal.style.display = 'none';
        cardContainer.style.animation = '';

        // ✅ Limpiar eventos usando las referencias guardadas
        if (escHandler) {
            window.removeEventListener('keydown', escHandler);
            escHandler = null;
        }
        if (outsideClickHandler) {
            window.removeEventListener('mouseup', outsideClickHandler);
            outsideClickHandler = null;
        }
        
        // ✅ Continuar con el siguiente evento (index es número)
        runCurrentEvent(index + 1);
    }, dissmissTime);
}

function validateEvent(data) {
    const { frecuency = "daily", eventId = 'eventPromo' } = data;
    
    // Si el usuario eligió "no volver a ver", no mostrar
    if (localStorage.getItem(`show-once-${eventId}`)) return false; 

    const today = new Date().toDateString();

    const strategies = {
        daily: () => {
            const lastViewed = localStorage.getItem(eventId);
            if (lastViewed !== today) {
                // ✅ Preparar el callback para registrar cuando se cierre
                eventTemporalityCallback = () => {
                    localStorage.setItem(eventId, today);
                    console.log(`✅ Evento registrado: ${eventId} - ${today}`);
                };
                return true;
            }
            return false;
        },
        once: () => {
            const key = `once-${eventId}-${USER_NIT}`;
            if (!localStorage.getItem(key)) {
                eventTemporalityCallback = () => {
                    localStorage.setItem(key, 'true');
                    console.log(`✅ Evento registrado (once): ${key}`);
                };
                return true;
            }
            return false;
        },
        onLogin: () => {
            const sessionKey = `login-${eventId}`;
            if (!sessionStorage.getItem(sessionKey)) {
                eventTemporalityCallback = () => {
                    sessionStorage.setItem(sessionKey, 'true');
                    console.log(`✅ Evento registrado (onLogin): ${sessionKey}`);
                };
                return true;
            }
            return false;
        }
    };

    return (strategies[frecuency] || strategies.daily)();
}

// Iniciar proceso
runCurrentEvent(currentEventIndex);








`
---- >  Flujo de ejecución

1. runCurrentEvent(0)
   ↓
2. checkRunEvent(0) → ¿Cumple reglas? → SÍ
   ↓
3. showModal(0)
   - Muestra el modal
   - currentEventIndex = 0
   - Asigna eventTemporalityCallback (pero NO lo ejecuta aún)
   ↓
4. Usuario hace clic en "Confirmar" o "Cancelar"
   ↓
5. hideModal(0)
   - eventTemporalityCallback() ✅ AQUÍ se registra el evento
   - Espera 300ms
   - runCurrentEvent(1) → Continúa con el siguiente

🧪 Para probar
javascript// En consola del navegador:

// 1. Configurar usuario de prueba
localStorage.setItem('nit', '999977755');
localStorage.setItem('depaId', '1'); // Bogotá

// 2. Limpiar registros previos
localStorage.removeItem('renovacion-enero-2025-999977755');
localStorage.removeItem('RH1A-999977755');

// 3. Recargar
location.reload();

// 4. Ver qué se registró después de cerrar el modal
console.log(localStorage);`