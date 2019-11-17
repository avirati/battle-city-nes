import {
    CELL_SIZE,
    TANK_IMAGE_BACKWARD,
    TANK_IMAGE_FORWARD,
    TANK_IMAGE_LEFT,
    TANK_IMAGE_RIGHT,
    TANK_SIZE,
    TANK_SIZE_IN_CELLS,
    TANK_SPAWN_POSITION_BOTTOM_LEFT,
    VIEWPORT_SIZE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { ICoordinate } from 'models/Coordinate';
import { Tank, TankDirection } from 'models/Tank';

import { canvas as battleGround } from '../../singlePlayer/canvas/Container';

class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private imageMap: Map<string, HTMLImageElement> = new Map();

    private tank: Tank;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.tank = new Tank({
            direction: TankDirection.FORWARD,
            position: TANK_SPAWN_POSITION_BOTTOM_LEFT,
        });

        this.setSize();
        this.clearScene();

        this.downloadTextures()
        .then(() => {
            this.addKeyBindings();
            this.renderScene();
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

    private downloadTextures = async (): Promise<void> => {
        const imagePromises = [
            this.getTankImage(TankDirection.FORWARD),
            this.getTankImage(TankDirection.BACKWARD),
            this.getTankImage(TankDirection.RIGHT),
            this.getTankImage(TankDirection.LEFT),
        ];
        const [
            tankImageForward,
            tankImageBackward,
            tankImageRight,
            tankImageLeft,
        ] = await Promise.all(imagePromises);
        this.imageMap.set(TankDirection.FORWARD, tankImageForward);
        this.imageMap.set(TankDirection.BACKWARD, tankImageBackward);
        this.imageMap.set(TankDirection.RIGHT, tankImageRight);
        this.imageMap.set(TankDirection.LEFT, tankImageLeft);
    }

    private renderScene = () => {
        const context = this.context!;
        this.clearScene();
        context.drawImage(
            this.imageMap.get(this.tank.direction)!,
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
                        if (this.canMove(TankDirection.FORWARD)) {
                            this.tank.move(TankDirection.FORWARD);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.FORWARD);
                    }
                    break;
                case 40: // DOWN Arrow
                    if (this.tank.direction === TankDirection.BACKWARD) {
                        if (this.canMove(TankDirection.BACKWARD)) {
                            this.tank.move(TankDirection.BACKWARD);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.BACKWARD);
                    }
                    break;
                case 39: // RIGHT Arrow
                    if (this.tank.direction === TankDirection.RIGHT) {
                        if (this.canMove(TankDirection.RIGHT)) {
                            this.tank.move(TankDirection.RIGHT);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.RIGHT);
                    }
                    break;
                case 37:
                    if (this.tank.direction === TankDirection.LEFT) {
                        if (this.canMove(TankDirection.LEFT)) {
                            this.tank.move(TankDirection.LEFT);
                        }
                    } else {
                        this.tank.changeDirection(TankDirection.LEFT);
                    }
                    break;
            }

            this.renderScene();
        });
    }

    private isAtEdgeOfTheWorld = (direction: TankDirection): boolean => {
        const tankPosition = this.tank.position;

        switch (direction) {
            case TankDirection.LEFT:
                return tankPosition.x > 0;
            case TankDirection.RIGHT:
                return tankPosition.x < VIEWPORT_SIZE - TANK_SIZE;
            case TankDirection.FORWARD:
                return tankPosition.y > 0;
            case TankDirection.BACKWARD:
                return tankPosition.y < VIEWPORT_SIZE - TANK_SIZE;
            default:
                return false;
        }
    }

    private isCollidingForward = (topLeft: ICoordinate) => {
        const arena = battleGround.getArena();
        const cellColumn = Math.floor(topLeft.x / CELL_SIZE);
        const cellRow = Math.floor((topLeft.y - this.tank.speed) / CELL_SIZE);

        for (let i = 0; i <= TANK_SIZE_IN_CELLS; i++) {
            const cell = arena.matrix[cellColumn + i][cellRow];
            if (cell && cell.willCollideWithTank()) {
                return false;
            }
        }
        return true;
    }

    private isCollidingLeft = (topLeft: ICoordinate) => {
        const arena = battleGround.getArena();
        const cellColumn = Math.floor((topLeft.x - this.tank.speed) / CELL_SIZE);
        const cellRow = Math.floor(topLeft.y / CELL_SIZE);

        for (let i = 0; i <= TANK_SIZE_IN_CELLS; i++) {
            const cell = arena.matrix[cellColumn][cellRow + i];
            if (cell && cell.willCollideWithTank()) {
                return false;
            }
        }
        return true;
    }

    private isCollidingRight = (topLeft: ICoordinate) => {
        const arena = battleGround.getArena();
        const topRight = topLeft.changeX(TANK_SIZE);
        const cellColumn = Math.floor((topRight.x + this.tank.speed) / CELL_SIZE);
        const cellRow = Math.floor(topRight.y / CELL_SIZE);

        for (let i = 0; i <= TANK_SIZE_IN_CELLS; i++) {
            const cell = arena.matrix[cellColumn][cellRow + i];
            if (cell && cell.willCollideWithTank()) {
                return false;
            }
        }
        return true;
    }

    private isCollidingBackward = (topLeft: ICoordinate) => {
        const arena = battleGround.getArena();
        const bottomLeft = topLeft.changeY(TANK_SIZE);
        const cellColumn = Math.floor(bottomLeft.x / CELL_SIZE);
        const cellRow = Math.floor((bottomLeft.y + this.tank.speed) / CELL_SIZE);

        for (let i = 0; i <= TANK_SIZE_IN_CELLS; i++) {
            const cell = arena.matrix[cellColumn + i][cellRow];
            if (cell && cell.willCollideWithTank()) {
                return false;
            }
        }
        return true;
    }

    private isCollidingWithObjects = (direction: TankDirection) => {
        const topLeft = this.tank.position;

        switch (direction) {
            case TankDirection.FORWARD:
                return this.isCollidingForward(topLeft);
            case TankDirection.LEFT:
                return this.isCollidingLeft(topLeft);
            case TankDirection.RIGHT:
                return this.isCollidingRight(topLeft);
            case TankDirection.BACKWARD:
                return this.isCollidingBackward(topLeft);
        }
        return true;
    }

    private canMove = (direction: TankDirection): boolean =>
        this.isAtEdgeOfTheWorld(direction) && this.isCollidingWithObjects(direction)

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
}

export const canvas = new Canvas();
