import { Actions, ActionTypes } from './actions';
import { IGamepadState } from './interfaces';

const initialState: IGamepadState = {
    keyBindings: {},
};

export const reducer = (state: IGamepadState = initialState, action: Actions): IGamepadState => {
    switch (action.type) {
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
