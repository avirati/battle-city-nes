import { Canvas } from 'containers/canvas/Container';
import { INVALID_CONTAINER_ID } from 'global/errors';

const render = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    const canvas = new Canvas();

    container.appendChild(canvas.getCanvas());
};

const startApp = () => {
    render(
        document.getElementById('app'),
    );
};

startApp();
