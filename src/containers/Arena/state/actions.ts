import { Cell, CellType, ICell } from 'models/Cell';
import { Shell } from 'models/Shell';
import { IReduxAction } from 'state/interfaces';

export enum ActionTypes {
    FILL_ARENA_WITH = 'arena/FILL_ARENA_WITH',
    FILL_ARENA_WITH_SUCCESS = 'arena/FILL_ARENA_WITH_SUCCESS',
    LOAD_ARENA_MAP = 'arena/LOAD_ARENA_MAP',
    PERSIST_ARENA_TO_STORE = 'arena/PERSIST_ARENA_TO_STORE',

    REGISTER_IMPACT_FROM_SHELL = 'arena/REGISTER_IMPACT_FROM_SHELL',
    CHANGE_CELL_TYPE = 'arena/CHANGE_CELL_TYPE',

    SET_BRUSH = 'arena/SET_BRUSH',
}

export const fillArenaWith = (cellType: CellType): IReduxAction<ActionTypes.FILL_ARENA_WITH, { cellType: CellType }> => ({
    data: { cellType },
    type: ActionTypes.FILL_ARENA_WITH,
});

export const fillArenaWithSuccess = (matrix: ICell[][]): IReduxAction<ActionTypes.FILL_ARENA_WITH_SUCCESS, { matrix: ICell[][] }> => ({
    data: {
        matrix,
    },
    type: ActionTypes.FILL_ARENA_WITH_SUCCESS,
});

export const loadArenaMap = (matrix: ICell[][]): IReduxAction<ActionTypes.LOAD_ARENA_MAP, { matrix: ICell[][] }> => ({
    data: {
        matrix,
    },
    type: ActionTypes.LOAD_ARENA_MAP,
});

export const persistArenaToStore = (matrix: ICell[][]): IReduxAction<ActionTypes.PERSIST_ARENA_TO_STORE, { matrix: ICell[][] }> => ({
    data: {
        matrix,
    },
    type: ActionTypes.PERSIST_ARENA_TO_STORE,
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

export const setBrush = (cellType: CellType): IReduxAction<ActionTypes.SET_BRUSH, { cellType: CellType }> => ({
    data: { cellType },
    type: ActionTypes.SET_BRUSH,
});

export type Actions =
    | ReturnType<typeof fillArenaWith>
    | ReturnType<typeof fillArenaWithSuccess>
    | ReturnType<typeof loadArenaMap>
    | ReturnType<typeof registerImpactFromShell>
    | ReturnType<typeof changeCellType>
    | ReturnType<typeof setBrush>
    | ReturnType<typeof persistArenaToStore>
    ;
