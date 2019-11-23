import {
    all,
    fork,
} from 'redux-saga/effects';

import { sagas as ArenaSagas } from 'containers/Arena/state/sagas';
import { sagas as GamepadSagas } from 'containers/Gamepad/state/sagas';

import { ISaga } from './interfaces';

const sagas: ISaga[] = [
    ...ArenaSagas,
    ...GamepadSagas,
];

export default function * root() {
    yield all(sagas.map((saga) => fork(saga)));
}
