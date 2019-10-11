import { getScreenDimension } from 'helpers';

const CanvasContainer = document.createElement('canvas');

export const getCanvas = (): HTMLCanvasElement => {
    const { width, height } = getScreenDimension();
    const size = width > height ? height : width;
    CanvasContainer.width = size;
    CanvasContainer.height = size;
    return CanvasContainer;
};
