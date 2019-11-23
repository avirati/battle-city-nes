import { takeEvery } from 'redux-saga/effects';

import { gamepadButtonPress, ActionTypes } from './actions';

function * watchForGamepadButtonPress() {
    yield takeEvery(ActionTypes.GAMEPAD_BUTTON_PRESS, gamepadButtonPressSaga);
}

function * gamepadButtonPressSaga(action: ReturnType<typeof gamepadButtonPress>) {
    const { gamepad } = action.data!;
    console.log(gamepad);
}

export const sagas = [
    watchForGamepadButtonPress,
];
