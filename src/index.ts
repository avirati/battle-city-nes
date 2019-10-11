import { INVALID_CONTAINER_ID } from 'constants/errors';
import { getCanvas } from 'containers/canvas/Container';

const render = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    container.appendChild(getCanvas());
};

const startApp = () => {
    render(
        document.getElementById('app'),
    );
};

startApp();
