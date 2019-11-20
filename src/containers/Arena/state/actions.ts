import { Cell, CellType, ICell } from 'models/Cell';
import { Shell } from 'models/Shell';
import { IReduxAction } from 'state/interfaces';

export enum ActionTypes {
    GENERATE_EMPTY_ARENA = 'arena/GENERATE_EMPTY_ARENA',
    GENERATE_EMPTY_ARENA_SUCCESS = 'arena/GENERATE_EMPTY_ARENA_SUCCESS',
    LOAD_ARENA_MAP = 'arena/LOAD_ARENA_MAP',

    REGISTER_IMPACT_FROM_SHELL = 'arena/REGISTER_IMPACT_FROM_SHELL',
    CHANGE_CELL_TYPE = 'arena/CHANGE_CELL_TYPE',
}

export const generateEmptyArena = (): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA, void> => ({
    type: ActionTypes.GENERATE_EMPTY_ARENA,
});

export const generateEmptyArenaSuccess = (matrix: ICell[][]): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS, { matrix: ICell[][] }> => ({
    data: {
        matrix,
    },
    type: ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS,
});

export const loadArenaMap = (matrix: ICell[][]): IReduxAction<ActionTypes.LOAD_ARENA_MAP, { matrix: ICell[][] }> => ({
    data: {
        matrix,
    },
    type: ActionTypes.LOAD_ARENA_MAP,
});

export const registerImpactFromShell = (shell: Shell): IReduxAction<ActionTypes.REGISTER_IMPACT_FROM_SHELL, { shell: Shell }> => ({
    data: { shell },
    type: ActionTypes.REGISTER_IMPACT_FROM_SHELL,
});

export const changeCellType = (cell: Cell, newType: CellType): IReduxAction<ActionTypes.CHANGE_CELL_TYPE, { cell: Cell, newType: CellType }> => ({
    data: {
        cell,
        newType,
    },
    type: ActionTypes.CHANGE_CELL_TYPE,
});

export type Actions =
    | ReturnType<typeof generateEmptyArena>
    | ReturnType<typeof generateEmptyArenaSuccess>
    | ReturnType<typeof loadArenaMap>
    | ReturnType<typeof registerImpactFromShell>
    | ReturnType<typeof changeCellType>
    ;
