import { ICoordinate } from 'models/Coordinate';
import {  } from 'models/Shell';

export enum TankDirection {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD',
}

export enum TankType {
    PLAYER = 'PLAYER',
    BOT = 'BOT',
}

export interface ITankProps {
    direction: TankDirection;
    position: ICoordinate;
    type: TankType;
}

export interface ITank extends ITankProps {
    ID: string;
    HP: number;
    speed: number;
    size: number;
    occupiedCells: number;
    lastPosition: ICoordinate;
}

export interface IShellProps {
    direction: TankDirection;
    position: ICoordinate;
}

export interface IShell extends IShellProps {
    ID: string;
    speed: number;
    size: number;
    occupiedCells: number;
    lastPosition: ICoordinate;
}

export interface ITanksState {
    vehicles: {
        [ID: string]: ITank;
    };
    shells: {
        [ID: string]: IShell;
    };
    playerID: ITank['ID'];
}
