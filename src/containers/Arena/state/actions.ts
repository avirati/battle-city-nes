import { IReduxAction } from 'state/interfaces';

export enum ActionTypes {
    GENERATE_EMPTY_ARENA = 'arena/GENERATE_EMPTY_ARENA',
}

export const generateEmptyArena = (): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA, void> => ({
    type: ActionTypes.GENERATE_EMPTY_ARENA,
});

export type Actions =
    | ReturnType<typeof generateEmptyArena>;
