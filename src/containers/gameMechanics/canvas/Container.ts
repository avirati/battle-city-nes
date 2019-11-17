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
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { Shell } from 'models/Shell';
import { Tank, TankDirection } from 'models/Tank';

import { canvas as battleGround } from '../../singlePlayer/canvas/Container';

class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private tankSprites: Map<string, HTMLImageElement> = new Map();
    private shellSprites: Map<string, HTMLImageElement> = new Map();

    private tank: Tank;
    private projectiles: Map<number, Shell>;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.projectiles = new Map();

        this.tank = new Tank({
            direction: TankDirection.FORWARD,
            position: TANK_SPAWN_POSITION_BOTTOM_LEFT,
        });

        this.setSize();
        this.clearScene();

        this.downloadTextures()
        .then(() => {
            this.addKeyBindings();
            this.render();
        });

        if (__DEV__) {
            this.addCellInspector();
        }
    }

    public getCanvas = () => this.canvas;

    private setSize = () => {
        const { width, height } = getScreenDimension();
        const size = width > height ? height : width;
        this.canvas.width = size;
        this.canvas.height = size;
    }

    private clearScene = () => {
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private getTankImage = (tankDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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
    })

    private getShellImage = (shellDirection: TankDirection): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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
    })

    private downloadTextures = async (): Promise<void> => {
        const imagePromises = [
            this.getTankImage(TankDirection.FORWARD),
            this.getTankImage(TankDirection.BACKWARD),
            this.getTankImage(TankDirection.RIGHT),
            this.getTankImage(TankDirection.LEFT),

            this.getShellImage(TankDirection.FORWARD),
            this.getShellImage(TankDirection.BACKWARD),
            this.getShellImage(TankDirection.RIGHT),
            this.getShellImage(TankDirection.LEFT),
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

        this.tankSprites.set(TankDirection.FORWARD, tankImageForward);
        this.tankSprites.set(TankDirection.BACKWARD, tankImageBackward);
        this.tankSprites.set(TankDirection.RIGHT, tankImageRight);
        this.tankSprites.set(TankDirection.LEFT, tankImageLeft);

        this.shellSprites.set(TankDirection.FORWARD, shellImageForward);
        this.shellSprites.set(TankDirection.BACKWARD, shellImageBackward);
        this.shellSprites.set(TankDirection.RIGHT, shellImageRight);
        this.shellSprites.set(TankDirection.LEFT, shellImageLeft);
    }

    private renderTanksForOneFrame = () => {
        const context = this.context!;
        context.drawImage(
            this.tankSprites.get(this.tank.direction)!,
            this.tank.position.x,
            this.tank.position.y,
            TANK_SIZE,
            TANK_SIZE,
        );

        if (__DEV__) {
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 2;
            context.strokeRect(this.tank.position.x, this.tank.position.y, TANK_SIZE, TANK_SIZE);
        }
    }

    private addKeyBindings = () => {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            const key = event.keyCode || event.which;

            switch (key) {
                case 38: // UP Arrow
                    if (this.tank.direction === TankDirection.FORWARD) {
                        if (this.canMove()) {
                            this.tank.move(TankDirection.FORWARD);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.FORWARD);
                    }
                    break;
                case 40: // DOWN Arrow
                    if (this.tank.direction === TankDirection.BACKWARD) {
                        if (this.canMove()) {
                            this.tank.move(TankDirection.BACKWARD);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.BACKWARD);
                    }
                    break;
                case 39: // RIGHT Arrow
                    if (this.tank.direction === TankDirection.RIGHT) {
                        if (this.canMove()) {
                            this.tank.move(TankDirection.RIGHT);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.RIGHT);
                    }
                    break;
                case 37:
                    if (this.tank.direction === TankDirection.LEFT) {
                        if (this.canMove()) {
                            this.tank.move(TankDirection.LEFT);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.LEFT);
                    }
                    break;

                case 32:
                    const shell = this.tank.fire();
                    this.projectiles.set(shell.getId(), shell);
            }
        });
    }

    private isWithinTheWorld = (object: Tank | Shell, objectSize: number): boolean => {
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
    }

    private isCollidingForward = (object: Tank | Shell) => {
        const arena = battleGround.getArena();
        const topLeft = object.position;
        const cellColumn = Math.floor(topLeft.x / CELL_SIZE);
        const cellRow = Math.floor((topLeft.y - object.speed) / CELL_SIZE);

        if (cellRow <= 0) {
            return true;
        }

        for (let i = 0; i <= object.occupiedCells; i++) {
            const cell = arena.matrix[cellColumn + i][cellRow];
            if (cell && object.willCollideWithCell(cell)) {
                return true;
            }
        }
        return false;
    }

    private isCollidingLeft = (object: Tank | Shell) => {
        const arena = battleGround.getArena();
        const topLeft = object.position;
        const cellColumn = Math.floor((topLeft.x - object.speed) / CELL_SIZE);
        const cellRow = Math.floor(topLeft.y / CELL_SIZE);

        if (cellColumn <= 0) {
            return true;
        }

        for (let i = 0; i <= object.occupiedCells; i++) {
            const cell = arena.matrix[cellColumn][cellRow + i];
            if (cell && object.willCollideWithCell(cell)) {
                return true;
            }
        }
        return false;
    }

    private isCollidingRight = (object: Tank | Shell) => {
        const arena = battleGround.getArena();
        const topLeft = object.position;
        const topRight = topLeft.changeX(object.size);
        const cellColumn = Math.floor((topRight.x + object.speed) / CELL_SIZE);
        const cellRow = Math.floor(topRight.y / CELL_SIZE);

        if (cellColumn >= arena.size) {
            return true;
        }

        for (let i = 0; i <= object.occupiedCells; i++) {
            const cell = arena.matrix[cellColumn][cellRow + i];
            if (cell && object.willCollideWithCell(cell)) {
                return true;
            }
        }
        return false;
    }

    private isCollidingBackward = (object: Tank | Shell) => {
        const arena = battleGround.getArena();
        const topLeft = object.position;
        const bottomLeft = topLeft.changeY(object.size);
        const cellColumn = Math.floor(bottomLeft.x / CELL_SIZE);
        const cellRow = Math.floor((bottomLeft.y + object.speed) / CELL_SIZE);

        if (cellRow >= arena.size) {
            return true;
        }

        for (let i = 0; i <= object.occupiedCells; i++) {
            const cell = arena.matrix[cellColumn + i][cellRow];
            if (cell && object.willCollideWithCell(cell)) {
                return true;
            }
        }
        return false;
    }

    private isCollidingWithWorld = (object: Tank | Shell) => {
        switch (object.direction) {
            case TankDirection.FORWARD:
                return this.isCollidingForward(object);
            case TankDirection.LEFT:
                return this.isCollidingLeft(object);
            case TankDirection.RIGHT:
                return this.isCollidingRight(object);
            case TankDirection.BACKWARD:
                return this.isCollidingBackward(object);
        }
        return true;
    }

    private canMove = (): boolean =>
        this.isWithinTheWorld(this.tank, TANK_SIZE) && !this.isCollidingWithWorld(this.tank)

    private addCellInspector = () => {
        this.getCanvas().addEventListener('mousemove', (event: MouseEvent) => {
            const x = event.offsetX;
            const y = event.offsetY;

            const cellColumn = Math.floor(x / CELL_SIZE);
            const cellRow = Math.floor(y / CELL_SIZE);

            const cell = battleGround.getArena().matrix[cellColumn][cellRow];
            if (cell) {
                console.log(cell.toString());
            }
        });
    }

    private renderShellsForOneFrame = () => {
        if (this.projectiles.size > 0) {
            const context = this.context!;
            const projectilesToDestroy: number[] = [];
            this.projectiles.forEach((shell, id) => {
                if (!this.isWithinTheWorld(shell, SHELL_SIZE) || this.isCollidingWithWorld(shell)) {
                    projectilesToDestroy.push(id);
                } else {
                    context.clearRect(shell.position.x, shell.position.y, SHELL_SIZE, SHELL_SIZE);
                    shell.move();
                    context.drawImage(
                        this.shellSprites.get(this.tank.direction)!,
                        shell.position.x,
                        shell.position.y,
                        SHELL_SIZE,
                        SHELL_SIZE,
                    );
                }
            });

            projectilesToDestroy.forEach((id) => {
                console.log(`Deleting projectile with id ${id}`);
                this.projectiles.delete(id);
            });
        }
    }

    private render = () => {
        const shellRenderInterval = Math.round(1000 / SHELL_FPS);
        setInterval(() => {
            this.clearScene();
            this.renderTanksForOneFrame();
            this.renderShellsForOneFrame();
        }, shellRenderInterval);
    }
}

export const canvas = new Canvas();
