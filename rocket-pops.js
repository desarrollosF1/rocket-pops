import { nits } from './data/nits.js';

const USER_NIT = localStorage.getItem('nit');
const eventModal = document.getElementById('modal-event');
const cardContainer = document.getElementById('modal-event-card-container');
const popImage = document.getElementById("popup-image-id");
const buttonConfirm = document.getElementById("confirm-button-id");
const cancelConfirm = document.getElementById("cancel-button-id");

// Botón para reasignación de funciones
let buttonConfirmAction = () => {};
let buttonCancelAction = () => {};

const eventsPopup = [{
    eventId: `RH1-A-${USER_NIT}`,
    resourceLink: "datastore/assets/popup/5000_productos.webp",
    frecuency: "daily",
    eventType: "image",
    rules: () => {
        return nits.includes(Number(USER_NIT))
    },
    action: () => {
        window.open('https://www.google.com', '_self');
    },
}];

let currentEventIndex = 0; // Índice actual de eventos

function checkRunEvent(index) {
    const eventPop = eventsPopup[index];
    if (!eventPop) return false;
    return eventPop.rules() && validateEvent({
        frecuency: eventPop.frecuency,
        eventId: eventPop.eventId
    });
}

function runCurrentEvent(index) {
    if (index >= eventsPopup.length) {
        console.log("Terminó la revisión de eventos.");
        return;
    }

    if (checkRunEvent(index)) {
        showModal(index);
    } else {
        runCurrentEvent(index + 1); // Siguiente iteración de eventos
    }
}

let isClickInside = false;

function showModal(index) {
    const eventPopData = eventsPopup[index];
    setModal(eventPopData);
    eventModal.style.display = 'flex';
    
    buttonConfirm.onclick = () => {
        buttonConfirmAction();
        hideModal(index);
    };
    
    cancelConfirm.onclick = () => {
        buttonCancelAction();
        hideModal(index);
    };

    window.addEventListener('keydown', handleEsc);
    cardContainer?.addEventListener('mousedown', () => { isClickInside = true; });
    window.addEventListener('mouseup', handleOutsideClick);
}

function setModal(eventPopData) {
    const { resourceLink, eventType, action, onCancel } = eventPopData;

    if (eventType === "image") {
        popImage.src = resourceLink;
    }

    buttonConfirmAction = action;
    buttonCancelAction = onCancel || (() => {
        localStorage.setItem(`show-once-${eventId}`, true);
        hideModal();
    });
}

function handleEsc(e) {
    if (e.key === 'Escape') hideModal();
}

function handleOutsideClick(event) {
    if (!cardContainer?.contains(event.target) && !isClickInside) {
        hideModal();
    }
    isClickInside = false;
}

function hideModal(index) {
    const dissmissTime = 300;
    cardContainer.style.animation = `slidedown ${dissmissTime/1000}s ease-in`;
    
    setTimeout(() => {
        eventModal.style.display = 'none';
        cardContainer.style.animation = ''; // Resetear animación
        
        // Limpiar eventos
        window.removeEventListener('keydown', handleEsc);
        window.removeEventListener('mouseup', handleOutsideClick);
        
        // Continuar con el siguiente evento
        runCurrentEvent(index + 1);
    }, dissmissTime);
}

function validateEvent(data) {
    const { frecuency = "daily", eventId = 'eventPromo' } = data;
    
    if (localStorage.getItem(`show-once-${eventId}`)) return false; 

    const today = new Date().toDateString();

    const strategies = {
        daily: () => {
            const lastViewed = localStorage.getItem(eventId);
            if (lastViewed !== today) {
                localStorage.setItem(eventId, today);
                return true;
            }
            return false;
        },
        once: () => {
            const key = `once-${eventId}-${USER_NIT}`;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, 'true');
                return true;
            }
            return false;
        },
        onLogin: () => {
            const sessionKey = `login-${eventId}`;
            if (!sessionStorage.getItem(sessionKey)) {
                sessionStorage.setItem(sessionKey, 'true');
                return true;
            }
            return false;
        }
    };

    return (strategies[frecuency] || strategies.daily)();
}

// Iniciar proceso
runCurrentEvent(currentEventIndex);