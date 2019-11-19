import { Actions } from './actions';
import { IState } from './interfaces';

export const initialState: IState = {
    arena: {
        cells: [],
    },
};

export const reducer = (state: IState = initialState, action: Actions) => {
    switch (action.type) {
        default:
            return state;
    }
};
