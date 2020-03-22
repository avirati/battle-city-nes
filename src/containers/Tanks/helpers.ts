import { getArenaMatrixSelector } from 'containers/Arena/state/selectors';
import {
    ARENA_SIZE,
    CELL_SIZE,
    COLLIDABLE_CELLS,
    SHELL_IMAGE_BACKWARD,
    SHELL_IMAGE_FORWARD,
    SHELL_IMAGE_LEFT,
    SHELL_IMAGE_RIGHT,
    TANK_SIZE,
    TANK_SPRITES,
    VIEWPORT_SIZE,
} from 'global/constants';
import { ICell } from 'models/Cell';
import { Coordinate } from 'models/Coordinate';
import { TankDirection, TankType } from 'models/Tank';
import { applySelector } from 'state/services';

import { IShell, ITank } from './state/interfaces';

const tankSprites: Map<string, HTMLImageElement> = new Map();
const shellSprites: Map<string, HTMLImageElement> = new Map();

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
        case TankType.BOT: {
            switch (tankDirection) {
                case TankDirection.FORWARD:
                    image.src = TANK_SPRITES.BOT_TANK_IMAGE.FORWARD;
                    break;
                case TankDirection.BACKWARD:
                    image.src = TANK_SPRITES.BOT_TANK_IMAGE.BACKWARD;
                    break;
                case TankDirection.RIGHT:
                    image.src = TANK_SPRITES.BOT_TANK_IMAGE.RIGHT;
                    break;
                case TankDirection.LEFT:
                    image.src = TANK_SPRITES.BOT_TANK_IMAGE.LEFT;
                    break;
            }
            break;
        }
    }

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});

const getSpriteKey = (type: TankType, direction: TankDirection) => `${type}_${direction}`;

export const downloadTankSprites = async () => {
    const imagePromises = [
        getTankImage(TankType.PLAYER, TankDirection.FORWARD),
        getTankImage(TankType.PLAYER, TankDirection.BACKWARD),
        getTankImage(TankType.PLAYER, TankDirection.RIGHT),
        getTankImage(TankType.PLAYER, TankDirection.LEFT),

        getTankImage(TankType.BOT, TankDirection.FORWARD),
        getTankImage(TankType.BOT, TankDirection.BACKWARD),
        getTankImage(TankType.BOT, TankDirection.RIGHT),
        getTankImage(TankType.BOT, TankDirection.LEFT),
    ];
    const [
        playerTankImageForward,
        playerTankImageBackward,
        playerTankImageRight,
        playerTankImageLeft,

        botTankImageForward,
        botTankImageBackward,
        botTankImageRight,
        botTankImageLeft,
    ] = await Promise.all(imagePromises);

    tankSprites.set(getSpriteKey(TankType.PLAYER, TankDirection.FORWARD), playerTankImageForward);
    tankSprites.set(getSpriteKey(TankType.PLAYER, TankDirection.BACKWARD), playerTankImageBackward);
    tankSprites.set(getSpriteKey(TankType.PLAYER, TankDirection.RIGHT), playerTankImageRight);
    tankSprites.set(getSpriteKey(TankType.PLAYER, TankDirection.LEFT), playerTankImageLeft);

    tankSprites.set(getSpriteKey(TankType.BOT, TankDirection.FORWARD), botTankImageForward);
    tankSprites.set(getSpriteKey(TankType.BOT, TankDirection.BACKWARD), botTankImageBackward);
    tankSprites.set(getSpriteKey(TankType.BOT, TankDirection.RIGHT), botTankImageRight);
    tankSprites.set(getSpriteKey(TankType.BOT, TankDirection.LEFT), botTankImageLeft);
};

export const willCollideWithCell = (cell: ICell) => COLLIDABLE_CELLS.includes(cell.type);

export const getTankSprite = (type: TankType, direction: TankDirection) => tankSprites.get(getSpriteKey(type, direction));

export const canMove = (tank: ITank): boolean => {
    return isWithinTheWorld(tank, TANK_SIZE) && !isCollidingWithWorld(tank);
};

export const isWithinTheWorld = (object: ITank | IShell, objectSize: number): boolean => {
    const position = object.position;

    switch (object.direction) {
        case TankDirection.LEFT:
            return position.x > 0;
        case TankDirection.RIGHT:
            return position.x < VIEWPORT_SIZE - objectSize;
        case TankDirection.FORWARD:
            return position.y > 0;
        case TankDirection.BACKWARD:
            return position.y < VIEWPORT_SIZE - objectSize;
        default:
            return false;
    }
};

export const isCollidingForward = (object: ITank | IShell) => {
    const matrix = applySelector(getArenaMatrixSelector);
    const topLeft = object.position;
    const cellColumn = Math.floor(topLeft.x / CELL_SIZE);
    const cellRow = Math.floor((topLeft.y - object.speed) / CELL_SIZE);

    if (cellRow < 0) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn + i][cellRow];
        if (cell && willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

export const isCollidingLeft = (object: ITank | IShell) => {
    const matrix = applySelector(getArenaMatrixSelector);
    const topLeft = object.position;
    const cellColumn = Math.floor((topLeft.x - object.speed) / CELL_SIZE);
    const cellRow = Math.floor(topLeft.y / CELL_SIZE);

    if (cellColumn < 0) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn][cellRow + i];
        if (cell && willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

export const isCollidingRight = (object: ITank | IShell) => {
    const matrix = applySelector(getArenaMatrixSelector);
    const { x, y } = object.position;
    const topLeft = new Coordinate(x, y);
    const topRight = topLeft.changeX(object.size);
    const cellColumn = Math.floor((topRight.x + object.speed) / CELL_SIZE);
    const cellRow = Math.floor(topRight.y / CELL_SIZE);

    if (cellColumn >= ARENA_SIZE) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn][cellRow + i];
        if (cell && willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

export const isCollidingBackward = (object: ITank | IShell) => {
    const matrix = applySelector(getArenaMatrixSelector);
    const { x, y } = object.position;
    const topLeft = new Coordinate(x, y);
    const bottomLeft = topLeft.changeY(object.size);
    const cellColumn = Math.floor(bottomLeft.x / CELL_SIZE);
    const cellRow = Math.floor((bottomLeft.y + object.speed) / CELL_SIZE);

    if (cellRow >= ARENA_SIZE) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn + i][cellRow];
        if (cell && willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

export const isCollidingWithWorld = (object: ITank | IShell) => {
    switch (object.direction) {
        case TankDirection.FORWARD:
            return isCollidingForward(object);
        case TankDirection.LEFT:
            return isCollidingLeft(object);
        case TankDirection.RIGHT:
            return isCollidingRight(object);
        case TankDirection.BACKWARD:
            return isCollidingBackward(object);
    }
    return true;
};

export const getShellImage = (shellDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    switch (shellDirection) {
        case TankDirection.FORWARD:
            image.src = SHELL_IMAGE_FORWARD;
            break;
        case TankDirection.BACKWARD:
            image.src = SHELL_IMAGE_BACKWARD;
            break;
        case TankDirection.RIGHT:
            image.src = SHELL_IMAGE_RIGHT;
            break;
        case TankDirection.LEFT:
            image.src = SHELL_IMAGE_LEFT;
            break;
    }

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});

export const downloadShellSprites = async (): Promise<void> => {
    const imagePromises = [
        getShellImage(TankDirection.FORWARD),
        getShellImage(TankDirection.BACKWARD),
        getShellImage(TankDirection.RIGHT),
        getShellImage(TankDirection.LEFT),
    ];
    const [
        shellImageForward,
        shellImageBackward,
        shellImageRight,
        shellImageLeft,
    ] = await Promise.all(imagePromises);

    shellSprites.set(TankDirection.FORWARD, shellImageForward);
    shellSprites.set(TankDirection.BACKWARD, shellImageBackward);
    shellSprites.set(TankDirection.RIGHT, shellImageRight);
    shellSprites.set(TankDirection.LEFT, shellImageLeft);
};

export const getShellSprite = (direction: TankDirection) => shellSprites.get(direction);
