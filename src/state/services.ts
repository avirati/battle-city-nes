import { OutputSelector } from 'reselect';

import { IApplicationState } from './interfaces';
import { store } from './store';

export const applySelector = <D, R>(selector: OutputSelector<IApplicationState, D, (res: R) => D>) => selector(store.getState());
