import { IReduxAction } from 'state/interfaces';

import { GamepadControls } from './interfaces';

export enum ActionTypes {
    LISTEN_TO_KEY_BINDING = 'gamepad/LISTEN_TO_KEY_BINDING',
    SAVE_KEY_BINDING = 'gamepad/SAVE_KEY_BINDING',
}

export const listenToKeyBinding = (gamepadKey: GamepadControls): IReduxAction<ActionTypes.LISTEN_TO_KEY_BINDING, { gamepadKey: GamepadControls }> => ({
    data: { gamepadKey },
    type: ActionTypes.LISTEN_TO_KEY_BINDING,
});

export const saveKeyBinding = (gamepadKey: GamepadControls, boundKey: GameControlButtonTypes | number): IReduxAction<ActionTypes.SAVE_KEY_BINDING, { gamepadKey: GamepadControls, boundKey: GameControlButtonTypes | number }> => ({
    data: {
        boundKey,
        gamepadKey,
    },
    type: ActionTypes.SAVE_KEY_BINDING,
});

export type Actions =
    | ReturnType<typeof listenToKeyBinding>
    | ReturnType<typeof saveKeyBinding>
    ;
