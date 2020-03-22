import { addKeyBindings } from 'containers/Tanks/service';
import { put, select, takeLatest } from 'redux-saga/effects';
import { dispatch } from 'state/store';

import {
    listenToKeyBinding,
    saveKeyBinding,
    saveKeyBindingSuccess,
    ActionTypes,
} from './actions';
import { GamepadControls, IGamepadDOMEvents, IGamepadState } from './interfaces';
import { gamepadKeyBindingsSelector } from './selectors';

const gamepadContainer: HTMLElement | null = document.getElementById('gamepad');
const gamepadControllerContainer: HTMLElement | null = gamepadContainer!.querySelector('.controller');

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

    const onGamepadKeyDown = (event: Event) => {
        const { buttonName } = (event as CustomEvent<IGamepadDOMEvents>).detail;

        dispatch(saveKeyBinding(gamepadKey, buttonName));

        gamepadControllerContainer!.classList.remove('disable');
        document.removeEventListener('gamepadkeydown', onGamepadKeyDown);
    };

    document.addEventListener('gamepadkeydown', onGamepadKeyDown);
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
        .filter((control) => gamepadKeyBindings[control] !== undefined)
        .length === allControls.length;

    if (isEveryKeyMapped) {
        addKeyBindings(gamepadKeyBindings);
        yield put(saveKeyBindingSuccess());
    }
}

export const sagas = [
    watchForListenToKeyBinding,
    watchForSaveKeyBinding,
];
