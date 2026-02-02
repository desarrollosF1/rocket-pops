export class PopupManager {
    constructor(modalTemplate, eventos) {
        this.modalTemplate = modalTemplate;
        this.eventos = eventos;
        this.body = document.querySelector('body');
        this.dismissTime = 300; // ms
        this.isClickInside = false;
        
        // Referencias a elementos (se llenan al renderizar)
        this.elements = {};
    }

    /**
     * Inicializa el popup basado en el índice del evento ❤️🙂
     */
    
    init(eventIndex = 0) {
        const evento = this.eventos[eventIndex];
        if (!evento) return;

        this._render(evento);
        this._cacheElements();
        this._bindEvents(evento);
    }

    _render(evento) {
        // Inyectamos el HTML
        this.body.insertAdjacentHTML('afterbegin', this.modalTemplate.template(evento));
    }

    _cacheElements() {
        this.elements = {
            modal: document.querySelector('.modal-container'),
            card: document.querySelector('.card-container'),
            dismiss: document.querySelector('.button-dismiss'),
            cancel: document.querySelector('.button-action.cancel'),
            confirm: document.querySelector('.button-action.confirm')
        };
        
        if (this.elements.modal) {
            this.elements.modal.style.display = 'flex';
        }
    }

    _bindEvents(evento) {
        // Cierre simple
        this.elements.dismiss?.addEventListener('click', () => this.close());
        this.elements.cancel?.addEventListener('click', () => this.close());

        // Acción de Confirmar (Promesa)
        this.elements.confirm?.addEventListener('click', async () => {
            if (evento.rules?.action) {
                try {
                    await evento.rules.action();
                } finally {
                    this.close();
                }
            } else {
                this.close();
            }
        });

        // Eventos Globales (Esc y Click fuera)
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleEscKey = this._handleEscKey.bind(this);

        window.addEventListener('keydown', this._handleEscKey);
        this.elements.card?.addEventListener('mousedown', () => { this.isClickInside = true; });
        window.addEventListener('mouseup', this._handleOutsideClick);
    }

    _handleEscKey(event) {
        if (event.key === 'Escape') this.close();
    }

    _handleOutsideClick(event) {
        if (!this.elements.card?.contains(event.target) && !this.isClickInside) {
            this.close();
        }
        this.isClickInside = false;
    }

    close() {
        if (!this.elements.card) return;

        // Animación de salida
        this.elements.card.style.animation = `slidedown ${this.dismissTime / 1000}s ease-in`;
        
        setTimeout(() => {
            this.elements.modal.style.display = 'none';
            this._destroy();
        }, this.dismissTime);
    }

    _destroy() {
        // Limpieza de event listeners globales para evitar fugas de memoria
        window.removeEventListener('keydown', this._handleEscKey);
        window.removeEventListener('mouseup', this._handleOutsideClick);
        // Opcional: remover el HTML del DOM
        this.elements.modal?.remove();
    }
}