import { getScreenDimension } from 'helpers';

const CanvasContainer = document.createElement('canvas');

export const getCanvas = (): HTMLCanvasElement => {
    const screenDimension = getScreenDimension();
    CanvasContainer.width = screenDimension.width;
    CanvasContainer.height = screenDimension.height;
    return CanvasContainer;
};
