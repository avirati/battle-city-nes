import { IDimension } from 'interfaces';

import { VIEWPORT_SIZE } from 'global/constants';

export const getScreenDimension = (): IDimension => {
    return {
        height: VIEWPORT_SIZE,
        width: VIEWPORT_SIZE,
    };
};
