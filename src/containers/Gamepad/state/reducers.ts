import { Actions, ActionTypes } from './actions';
import { IState } from './interfaces';

const initialState: IState = {
    gamepads: {},
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
        default:
            return state;
    }
}
