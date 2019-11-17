import { Coordinate } from './Coordinate';

export enum TankDirection {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD',
}

export const TANK_DEFAULT_SPEED = 3;
export const TANK_DEFAULT_HP = 100;

export interface ITankProps {
    direction: TankDirection;
    position: Coordinate;
}

export interface ITank extends ITankProps {
    HP: number;
    speed: number;

    move: (direction: TankDirection) => void;
    changeDirection: (direction: TankDirection) => void;
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

    public move = (direction: TankDirection) => {
        switch (direction) {
            case TankDirection.FORWARD:
                this.position.y -= this.speed;
                break;
            case TankDirection.BACKWARD:
                this.position.y += this.speed;
                break;
            case TankDirection.RIGHT:
                this.position.x += this.speed;
                break;
            case TankDirection.LEFT:
                this.position.x -= this.speed;
                break;
        }
    }

    public changeDirection = (direction: TankDirection) => this.direction = direction;
}
