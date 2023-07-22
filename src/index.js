import {SocketClient} from './ws/SocketClient.js';
import {createToastifyStyle, hookIntoAutoUpdater, warningNotification} from './notifications.js';
import {CanvasPlacer} from './CanvasPlacer.js';
import {getAccessToken} from './util/session.js';
import {lang} from './lang/language.js';

const client = {
    ws: new SocketClient(),
    orderReference: createCanvas('place-userscript-order-reference'),
    orderPriority: createCanvas('place-userscript-order-priority'),
    placeReference: createCanvas('place-userscript-place-reference'),
    canvasPlacer: new CanvasPlacer(),
    completion: undefined
};

createToastifyStyle();
hookIntoAutoUpdater();
client.ws.connect(client);
(async function() {
    if (!await getAccessToken(client, false)) {
        warningNotification(lang().TOAST_SIGN_IN_REQUIRED, null, 100_000_000);
        return;
    }

    client.ws.enableCapability('place');
    client.canvasPlacer.startTimer(client);
})();
(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACE_USERSCRIPT_CLIENT = client;

function createCanvas(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 3000;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'none';
    canvas.id = id;
    document.body.appendChild(canvas);

    return ctx;
}
