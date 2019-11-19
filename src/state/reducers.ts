import { IApplicationState, IReduxAction } from './interfaces';

const initialState: IApplicationState = {
    dummy: [],
};

const dummyReducer = (state: IApplicationState = initialState, action: IReduxAction): IApplicationState => {
    switch (action.type) {
        default:
            return state;
    }
};

export const reducers = {
    dummy: dummyReducer,
};
