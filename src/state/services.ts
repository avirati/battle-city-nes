import { OutputSelector } from 'reselect';

import { IApplicationState } from './interfaces';
import { store } from './store';

export const applySelector = <D>(selector: OutputSelector<IApplicationState, D, (res: any) => D>) => selector(store.getState());
