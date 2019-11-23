import { Actions, ActionTypes } from './actions';
import { IState } from './interfaces';

const initialState: IState = {
    gamepads: {},
    keyBindings: {},
}

export const reducer = (state: IState = initialState, action: Actions): IState => {
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
}
