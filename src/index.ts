import { canvas } from 'containers/canvas/Container';
import { menu } from 'containers/menu/Container';
import { INVALID_CONTAINER_ID } from 'global/errors';

const render = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    container.appendChild(canvas.getCanvas());
    container.appendChild(menu.getContainer());
};

const startApp = () => {
    render(
        document.getElementById('app'),
    );
};

startApp();
