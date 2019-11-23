import { IReduxAction } from 'state/interfaces';

import { GamepadControls } from './interfaces';

export enum ActionTypes {
    GAMEPAD_CONNECTED = 'gamepad/GAMEPAD_CONNECTED',
    GAMEPAD_DISCONNECTED = 'gamepad/GAMEPAD_DISCONNECTED',
    GAMEPAD_BUTTON_PRESS = 'gamepad/GAMEPAD_BUTTON_PRESS',

    LISTEN_TO_KEY_BINDING = 'gamepad/LISTEN_TO_KEY_BINDING',
    SAVE_KEY_BINDING = 'gamepad/SAVE_KEY_BINDING',
}

export const gamepadButtonPress = (gamepad: Gamepad): IReduxAction<ActionTypes.GAMEPAD_BUTTON_PRESS, { gamepad: Gamepad }> => ({
    data: {
        gamepad,
    },
    type: ActionTypes.GAMEPAD_BUTTON_PRESS,
});

export const gamepadConnected = (gamepad: Gamepad): IReduxAction<ActionTypes.GAMEPAD_CONNECTED, { gamepad: Gamepad }> => ({
    data: {
        gamepad,
    },
    type: ActionTypes.GAMEPAD_CONNECTED,
});

export const gamepadDisconnected = (gamepad: Gamepad): IReduxAction<ActionTypes.GAMEPAD_DISCONNECTED, { gamepad: Gamepad }> => ({
    data: {
        gamepad,
    },
    type: ActionTypes.GAMEPAD_DISCONNECTED,
});

export const listenToKeyBinding = (gamepadKey: GamepadControls): IReduxAction<ActionTypes.LISTEN_TO_KEY_BINDING, { gamepadKey: GamepadControls }> => ({
    data: { gamepadKey },
    type: ActionTypes.LISTEN_TO_KEY_BINDING,
});

export const saveKeyBinding = (gamepadKey: GamepadControls, boundKey: number): IReduxAction<ActionTypes.SAVE_KEY_BINDING, { gamepadKey: GamepadControls, boundKey: number }> => ({
    data: {
        boundKey,
        gamepadKey,
    },
    type: ActionTypes.SAVE_KEY_BINDING,
});

export type Actions =
    | ReturnType<typeof gamepadButtonPress>
    | ReturnType<typeof gamepadConnected>
    | ReturnType<typeof gamepadDisconnected>
    | ReturnType<typeof listenToKeyBinding>
    | ReturnType<typeof saveKeyBinding>
    ;
