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

    move: (direction: TankDirection) => void;
}

export class Shell implements IShell {
    public speed: number;
    public direction: TankDirection;
    public position: Coordinate;
    private id: number;

    constructor({ direction, position, id }: IShellConstructorProps) {
        this.speed = SHELL_DEFAULT_SPEED;
        this.direction = direction;
        this.position = position;
        this.id = id;
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

    public getId = () => this.id;
}

export const getShellInstance = ({ direction, position }: IShellProps) => new Shell({ direction, position, id: shellId++ });
