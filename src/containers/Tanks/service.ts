import {
    CELL_SIZE,
    SHELL_FPS,
    SHELL_IMAGE_BACKWARD,
    SHELL_IMAGE_FORWARD,
    SHELL_IMAGE_LEFT,
    SHELL_IMAGE_RIGHT,
    SHELL_SIZE,
    TANK_IMAGE_BACKWARD,
    TANK_IMAGE_FORWARD,
    TANK_IMAGE_LEFT,
    TANK_IMAGE_RIGHT,
    TANK_SIZE,
    TANK_SPAWN_POSITION_BOTTOM_LEFT,
    VIEWPORT_SIZE,
    ARENA_SIZE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { ICell } from 'models/Cell';
import { Shell } from 'models/Shell';
import { Tank, TankDirection } from 'models/Tank';
import { dispatch } from 'state/store';
import { applySelector } from 'state/services';

import { loadArenaMap } from '../Arena/state/actions';
import { getArenaMatrix } from '../Arena/state/selectors';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
const tankSprites: Map<string, HTMLImageElement> = new Map();
const shellSprites: Map<string, HTMLImageElement> = new Map();

const tank: Tank = new Tank({
    direction: TankDirection.FORWARD,
    position: TANK_SPAWN_POSITION_BOTTOM_LEFT,
});
const projectiles: Map<number, Shell> = new Map();

const setSize = () => {
    const { width, height } = getScreenDimension();
    const size = width > height ? height : width;
    canvas.width = size;
    canvas.height = size;
};

const clearScene = () => {
    context!.clearRect(0, 0, canvas.width, canvas.height);
};

const getTankImage = (tankDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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

const getShellImage = (shellDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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

const downloadTextures = async (): Promise<void> => {
    const imagePromises = [
        getTankImage(TankDirection.FORWARD),
        getTankImage(TankDirection.BACKWARD),
        getTankImage(TankDirection.RIGHT),
        getTankImage(TankDirection.LEFT),

        getShellImage(TankDirection.FORWARD),
        getShellImage(TankDirection.BACKWARD),
        getShellImage(TankDirection.RIGHT),
        getShellImage(TankDirection.LEFT),
    ];
    const [
        tankImageForward,
        tankImageBackward,
        tankImageRight,
        tankImageLeft,

        shellImageForward,
        shellImageBackward,
        shellImageRight,
        shellImageLeft,
    ] = await Promise.all(imagePromises);

    tankSprites.set(TankDirection.FORWARD, tankImageForward);
    tankSprites.set(TankDirection.BACKWARD, tankImageBackward);
    tankSprites.set(TankDirection.RIGHT, tankImageRight);
    tankSprites.set(TankDirection.LEFT, tankImageLeft);

    shellSprites.set(TankDirection.FORWARD, shellImageForward);
    shellSprites.set(TankDirection.BACKWARD, shellImageBackward);
    shellSprites.set(TankDirection.RIGHT, shellImageRight);
    shellSprites.set(TankDirection.LEFT, shellImageLeft);
};

const addKeyBindings = () => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        const key = event.keyCode || event.which;

        switch (key) {
            case 38: // UP Arrow
                if (tank.direction === TankDirection.FORWARD) {
                    if (canMove()) {
                        tank.move(TankDirection.FORWARD);
                    }
                } else {
                    tank.changeDirection(TankDirection.FORWARD);
                }
                break;
            case 40: // DOWN Arrow
                if (tank.direction === TankDirection.BACKWARD) {
                    if (canMove()) {
                        tank.move(TankDirection.BACKWARD);
                    }
                } else {
                    tank.changeDirection(TankDirection.BACKWARD);
                }
                break;
            case 39: // RIGHT Arrow
                if (tank.direction === TankDirection.RIGHT) {
                    if (canMove()) {
                        tank.move(TankDirection.RIGHT);
                    }
                } else {
                    tank.changeDirection(TankDirection.RIGHT);
                }
                break;
            case 37:
                if (tank.direction === TankDirection.LEFT) {
                    if (canMove()) {
                        tank.move(TankDirection.LEFT);
                    }
                } else {
                    tank.changeDirection(TankDirection.LEFT);
                }
                break;

            case 32:
                const shell = tank.fire();
                projectiles.set(shell.getId(), shell);
                break;
        }
    });
};

const render = () => {
    const shellRenderInterval = Math.round(1000 / SHELL_FPS);
    setInterval(() => {
        clearScene();
        renderTanksForOneFrame();
        renderShellsForOneFrame();
    }, shellRenderInterval);
};

const renderTanksForOneFrame = () => {
    context!.drawImage(
        tankSprites.get(tank.direction)!,
        tank.position.x,
        tank.position.y,
        TANK_SIZE,
        TANK_SIZE,
    );

    if (__DEV__) {
        context!.strokeStyle = '#FFFFFF';
        context!.lineWidth = 2;
        context!.strokeRect(tank.position.x, tank.position.y, TANK_SIZE, TANK_SIZE);
    }
};

const renderShellsForOneFrame = () => {
    if (projectiles.size > 0) {
        const projectilesToDestroy: number[] = [];
        projectiles.forEach((shell, id) => {
            const didImpact = isCollidingWithWorld(shell);
            if (!isWithinTheWorld(shell, SHELL_SIZE) || didImpact) {
                projectilesToDestroy.push(id);
                battleGround.registerImpactFrom(shell);
            } else {
                context!.clearRect(shell.position.x, shell.position.y, SHELL_SIZE, SHELL_SIZE);
                shell.move();
                context!.drawImage(
                    shellSprites.get(tank.direction)!,
                    shell.position.x,
                    shell.position.y,
                    SHELL_SIZE,
                    SHELL_SIZE,
                );
            }
        });

        projectilesToDestroy.forEach((id) => {
            console.log(`Deleting projectile with id ${id}`);
            projectiles.delete(id);
        });
    }
};

const canMove = (): boolean =>
        isWithinTheWorld(tank, TANK_SIZE) && !isCollidingWithWorld(tank);

const isWithinTheWorld = (object: Tank | Shell, objectSize: number): boolean => {
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

const isCollidingForward = (object: Tank | Shell) => {
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    const topLeft = object.position;
    const cellColumn = Math.floor(topLeft.x / CELL_SIZE);
    const cellRow = Math.floor((topLeft.y - object.speed) / CELL_SIZE);

    if (cellRow < 0) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn + i][cellRow];
        if (cell && object.willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

const isCollidingLeft = (object: Tank | Shell) => {
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    const topLeft = object.position;
    const cellColumn = Math.floor((topLeft.x - object.speed) / CELL_SIZE);
    const cellRow = Math.floor(topLeft.y / CELL_SIZE);

    if (cellColumn < 0) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn][cellRow + i];
        if (cell && object.willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

const isCollidingRight = (object: Tank | Shell) => {
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    const topLeft = object.position;
    const topRight = topLeft.changeX(object.size);
    const cellColumn = Math.floor((topRight.x + object.speed) / CELL_SIZE);
    const cellRow = Math.floor(topRight.y / CELL_SIZE);

    if (cellColumn >= ARENA_SIZE) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn][cellRow + i];
        if (cell && object.willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

const isCollidingBackward = (object: Tank | Shell) => {
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    const topLeft = object.position;
    const bottomLeft = topLeft.changeY(object.size);
    const cellColumn = Math.floor(bottomLeft.x / CELL_SIZE);
    const cellRow = Math.floor((bottomLeft.y + object.speed) / CELL_SIZE);

    if (cellRow >= ARENA_SIZE) {
        return true;
    }

    for (let i = 0; i <= object.occupiedCells; i++) {
        const cell = matrix[cellColumn + i][cellRow];
        if (cell && object.willCollideWithCell(cell)) {
            return true;
        }
    }
    return false;
};

const isCollidingWithWorld = (object: Tank | Shell) => {
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

const addDragNDropListeners = () => {

    const FileSelectHandler = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const file: File = event.dataTransfer!.files[0];

        if (file.type !== 'application/json') {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const serialisedGameData = event.target!.result;
            try {
                const parsedGameData: ICell[][] = JSON.parse(serialisedGameData as string);
                dispatch(loadArenaMap(parsedGameData));
            } catch (error) {
                console.error('Invalid Game Data', error);
            }
        };
        // Read in the image file as a data URL.
        reader.readAsText(file);
    };

    const FileDragHover = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };

    canvas.addEventListener('dragover', FileDragHover, false);
    canvas.addEventListener('dragleave', FileDragHover, false);
    canvas.addEventListener('drop', FileSelectHandler, false);
};

export const getTankViewCanvas = () => canvas;

export const initTankView = () => {
    setSize();
    clearScene();
    addDragNDropListeners();

    downloadTextures()
    .then(() => {
        addKeyBindings();
        render();
    });
};
