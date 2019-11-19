import { Actions, ActionTypes } from './actions';
import { IState } from './interfaces';

export const initialState: IState = {
    cells: [],
};

export const reducer = (state: IState = initialState, action: Actions): IState => {
    switch (action.type) {
        case ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS:
            return {
                ...state,
                cells: action.data!.cells,
            };

        case ActionTypes.LOAD_ARENA_MAP:
            return {
                ...state,
                cells: action.data!.cells,
            };
        default:
            return state;
    }
};
