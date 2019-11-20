import { ForkEffect } from 'redux-saga/effects';

import { IArena } from 'containers/Arena/models/Arena';

export interface IApplicationState {
    arena: IArena;
}

export interface IReduxAction<T = any, D = any> {
    type: T;
    data?: D;
}

export interface ISaga {
    (): IterableIterator<ForkEffect>;
}
