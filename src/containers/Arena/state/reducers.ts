import { IArena } from 'models/Arena';

import { Actions, ActionTypes } from './actions';
import { IState } from './interfaces';

export const initialState: IArena = {
    matrix: [],
    size: 0,
};

export const reducer = (state: IState = initialState, action: Actions): IState => {
    switch (action.type) {
        case ActionTypes.GENERATE_EMPTY_ARENA_SUCCESS:
            return {
                ...state,
                matrix: action.data!.matrix,
                size: action.data!.matrix.length,
            };

        case ActionTypes.LOAD_ARENA_MAP:
            return {
                ...state,
                matrix: action.data!.matrix,
                size: action.data!.matrix.length,
            };

        case ActionTypes.CHANGE_CELL_TYPE:
            const newMatrix = [...state.matrix];
            const { cell, newType } = action.data!;
            newMatrix[cell.column][cell.row].type = newType;
            return {
                ...state,
                matrix: newMatrix,
            };
        default:
            return state;
    }
};
