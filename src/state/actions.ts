import { IReduxAction } from './interfaces';

export enum ActionTypes {
    GENERATE_EMPTY_ARENA = 'battleCity/GENERATE_EMPTY_ARENA',
}

export const generateEmptyArena = (): IReduxAction<ActionTypes.GENERATE_EMPTY_ARENA, void> => ({
    type: ActionTypes.GENERATE_EMPTY_ARENA,
});
