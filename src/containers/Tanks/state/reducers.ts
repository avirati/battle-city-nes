import { v1 as uuid } from 'uuid';

import {
    SHELL_SIZE,
    SHELL_SIZE_IN_CELLS,
    TANK_SIZE,
    TANK_SIZE_IN_CELLS,
} from 'global/constants';
import { Coordinate } from 'models/Coordinate';
import { TankType } from 'models/Tank';

import { Actions, ActionTypes } from './actions';
import {
    SHELL_DEFAULT_SPEED,
    TANK_DEFAULT_HP,
    TANK_DEFAULT_SPEED,
} from './constants';
import { ITanksState, TankDirection } from './interfaces';

const initialState: ITanksState = {
    playerID: '',
    shells: {},
    vehicles: {},
};

let shellCounter = 0;

export const reducer = (state: ITanksState = initialState, action: Actions): ITanksState => {
    switch (action.type) {
        case ActionTypes.TANK_SPAWN: {
            const ID = uuid();
            return {
                ...state,
                playerID: action.data!.type === TankType.PLAYER ? ID : state.playerID,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        HP: TANK_DEFAULT_HP,
                        ID,
                        direction: action.data!.direction,
                        occupiedCells: TANK_SIZE_IN_CELLS,
                        position: action.data!.position,
                        size: TANK_SIZE,
                        speed: TANK_DEFAULT_SPEED,
                        type: action.data!.type,
                    },
                },
            };
        }
        case ActionTypes.TANK_MOVE: {
            const { ID, direction } = action.data!;
            const tank = state.vehicles[ID];
            let x = tank.position.x;
            let y = tank.position.y;
            switch (direction) {
                case TankDirection.FORWARD:
                    y -= tank.speed;
                    break;
                case TankDirection.BACKWARD:
                    y += tank.speed;
                    break;
                case TankDirection.RIGHT:
                    x += tank.speed;
                    break;
                case TankDirection.LEFT:
                    x -= tank.speed;
                    break;
            }
            return {
                ...state,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        ...tank,
                        position: {
                            ...tank.position,
                            x,
                            y,
                        },
                    },
                },
            };
        }
        case ActionTypes.TANK_TURN: {
            const { ID, direction } = action.data!;
            const tank = state.vehicles[ID];
            return {
                ...state,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        ...tank,
                        direction,
                    },
                },
            };
        }
        case ActionTypes.TANK_FIRE: {
            const { ID } = action.data!;
            const tank = state.vehicles[ID];
            const position = new Coordinate(tank.position.x, tank.position.y);
            let shellPosition = position;
            switch (tank.direction) {
                case TankDirection.FORWARD:
                    shellPosition = position
                        .changeX((TANK_SIZE - SHELL_SIZE) / 2)
                        .changeY(SHELL_SIZE);
                    break;
                case TankDirection.RIGHT:
                    shellPosition = position
                        .changeX(TANK_SIZE - SHELL_SIZE)
                        .changeY((TANK_SIZE - SHELL_SIZE) / 2);
                    break;
                case TankDirection.BACKWARD:
                    shellPosition = position
                        .changeX((TANK_SIZE - SHELL_SIZE) / 2)
                        .changeY(TANK_SIZE - SHELL_SIZE);
                    break;
                case TankDirection.LEFT:
                    shellPosition = position
                        .changeX(SHELL_SIZE)
                        .changeY((TANK_SIZE - SHELL_SIZE) / 2);
                    break;
            }
            const shellID = ++shellCounter;
            return {
                ...state,
                shells: {
                    ...state.shells,
                    [shellID]: {
                        ID: shellID,
                        direction: tank.direction,
                        occupiedCells: SHELL_SIZE_IN_CELLS,
                        position: shellPosition,
                        size: SHELL_SIZE,
                        speed: SHELL_DEFAULT_SPEED,
                    },
                },
            };
        }
        case ActionTypes.SHELL_MOVE: {
            const { ID } = action.data!;
            const shell = state.shells[ID];
            let { x, y } = shell.position;
            const { speed } = shell;
            switch (shell.direction) {
                case TankDirection.FORWARD:
                    y -= speed;
                    break;
                case TankDirection.BACKWARD:
                    y += speed;
                    break;
                case TankDirection.RIGHT:
                    x += speed;
                    break;
                case TankDirection.LEFT:
                    x -= speed;
                    break;
            }
            return {
                ...state,
                shells: {
                    ...state.shells,
                    [shell.ID]: {
                        ...shell,
                        position: {
                            ...shell.position,
                            x,
                            y,
                        },
                    },
                },
            };
        }
        case ActionTypes.SHELL_DESTROY: {
            const { IDs } = action.data!;
            const shells = { ...state.shells };
            for (const ID of IDs) {
                delete shells[ID];
            }
            return {
                ...state,
                shells,
            };
        }
        default:
            return state;
    }
};
