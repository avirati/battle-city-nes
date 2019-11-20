import { put, select, takeEvery, takeLatest, } from 'redux-saga/effects';

import { ARENA_SIZE, CELL_SIZE } from 'global/constants';
import { Cell, CellType, ICell } from 'models/Cell';

import {
    registerCellDestructionFrom,
    renderCell,
    renderMatrix,
} from '../service';
import {
    changeCellType,
    fillArenaWith,
    fillArenaWithSuccess,
    registerImpactFromShell,
    ActionTypes,
} from './actions';
import { getArenaMatrix } from './selectors';

function * watchForfillArenaWith() {
    yield takeLatest(ActionTypes.FILL_ARENA_WITH, fillArenaWithSaga);
}

function * fillArenaWithSaga(action: ReturnType<typeof fillArenaWith>) {
    const matrix: ICell[][] = [];
    const { cellType } = action.data!;
    for (let i = 0; i < ARENA_SIZE; i++) {
        matrix[i] = [];
        for (let j = 0; j < ARENA_SIZE; j++) {
            matrix[i][j] = new Cell(cellType, i * CELL_SIZE, j * CELL_SIZE, i, j);
        }
    }
    yield put(fillArenaWithSuccess(matrix));
}

function * watchForLoanArenaMap() {
    yield takeLatest(ActionTypes.LOAD_ARENA_MAP, loadArenaMapSaga);
}

function * loadArenaMapSaga() {
    renderMatrix();
}

function * watchForRegisterImpactFromShell() {
    yield takeEvery(ActionTypes.REGISTER_IMPACT_FROM_SHELL, registerImpactFromShellSaga);
}

function * registerImpactFromShellSaga(action: ReturnType<typeof registerImpactFromShell>) {
    const shell = action.data!.shell;
    registerCellDestructionFrom(shell);
}

function * watchForChangeCellType() {
    yield takeEvery(ActionTypes.CHANGE_CELL_TYPE, reRenderCell);
}

function * reRenderCell(action: ReturnType<typeof changeCellType>) {
    const matrix: ICell[][] = yield select(getArenaMatrix);
    const { cell } = action.data!;
    const changedCell = matrix[cell.column][cell.row];
    renderCell(changedCell);
}

export const sagas = [
    watchForfillArenaWith,
    watchForLoanArenaMap,
    watchForRegisterImpactFromShell,
    watchForChangeCellType,
];
