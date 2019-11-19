import {
    all,
    fork,
} from 'redux-saga/effects';

import { sagas as ArenaSagas } from 'containers/Arena/state/sagas';

import { ISaga } from './interfaces';

const sagas: ISaga[] = [
    ...ArenaSagas,
];

export default function * root() {
    yield all(sagas.map((saga) => fork(saga)));
}
