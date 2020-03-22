import { IReduxAction } from 'state/interfaces';

import {
    IShell,
    ITank,
    ITankProps,
} from './interfaces';

export enum ActionTypes {
    TANK_SPAWN = 'tank/SPAWN',
    TANK_MOVE = 'tank/MOVE',
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

export const fireTank = (ID: ITank['ID']): IReduxAction<ActionTypes.TANK_FIRE, { ID: ITank['ID'] }> => ({
    data: { ID },
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
    | ReturnType<typeof fireTank>
    | ReturnType<typeof turnTank>
    | ReturnType<typeof moveShell>
    | ReturnType<typeof destroyShells>
    ;
