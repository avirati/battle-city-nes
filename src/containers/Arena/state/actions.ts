import { IReduxAction } from 'state/interfaces';
import { ICell } from '../models/Cell';
import { IState } from './interfaces';

export enum ActionTypes {
    GENERATE_EMPTY_ARENA = 'arena/GENERATE_EMPTY_ARENA',
    GENERATE_EMPTY_ARENA_SUCCESS = 'arena/GENERATE_EMPTY_ARENA_SUCCESS',
}

export const generateEmptyArena = (): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA, void> => ({
    type: ActionTypes.GENERATE_EMPTY_ARENA,
});

export const generateEmptyArenaSuccess = (matrix: ICell[][]): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS, IState> => ({
    data: {
        cells: matrix,
    },
    type: ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS,
});

export type Actions =
    | ReturnType<typeof generateEmptyArena>
    | ReturnType<typeof generateEmptyArenaSuccess>
    ;
