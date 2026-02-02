import { modal } from './templates/popup.js';
import { PopupManager } from './PopupManager.js';

const eventos = [
    {
        popup_asset: "src/assets/tibia_wallpaper.webp",
        type: "image",
        rules: {
            frequency: "once",
            action: async () => {
                const requestUrl = "https://pokeapi.co/api/v2/berry/1/";
                return await axios.get(requestUrl)
                    .then(res => console.log(res.data))
                    .catch(err => console.error(err));
            },
        },
    }
];

// Instanciamos y ejecutamos
const myPopup = new PopupManager(modal, eventos);
myPopup.init(0);