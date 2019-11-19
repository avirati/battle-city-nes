import { ForkEffect } from 'redux-saga/effects';

export interface IApplicationState {
    dummy: any[];
}

export interface IReduxAction<T = any, D = any> {
    type: T;
    data?: D;
}

export interface ISaga {
    (): IterableIterator<ForkEffect>;
}
