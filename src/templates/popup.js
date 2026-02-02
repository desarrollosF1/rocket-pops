export const modal = {
    template: (data)=> {
        return /* html */ `<div class="modal-container">
            <div class="card-container">
                <button class="button-dismiss">x</button>
                <div class="resource-container">
                    <img class="popup-image" src="${data.popup_asset}" alt="">
                </div>
                <div class="actions-container">
                    <button class="button-action cancel">Cancelar</button>
                    <button class="button-action confirm">Confirmar</button>
                </div>
            </div>
        </div>`
    }
}