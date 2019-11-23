import { addKeyBindings } from 'containers/Tanks/service';
import { select, takeEvery, takeLatest } from 'redux-saga/effects';
import { dispatch } from 'state/store';

import {
    gamepadButtonPress,
    listenToKeyBinding,
    saveKeyBinding,
    ActionTypes,
} from './actions';
import { GamepadControls, IGamepadState } from './interfaces';
import { gamepadKeyBindingsSelector } from './selectors';

const gamepadContainer: HTMLElement | null = document.getElementById('gamepad');
const gamepadControllerContainer: HTMLElement | null = gamepadContainer!.querySelector('.controller');

function * watchForGamepadButtonPress() {
    yield takeEvery(ActionTypes.GAMEPAD_BUTTON_PRESS, gamepadButtonPressSaga);
}

function * gamepadButtonPressSaga(action: ReturnType<typeof gamepadButtonPress>) {
    const { gamepad } = action.data!;

    document.dispatchEvent(new GamepadEvent(
        'gamepadkeypressed',
        {
            bubbles: false,
            cancelable: false,
            composed: true,
            gamepad,
        },
    ));
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

    const onGamepadKeyPress = (event: Event) => {
        const { gamepad } = event as GamepadEvent;
        const pressedButtonIndex = gamepad.buttons.findIndex((button) => button.pressed);

        dispatch(saveKeyBinding(gamepadKey, pressedButtonIndex));

        gamepadControllerContainer!.classList.remove('disable');
        document.removeEventListener('gamepadkeypressed', onGamepadKeyPress);
    };

    document.addEventListener('gamepadkeypressed', onGamepadKeyPress);
}

function * watchForSaveKeyBinding() {
    yield takeLatest(ActionTypes.SAVE_KEY_BINDING, saveKeyBindingSaga);
}

function * saveKeyBindingSaga() {
    const gamepadKeyBindings: IGamepadState['keyBindings'] = yield select(gamepadKeyBindingsSelector);
    const allControls = [
        GamepadControls.GAMEPAD_DOWN,
        GamepadControls.GAMEPAD_LEFT,
        GamepadControls.GAMEPAD_RIGHT,
        GamepadControls.GAMEPAD_SHOOT,
        GamepadControls.GAMEPAD_UP,
    ];
    const isEveryKeyMapped =
        allControls
        .filter((control) => gamepadKeyBindings[control])
        .length === allControls.length;

    if (isEveryKeyMapped) {
        addKeyBindings(gamepadKeyBindings);
    }
}

export const sagas = [
    watchForGamepadButtonPress,
    watchForListenToKeyBinding,
    watchForSaveKeyBinding,
];
