import {
    TANK_SPRITES,
} from 'global/constants';
import { TankDirection, TankType } from 'models/Tank';

export const getTankImage = (tankType: TankType, tankDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    switch (tankType) {
        case TankType.PLAYER: {
            switch (tankDirection) {
                case TankDirection.FORWARD:
                    image.src = TANK_SPRITES.PLAYER_TANK_IMAGE.FORWARD;
                    break;
                case TankDirection.BACKWARD:
                    image.src = TANK_SPRITES.PLAYER_TANK_IMAGE.BACKWARD;
                    break;
                case TankDirection.RIGHT:
                    image.src = TANK_SPRITES.PLAYER_TANK_IMAGE.RIGHT;
                    break;
                case TankDirection.LEFT:
                    image.src = TANK_SPRITES.PLAYER_TANK_IMAGE.LEFT;
                    break;
            }
            break;
        }
    }

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});
