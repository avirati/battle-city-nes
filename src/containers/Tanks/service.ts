import { GamepadControls, IGamepadDOMEvents, IGamepadState } from 'containers/Gamepad/state/interfaces';
import {
    CELL_SIZE,
    SHELL_FPS,
    SHELL_SIZE,
    TANK_FPS,
    TANK_SIZE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { TankDirection } from 'models/Tank';
import { applySelector } from 'state/services';
import { dispatch } from 'state/store';

import { parseSerialisedMatrix } from '../Arena/helper';
import { loadArenaMap, registerImpactFromShell } from '../Arena/state/actions';
import { getArenaMatrixSelector } from '../Arena/state/selectors';
import {
    canMove,
    downloadShellSprites,
    downloadTankSprites,
    getShellSprite,
    getTankSprite,
    isCollidingWithWorld,
    isWithinTheWorld,
} from './helpers';
import { destroyShells, fireTank, moveShell, moveTank, turnTank } from './state/actions';
import { playerTankSelector, shellsSelector, tanksSelector } from './state/selectors';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
const dialog: HTMLElement | null = document.getElementById('dialog');

const setSize = () => {
    const { width, height } = getScreenDimension();
    const size = width > height ? height : width;
    canvas.width = size;
    canvas.height = size;
};

const clearScene = () => {
    context!.clearRect(0, 0, canvas.width, canvas.height);
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
    const tanks = applySelector(tanksSelector);
    for (const ID in tanks) {
        if (tanks[ID]) {
            const tank = tanks[ID];
            context!.drawImage(
                getTankSprite(tank.type, tank.direction)!,
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
        }
    }
};

const renderShellsForOneFrame = () => {
    const shells = applySelector(shellsSelector);
    const shellsToDestroy: number[] = [];
    for (const shellID in shells) {
        if (shells[shellID]) {
            const shell = shells[shellID];
            const didImpact = isCollidingWithWorld(shell);
            if (!isWithinTheWorld(shell, SHELL_SIZE) || didImpact) {
                shellsToDestroy.push(shellID as any as number);
                dispatch(registerImpactFromShell(shell));
            } else {
                context!.clearRect(shell.position.x, shell.position.y, SHELL_SIZE, SHELL_SIZE);
                dispatch(moveShell(shell.ID));
                context!.drawImage(
                    getShellSprite(shell.direction)!,
                    shell.position.x,
                    shell.position.y,
                    SHELL_SIZE,
                    SHELL_SIZE,
                );
            }
        }
    }
    dispatch(destroyShells(shellsToDestroy));
};

const addDragNDropListeners = () => {

    const FileSelectHandler = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const file: File = event.dataTransfer!.files[0];

        if (file.name.toLowerCase().indexOf('.level') === -1) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const serialisedGameData = event.target!.result;
            try {
                const gameData = parseSerialisedMatrix(serialisedGameData as string);
                dispatch(loadArenaMap(gameData));
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

const addCellInspector = () => {
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        const x = event.offsetX;
        const y = event.offsetY;

        const cellColumn = Math.floor(x / CELL_SIZE);
        const cellRow = Math.floor(y / CELL_SIZE);

        const matrix = applySelector(getArenaMatrixSelector);

        const cell = matrix[cellColumn][cellRow];
        if (cell) {
            dialog!.innerText = cell.toString();
            dialog!.style.top = (event.clientY - 10) + 'px';
            dialog!.style.left = (event.clientX + 10) + 'px';
        }
    });

    canvas.addEventListener('mouseenter', () => {
        dialog!.style.display = 'block';
    });

    canvas.addEventListener('mouseleave', () => {
        dialog!.style.display = 'none';
    });
};

// Inspired from https://codepen.io/kevrowe/pen/qEgGVO
export const addKeyBindings = (gamepadKeyBindings: IGamepadState['keyBindings']) => {
    let direction: TankDirection;
    let movementTimeout: number = -1;

    const startMoving = () => {
        if (movementTimeout === -1) {
            move(direction);
        }
    };

    const stopMoving = () => {
        clearTimeout(movementTimeout);
        movementTimeout = -1;
    };

    const move = (direction: TankDirection) => {
        const playerTank = applySelector(playerTankSelector);
        switch (direction) {
            case TankDirection.FORWARD:
                if (playerTank.direction === TankDirection.FORWARD) {
                    if (canMove(playerTank)) {
                        dispatch(moveTank(playerTank.ID, TankDirection.FORWARD));
                    }
                } else {
                    dispatch(turnTank(playerTank.ID, TankDirection.FORWARD));
                }
                break;
            case TankDirection.BACKWARD: // DOWN Arrow
                if (playerTank.direction === TankDirection.BACKWARD) {
                    if (canMove(playerTank)) {
                        dispatch(moveTank(playerTank.ID, TankDirection.BACKWARD));
                    }
                } else {
                    dispatch(turnTank(playerTank.ID, TankDirection.BACKWARD));
                }
                break;
            case TankDirection.RIGHT: // RIGHT Arrow
                if (playerTank.direction === TankDirection.RIGHT) {
                    if (canMove(playerTank)) {
                        dispatch(moveTank(playerTank.ID, TankDirection.RIGHT));
                    }
                } else {
                    dispatch(turnTank(playerTank.ID, TankDirection.RIGHT));
                }
                break;
            case TankDirection.LEFT:
                if (playerTank.direction === TankDirection.LEFT) {
                    if (canMove(playerTank)) {
                        dispatch(moveTank(playerTank.ID, TankDirection.LEFT));
                    }
                } else {
                    dispatch(turnTank(playerTank.ID, TankDirection.LEFT));
                }
                break;
        }

        movementTimeout = setTimeout(move, TANK_FPS, direction);
    };

    const onKeyDown = (buttonName: GameControlButtonTypes | number) => {
        switch (buttonName) {
            case gamepadKeyBindings[GamepadControls.GAMEPAD_UP]: // UP Arrow
                direction = TankDirection.FORWARD;
                startMoving();
                break;
            case gamepadKeyBindings[GamepadControls.GAMEPAD_DOWN]: // DOWN Arrow
                direction = TankDirection.BACKWARD;
                startMoving();
                break;
            case gamepadKeyBindings[GamepadControls.GAMEPAD_RIGHT]: // RIGHT Arrow
                direction = TankDirection.RIGHT;
                startMoving();
                break;
            case gamepadKeyBindings[GamepadControls.GAMEPAD_LEFT]:
                direction = TankDirection.LEFT;
                startMoving();
                break;

            case gamepadKeyBindings[GamepadControls.GAMEPAD_SHOOT]:
                const playerTank = applySelector(playerTankSelector);
                dispatch(fireTank(playerTank.ID));
                break;
        }
    };

    const onKeyUp = (key: GameControlButtonTypes | number) => {
        if ([
            gamepadKeyBindings[GamepadControls.GAMEPAD_LEFT],
            gamepadKeyBindings[GamepadControls.GAMEPAD_DOWN],
            gamepadKeyBindings[GamepadControls.GAMEPAD_RIGHT],
            gamepadKeyBindings[GamepadControls.GAMEPAD_UP],
        ].includes(key)) {
            stopMoving();
        }
    };

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        const key = event.keyCode || event.which;
        onKeyDown(key);
    });

    document.addEventListener('gamepadkeydown', (event: Event) => {
        const { buttonName } = (event as CustomEvent<IGamepadDOMEvents>).detail;
        onKeyDown(buttonName);  // TODO: Multiple button press will not work here
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
        const key = event.keyCode || event.which;
        onKeyUp(key);
    });

    document.addEventListener('gamepadkeyup', (event: Event) => {
        const { buttonName } = (event as CustomEvent<IGamepadDOMEvents>).detail;
        onKeyUp(buttonName);  // TODO: Multiple button press will not work here
    });
};

export const getTankViewCanvas = () => canvas;

export const initTankView = async () => {
    setSize();
    clearScene();
    addDragNDropListeners();

    if (__DEV__) {
        addCellInspector();
    }

    await downloadTankSprites();
    await downloadShellSprites();
    render();
};
