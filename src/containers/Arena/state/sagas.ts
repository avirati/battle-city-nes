import { put, select, takeEvery, takeLatest, } from 'redux-saga/effects';

import { ARENA_SIZE, CELL_SIZE } from 'global/constants';
import { Cell, CellType, ICell } from 'models/Cell';

import { registerCellDestructionFrom, renderCell, renderMatrix } from '../service';
import { changeCellType, generateEmptyArenaSuccess, registerImpactFromShell, ActionTypes } from './actions';
import { getArenaMatrix } from './selectors';

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
    watchForGenerateEmptyArena,
    watchForLoanArenaMap,
    watchForRegisterImpactFromShell,
    watchForChangeCellType,
];
