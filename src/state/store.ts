import { combineReducers, createStore, Store } from 'redux';
import { enableBatching } from 'redux-batched-actions';

import { IApplicationState } from './interfaces';
import { reducers } from './reducers';

export const prepareStore = (): Store<IApplicationState> => {
    const allReducers = enableBatching(combineReducers({
        ...reducers,
    }));

    const store: Store<IApplicationState> = createStore(allReducers);
    return store;
};

export const store: Store<IApplicationState> = prepareStore();
