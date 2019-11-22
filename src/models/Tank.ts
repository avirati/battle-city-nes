import { SHELL_SIZE, TANK_SIZE, TANK_SIZE_IN_CELLS } from 'global/constants';

import { Cell, CellType } from './Cell';
import { Coordinate } from './Coordinate';
import { getShellInstance } from './Shell';

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
    size: number;
    occupiedCells: number;

    move: (direction: TankDirection) => void;
    fire: () => void;
    changeDirection: (direction: TankDirection) => void;
    willCollideWithCell: (cell: Cell) => boolean;
}

export class Tank implements ITank {
    public HP: number;
    public speed: number;
    public direction: TankDirection;
    public position: Coordinate;
    public size: number;
    public occupiedCells: number;

    constructor({ direction, position }: ITankProps) {
        this.HP = TANK_DEFAULT_HP;
        this.speed = TANK_DEFAULT_SPEED;
        this.direction = direction;
        this.position = position;
        this.size = TANK_SIZE;
        this.occupiedCells = TANK_SIZE_IN_CELLS;
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

    public fire = () => {
        const shellPosition = this.getShellPosition();
        return getShellInstance({ direction: this.direction, position: new Coordinate(shellPosition.x, shellPosition.y) });
    }

    public willCollideWithCell = (cell: Cell) => [CellType.BRICK, CellType.EAGLE, CellType.STEEL, CellType.WATER].includes(cell.type);

    private getShellPosition = (): Coordinate => {
        switch (this.direction) {
            case TankDirection.FORWARD:
                return this.position
                        .changeX((TANK_SIZE - SHELL_SIZE) / 2)
                        .changeY(SHELL_SIZE);
            case TankDirection.RIGHT:
                return this.position
                    .changeX(TANK_SIZE - SHELL_SIZE)
                    .changeY((TANK_SIZE - SHELL_SIZE) / 2);
            case TankDirection.BACKWARD:
                return this.position
                    .changeX((TANK_SIZE - SHELL_SIZE) / 2)
                    .changeY(TANK_SIZE - SHELL_SIZE);
            case TankDirection.LEFT:
                return this.position
                    .changeX(SHELL_SIZE)
                    .changeY((TANK_SIZE - SHELL_SIZE) / 2);
            default:
                return this.position;
        }
    }
}
