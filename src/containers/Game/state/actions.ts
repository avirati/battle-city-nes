import { IReduxAction } from 'state/interfaces';

export enum ActionTypes {
    START_GAME = 'game/START',
}

export const startGame = (): IReduxAction<ActionTypes.START_GAME> => ({
    type: ActionTypes.START_GAME,
});
