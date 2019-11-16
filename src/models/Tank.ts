import { Coordinate } from './Coordinate';

export enum TankDirection {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD',
}

export const TANK_DEFAULT_SPEED = 5;
export const TANK_DEFAULT_HP = 100;

export interface ITankProps {
    direction: TankDirection;
    position: Coordinate;
}

export interface ITank extends ITankProps {
    HP: number;
    speed: number;

    goForward: () => void;
    goBackward: () => void;
    goRight: () => void;
    goLeft: () => void;
}

export class Tank implements ITank {
    public HP: number;
    public speed: number;
    public direction: TankDirection;
    public position: Coordinate;

    constructor({ direction, position }: ITankProps) {
        this.HP = TANK_DEFAULT_HP;
        this.speed = TANK_DEFAULT_SPEED;
        this.direction = direction;
        this.position = position;
    }

    public goForward = () => {
        this.direction = TankDirection.FORWARD;
        this.position.y -= this.speed;
    }

    public goBackward = () => {
        this.direction = TankDirection.BACKWARD;
        this.position.y += this.speed;
    }

    public goRight = () => {
        this.direction = TankDirection.RIGHT;
        this.position.x += this.speed;
    }

    public goLeft = () => {
        this.direction = TankDirection.LEFT;
        this.position.x -= this.speed;
    }
}
