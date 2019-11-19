import {
    all,
    fork,
    takeLatest,
} from 'redux-saga/effects';

import { ActionTypes } from './actions';

function * watchForGenerateEmptyArena() {
    yield takeLatest(ActionTypes.GENERATE_EMPTY_ARENA, generateEmptyArena);
}

function * generateEmptyArena() {
    console.log('generate empty arena');
}

export default function * root() {
    yield all([
        fork(watchForGenerateEmptyArena),
    ]);
}
