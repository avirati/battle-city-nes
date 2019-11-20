import { OutputSelector } from 'reselect';

import { IApplicationState, IReduxAction } from './interfaces';
import { store } from './store';

export const applySelector = <D, B>(selector: OutputSelector<Store<IApplicationState, IReduxAction>, D, (res: B) => D>) => selector(store);
