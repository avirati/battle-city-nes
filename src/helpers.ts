import { IDimension } from 'interfaces';

export const getScreenDimension = (): IDimension => {
    const docElem = document.documentElement;
    const body = document.body;
    const width = window.innerWidth || docElem.clientWidth || body.clientWidth;
    const height = window.innerHeight || docElem.clientHeight || body.clientHeight;

    return {
        height,
        width,
    };
};
