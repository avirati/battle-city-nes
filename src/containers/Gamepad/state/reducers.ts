import { Actions, ActionTypes } from './actions';
import { IGamepadState } from './interfaces';

const initialState: IGamepadState = {
    gamepads: {},
    keyBindings: {},
};

export const reducer = (state: IGamepadState = initialState, action: Actions): IGamepadState => {
    switch (action.type) {
        case ActionTypes.GAMEPAD_CONNECTED:
            return {
                ...state,
                gamepads: {
                    ...state.gamepads,
                    [action.data!.gamepad.id]: action.data!.gamepad,
                },
            };
        case ActionTypes.GAMEPAD_DISCONNECTED:
            return {
                ...state,
                gamepads: {
                    ...state.gamepads,
                    [action.data!.gamepad.id]: undefined,
                },
            };
        case ActionTypes.SAVE_KEY_BINDING:
            return {
                ...state,
                keyBindings: {
                    ...state.keyBindings,
                    [action.data!.gamepadKey]: action.data!.boundKey,
                },
            };
        default:
            return state;
    }
};
