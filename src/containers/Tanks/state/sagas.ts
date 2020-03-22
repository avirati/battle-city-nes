import { takeLatest } from 'redux-saga/effects';

import { ActionTypes } from 'containers/Gamepad/state/actions';

function * watchForSaveKeyBindingSuccess() {
    yield takeLatest(ActionTypes.SAVE_KEY_BINDING_SUCCESS, saveKeyBindingSuccess);
}

function saveKeyBindingSuccess() {
    console.log('start game');
}

export const sagas = [
    watchForSaveKeyBindingSuccess,
];
