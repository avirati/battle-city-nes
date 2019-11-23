import { ForkEffect } from 'redux-saga/effects';

import { IArena } from 'models/Arena';
import { IGamepadState } from 'src/containers/Gamepad/state/interfaces';

export interface IApplicationState {
    arena: IArena;
    gamepad: IGamepadState;
}

export interface IReduxAction<T = any, D = any> {
    type: T;
    data?: D;
}

export interface ISaga {
    (): IterableIterator<ForkEffect>;
}
