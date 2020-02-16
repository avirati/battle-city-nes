import {
    TANK_IMAGE_BACKWARD,
    TANK_IMAGE_FORWARD,
    TANK_IMAGE_LEFT,
    TANK_IMAGE_RIGHT,
} from 'global/constants';
import { TankDirection } from 'models/Tank';

export const getTankImage = (tankDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    switch (tankDirection) {
        case TankDirection.FORWARD:
            image.src = TANK_IMAGE_FORWARD;
            break;
        case TankDirection.BACKWARD:
            image.src = TANK_IMAGE_BACKWARD;
            break;
        case TankDirection.RIGHT:
            image.src = TANK_IMAGE_RIGHT;
            break;
        case TankDirection.LEFT:
            image.src = TANK_IMAGE_LEFT;
            break;
    }

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});
