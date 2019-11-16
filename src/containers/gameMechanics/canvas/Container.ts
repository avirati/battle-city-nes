import {
    TANK_IMAGE_BACKWARD,
    TANK_IMAGE_FORWARD,
    TANK_IMAGE_LEFT,
    TANK_IMAGE_RIGHT,
    TANK_SIZE,
    TANK_SPAWN_POSITION_BOTTOM_LEFT,
    VIEWPORT_SIZE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { Tank, TankDirection } from 'models/Tank';

// import { canvas as battleGround } from '../../singlePlayer/canvas/Container';

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
        this.clearScene();
        this.context!.drawImage(
            this.imageMap.get(this.tank.direction)!,
            this.tank.position.x,
            this.tank.position.y,
            TANK_SIZE,
            TANK_SIZE,
        );
    }

    private addKeyBindings = () => {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            const key = event.keyCode || event.which;

            switch (key) {
                case 38: // UP Arrow
                    if (this.canMove(TankDirection.FORWARD)) {
                        this.tank.goForward();
                    }
                    break;
                case 40: // DOWN Arrow
                    if (this.canMove(TankDirection.BACKWARD)) {
                        this.tank.goBackward();
                    }
                    break;
                case 39: // RIGHT Arrow
                    if (this.canMove(TankDirection.RIGHT)) {
                        this.tank.goRight();
                    }
                    break;
                case 37:
                    if (this.canMove(TankDirection.LEFT)) {
                        this.tank.goLeft();
                    }
                    break;
            }

            this.renderScene();
        });
    }

    private canMove = (direction: TankDirection): boolean => {
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
}

export const canvas = new Canvas();
