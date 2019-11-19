import { IReduxAction } from 'state/interfaces';
import { ICell } from '../models/Cell';

export enum ActionTypes {
    GENERATE_EMPTY_ARENA = 'arena/GENERATE_EMPTY_ARENA',
    GENERATE_EMPTY_ARENA_SUCCESS = 'arena/GENERATE_EMPTY_ARENA_SUCCESS',
    LOAD_ARENA_MAP = 'arena/LOAD_ARENA_MAP',
}

export const generateEmptyArena = (): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA, void> => ({
    type: ActionTypes.GENERATE_EMPTY_ARENA,
});

export const generateEmptyArenaSuccess = (matrix: ICell[][]): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS, { cells: ICell[][] }> => ({
    data: {
        cells: matrix,
    },
    type: ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS,
});

export const loadArenaMap = (matrix: ICell[][]): IReduxAction<ActionTypes.LOAD_ARENA_MAP, { cells: ICell[][] }> => ({
    data: {
        cells: matrix,
    },
    type: ActionTypes.LOAD_ARENA_MAP,
});

export type Actions =
    | ReturnType<typeof generateEmptyArena>
    | ReturnType<typeof generateEmptyArenaSuccess>
    | ReturnType<typeof loadArenaMap>
    ;
