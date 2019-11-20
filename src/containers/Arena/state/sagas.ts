import { put, takeLatest } from 'redux-saga/effects';

import { ARENA_SIZE, CELL_SIZE } from 'global/constants';
import { Cell, CellType, ICell } from 'models/Cell';

import { renderMatrix } from '../service';
import { generateEmptyArenaSuccess, ActionTypes } from './actions';

function * watchForGenerateEmptyArena() {
    yield takeLatest(ActionTypes.GENERATE_EMPTY_ARENA, generateEmptyArena);
}

function * generateEmptyArena() {
    const matrix: ICell[][] = [];
    for (let i = 0; i < ARENA_SIZE; i++) {
        matrix[i] = [];
        for (let j = 0; j < ARENA_SIZE; j++) {
            matrix[i][j] = new Cell(CellType.EMPTY, i * CELL_SIZE, j * CELL_SIZE, i, j);
        }
    }
    yield put(generateEmptyArenaSuccess(matrix));
}

function * watchForLoanArenaMap() {
    yield takeLatest(ActionTypes.LOAD_ARENA_MAP, loadArenaMapSaga);
}

function * loadArenaMapSaga() {
    renderMatrix();
}

export const sagas = [
    watchForGenerateEmptyArena,
    watchForLoanArenaMap,
];
