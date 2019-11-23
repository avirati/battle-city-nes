import { truthy } from 'helpers';
import { dispatch } from 'state/store';

import { gamepadButtonPress, gamepadConnected, gamepadDisconnected } from './state/actions';

const getGamepads = () => Array.from(navigator.getGamepads()).filter(truthy);

const listenForGamepadConnect = () => {
    window.addEventListener('gamepadconnected', () => {
        const gamepad = getGamepads()[0];
        dispatch(gamepadConnected(gamepad!));
    });
};

const listenForGamepadDisconnect = () => {
    window.addEventListener('gamepaddisconnected', () => {
        const gamepad = getGamepads()[0];
        dispatch(gamepadDisconnected(gamepad!));
    });
};

const onGamepadButtonPressed = () => {
    const gamepads = getGamepads();
    if (gamepads.length === 0) {
        return;
    }
    gamepads.forEach((gamepad) => {
        const buttonsPressed = gamepad!.buttons.filter((button) => button.pressed);
        if (buttonsPressed.length > 0) {
            dispatch(gamepadButtonPress(gamepad!));
        }
    });
};

const listenForGamepadButtons = () => {
    setInterval(onGamepadButtonPressed, 100);
};

export const addSupportForGamepadIfAvailable = () => {
    const isGamepadSupported = Boolean(navigator.getGamepads);
    if (isGamepadSupported) {
        listenForGamepadConnect();
        listenForGamepadDisconnect();
        listenForGamepadButtons();
    }
};
