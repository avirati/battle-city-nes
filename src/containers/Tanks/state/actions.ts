import { IReduxAction } from 'state/interfaces';

import {
    IShell,
    ITank,
    ITankProps,
} from './interfaces';

export enum ActionTypes {
    TANK_SPAWN = 'tank/SPAWN',
    TANK_MOVE = 'tank/MOVE',
    TANK_MOVE_START = 'tank/MOVE_START',
    TANK_MOVE_STOP = 'tank/MOVE_STOP',
    TANK_FIRE = 'tank/FIRE',
    TANK_TURN = 'tank/TURN',

    SHELL_MOVE = 'shell/MOVE',
    SHELL_DESTROY = 'shell/DESTROY',
}

export const spawnTank = (tankProps: ITankProps): IReduxAction<ActionTypes.TANK_SPAWN, ITankProps> => ({
    data: tankProps,
    type: ActionTypes.TANK_SPAWN,
});

export const moveTank = (ID: ITank['ID'], direction: ITank['direction']): IReduxAction<ActionTypes.TANK_MOVE, { ID: ITank['ID'], direction: ITank['direction'] }> => ({
    data: { ID, direction },
    type: ActionTypes.TANK_MOVE,
});

export const moveTankStart = (ID: ITank['ID']): IReduxAction<ActionTypes.TANK_MOVE_START, { ID: ITank['ID'] }> => ({
    data: { ID },
    type: ActionTypes.TANK_MOVE_START,
});

export const moveTankStop = (ID: ITank['ID']): IReduxAction<ActionTypes.TANK_MOVE_STOP, { ID: ITank['ID'] }> => ({
    data: { ID },
    type: ActionTypes.TANK_MOVE_STOP,
});

export const fireTank = (tankID: ITank['ID'], shellID: IShell['ID']): IReduxAction<ActionTypes.TANK_FIRE, { tankID: ITank['ID'], shellID: IShell['ID'] }> => ({
    data: { tankID, shellID },
    type: ActionTypes.TANK_FIRE,
});

export const turnTank = (ID: ITank['ID'], direction: ITank['direction']): IReduxAction<ActionTypes.TANK_TURN, { ID: ITank['ID'], direction: ITank['direction'] }> => ({
    data: { ID, direction },
    type: ActionTypes.TANK_TURN,
});

export const moveShell = (ID: IShell['ID']): IReduxAction<ActionTypes.SHELL_MOVE, { ID: IShell['ID'] }> => ({
    data: { ID },
    type: ActionTypes.SHELL_MOVE,
});

export const destroyShells = (IDs: Array<IShell['ID']>): IReduxAction<ActionTypes.SHELL_DESTROY, { IDs: Array<IShell['ID']> }> => ({
    data: { IDs },
    type: ActionTypes.SHELL_DESTROY,
});

export type Actions =
    | ReturnType<typeof spawnTank>
    | ReturnType<typeof moveTank>
    | ReturnType<typeof moveTankStart>
    | ReturnType<typeof moveTankStop>
    | ReturnType<typeof fireTank>
    | ReturnType<typeof turnTank>
    | ReturnType<typeof moveShell>
    | ReturnType<typeof destroyShells>
    ;
