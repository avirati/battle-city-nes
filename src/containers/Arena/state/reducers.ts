import { IArena } from 'models/Arena';
import { CellType } from 'models/Cell';

import { Actions, ActionTypes } from './actions';
import { IState } from './interfaces';

export const initialState: IArena = {
    matrix: [],
    meta: {
        activeBrush: CellType.EMPTY,
    },
    size: 0,
};

export const reducer = (state: IState = initialState, action: Actions): IState => {
    switch (action.type) {
        case ActionTypes.FILL_ARENA_WITH_SUCCESS:
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

        case ActionTypes.SET_BRUSH:
            const newBrush = action.data!.cellType;
            if (newBrush === state.meta.activeBrush) {
                return state;
            } else {
                return {
                    ...state,
                    meta: {
                        ...state.meta,
                        activeBrush: newBrush,
                    },
                };
            }
        default:
            return state;
    }
};
