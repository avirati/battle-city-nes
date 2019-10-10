import { INVALID_CONTAINER_ID } from './constants/errors';

const render = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }
};

const startApp = () => {
    render(
        document.getElementById('app'),
    );
};

startApp();
