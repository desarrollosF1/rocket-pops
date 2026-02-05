import { rh1_nits } from './data/eventoData.js';
const USER_NIT = localStorage.getItem('nit');
const eventModal = document.getElementById('modal-event');
const cardContainer = document.getElementById('modal-event-card-container');

const eventsPopup = [{
    eventId: `RH1-A-${USER_NIT}`,
    resourceLink: "",
    frecuency: "daily",
    eventType: "youtube",
    rules: ()=> {
        const validNit = rh1_nits.filter(nit => USER_NIT == nit);
        if (validNit.length > 0) {
            return true;
        }
        return false;
    },
    action: ()=> {
        console.log("asdasdasda yeah!")
    },
}];

const currentEvent = { id: 0 };

function checkRunEvent(currentEventId) {
    const eventPop = eventsPopup[currentEventId]
    if (!eventPop.rules()) return false;
    if (!validateEvent({
            frecuency: eventPop.frecuency,
            eventId: eventPop.eventId
        })) return false;
    return true;
}

function runCurrentEvent(currentEventId) {
    if (checkRunEvent(currentEventId)) {
        showModal(currentEventId);
    } else {
        if (currentEvent.id > (eventsPopup.length - 1)) {
            console.log("asdasdsadas------------- Terminó");
        } else {
            currentEvent.id++
        }
    }
}
runCurrentEvent(currentEvent.id)

let isClickInside = false
function showModal(currentEventId) {
    const eventPopData = eventsPopup[currentEventId];
    eventModal.style.display = 'flex';
    const buttonConfirm = document.getElementById("confirm-button");
    buttonConfirm.addEventListener("click")

    window.addEventListener('keydown', hideModal());

    cardContainer?.addEventListener('mousedown', () => { isClickInside = true; });
    window.addEventListener('mouseup', handleOutsideClick);
    setModal(eventPopData);
}

const buttonConfirmAction = ()=> {
}

function setModal(eventPopData) {
    buttonConfirmAction = eventPopData.action
}

function handleOutsideClick(event) {
    if (!cardContainer?.contains(event.target) && !isClickInside) {
        hideModal();
    }
    isClickInside = false;
}

function dontShowAgain(currentEventId) {
    localStorage.getItem(`show-once-${currentEventId}`);
    hideModal();
}

function hideModal() {
    const dissmissTime = 300;
    cardContainer.style.animation = `slidedown ${dissmissTime/900}s ease-in`;
    setTimeout(() => {
        eventModal.style.display = 'none';
    }, dissmissTime);
}

/**
 * Función para validar si el evento ya fue mostrado el dia de hoy.
 * @returns boolean
 * @note Mientras existan comentarios y ChatGPT podemos saber que hace todo esto bloque de código
 * porque ya el día de mañana se me olvidará y solo Dios sabrá y la metodología CMDLA no funciona todo el tiempo.
 */
function validateEvent(data) {
    const { frecuency = "dialy", eventId = 'eventPromo' } = data;
    
    // Si ya existe la marca de "No mostrar más", retornamos false (No mostrar)
    const dontShow = localStorage.getItem(`show-once-${eventId}`);
    if (dontShow) return false; 

    const videoFrecuency = {
        dialy: () => {
            const today = new Date().toDateString(); // Futuro compañero o programador, es mejor usar toDateString para evitar error de mes
            const lastViewed = localStorage.getItem(eventId);

            if (lastViewed !== today) {
                localStorage.setItem(eventId, today);
                return true; // Se debe mostrar
            }
            return false; // Ya se vió hoy
        },
        once: () => {
            const key = `once-${eventId}-${CURRENT_NIT}`;
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

    return (videoFrecuency[frecuency] || videoFrecuency.dialy)();
}