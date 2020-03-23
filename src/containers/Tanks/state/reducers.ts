import {
    SHELL_SIZE,
    SHELL_SIZE_IN_CELLS,
    TANK_SIZE,
    TANK_SIZE_IN_CELLS,
} from 'global/constants';
import { Coordinate } from 'models/Coordinate';

import { Actions, ActionTypes } from './actions';
import {
    SHELL_DEFAULT_SPEED,
    TANK_DEFAULT_HP,
    TANK_DEFAULT_SPEED,
} from './constants';
import { ITanksState, TankDirection, TankType } from './interfaces';

const initialState: ITanksState = {
    playerID: '',
    shells: {},
    vehicles: {},
};

export const reducer = (state: ITanksState = initialState, action: Actions): ITanksState => {
    switch (action.type) {
        case ActionTypes.TANK_SPAWN: {
            const { ID, direction, position, type } = action.data!;
            return {
                ...state,
                playerID: type === TankType.PLAYER ? ID : state.playerID,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        HP: TANK_DEFAULT_HP,
                        ID,
                        direction,
                        lastPosition: position,
                        moving: false,
                        occupiedCells: TANK_SIZE_IN_CELLS,
                        position,
                        size: TANK_SIZE,
                        speed: TANK_DEFAULT_SPEED,
                        type,
                    },
                },
            };
        }
        case ActionTypes.TANK_MOVE_START: {
            const { ID } = action.data!;
            const tank = state.vehicles[ID];

            return {
                ...state,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        ...tank,
                        moving: true,
                    },
                },
            };
        }
        case ActionTypes.TANK_MOVE_STOP: {
            const { ID } = action.data!;
            const tank = state.vehicles[ID];

            return {
                ...state,
                vehicles: {
                    ...state.vehicles,
                    [ID]: {
                        ...tank,
                        moving: false,
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
                        lastPosition: tank.position,
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
            const { tankID, shellID } = action.data!;
            const tank = state.vehicles[tankID];
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
            return {
                ...state,
                shells: {
                    ...state.shells,
                    [shellID]: {
                        ID: shellID,
                        direction: tank.direction,
                        lastPosition: shellPosition,
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
                        lastPosition: shell.position,
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
