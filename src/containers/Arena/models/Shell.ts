import { SHELL_SIZE, SHELL_SIZE_IN_CELLS } from 'global/constants';

import { Cell, CellType } from './Cell';
import { Coordinate } from './Coordinate';
import { TankDirection } from './Tank';

let shellId = 0;

const SHELL_DEFAULT_SPEED = 10;

interface IShellProps {
    direction: TankDirection;
    position: Coordinate;
}

interface IShellConstructorProps extends IShellProps {
    id: number;
}

interface IShell extends IShellProps {
    speed: number;
    size: number;
    occupiedCells: number;

    move: (direction: TankDirection) => void;
    getId: () => number;
    willCollideWithCell: (cell: Cell) => boolean;
}

export class Shell implements IShell {
    public speed: number;
    public direction: TankDirection;
    public position: Coordinate;
    public size: number;
    public occupiedCells: number;

    private id: number;

    constructor({ direction, position, id }: IShellConstructorProps) {
        this.speed = SHELL_DEFAULT_SPEED;
        this.direction = direction;
        this.position = position;
        this.id = id;
        this.size = SHELL_SIZE;
        this.occupiedCells = SHELL_SIZE_IN_CELLS;
    }

    public move = () => {
        switch (this.direction) {
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

    public getId = () => this.id;

    public willCollideWithCell = (cell: Cell) => [CellType.BRICK, CellType.EAGLE, CellType.STEEL].includes(cell.type);
    public willDestroyCell = (cell: Cell) => [CellType.BRICK, CellType.EAGLE].includes(cell.type);
}

export const getShellInstance = ({ direction, position }: IShellProps) => new Shell({ direction, position, id: shellId++ });
