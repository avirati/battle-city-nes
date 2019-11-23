import { takeEvery, takeLatest } from 'redux-saga/effects';
import { dispatch } from 'state/store';

import {
    gamepadButtonPress,
    listenToKeyBinding,
    saveKeyBinding,
    ActionTypes,
} from './actions';

const gamepadContainer: HTMLElement | null = document.getElementById('gamepad');
const gamepadControllerContainer: HTMLElement | null = gamepadContainer!.querySelector('.controller');

function * watchForGamepadButtonPress() {
    yield takeEvery(ActionTypes.GAMEPAD_BUTTON_PRESS, gamepadButtonPressSaga);
}

function * gamepadButtonPressSaga(action: ReturnType<typeof gamepadButtonPress>) {
    const { gamepad } = action.data!;
    console.log(gamepad);
}

function * watchForListenToKeyBinding() {
    yield takeLatest(ActionTypes.LISTEN_TO_KEY_BINDING, listenToKeyBindingSaga);
}

function * listenToKeyBindingSaga(action: ReturnType<typeof listenToKeyBinding>) {
    const { gamepadKey } = action.data!;
    const onKeyDown = (event: KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const key = event.keyCode || event.which;
        dispatch(saveKeyBinding(gamepadKey, key));
        gamepadControllerContainer!.classList.remove('disable');
        document.removeEventListener('keydown', onKeyDown);
    };
    document.addEventListener('keydown', onKeyDown);
}

export const sagas = [
    watchForGamepadButtonPress,
    watchForListenToKeyBinding,
];
