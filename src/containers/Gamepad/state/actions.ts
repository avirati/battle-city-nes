import { IReduxAction } from 'state/interfaces';

export enum ActionTypes {
    GAMEPAD_CONNECTED = 'gamepad/GAMEPAD_CONNECTED',
    GAMEPAD_DISCONNECTED = 'gamepad/GAMEPAD_DISCONNECTED',
    GAMEPAD_BUTTON_PRESS = 'gamepad/GAMEPAD_BUTTON_PRESS',
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

export type Actions =
    | ReturnType<typeof gamepadButtonPress>
    | ReturnType<typeof gamepadConnected>
    | ReturnType<typeof gamepadDisconnected>
    ;
