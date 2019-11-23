import 'gamecontroller.js/src/index';

import { truthy } from 'helpers';
import { dispatch } from 'state/store';

import { gamepadConnected, gamepadDisconnected, listenToKeyBinding } from './state/actions';
import { GamepadControls, IGamepadDOMEvents } from './state/interfaces';

const gamepadContainer: HTMLElement | null = document.getElementById('gamepad');
const gamepadControllerContainer: HTMLElement | null = gamepadContainer!.querySelector('.controller');
const gamepadFooter: HTMLElement | null = gamepadContainer!.querySelector('.footer');

const getGamepads = () => Array.from(navigator.getGamepads()).filter(truthy);

const gamepadButtons: Map<string, Map<number, boolean>> = new Map();

const listenForGamepadConnect = () => {
    window.addEventListener('gamepadconnected', () => {
        const gamepad = getGamepads()[0];
        const buttonMap: Map<number, boolean> = new Map();
        gamepad!.buttons.forEach((button, index) => buttonMap.set(index, button.pressed));
        gamepadButtons.set(gamepad!.id, buttonMap);
        dispatch(gamepadConnected(gamepad!));

        gamepadControllerContainer!.classList.remove('disable');
        gamepadFooter!.innerText = 'Gamepad Connected !';
    });
};

const listenForGamepadDisconnect = () => {
    window.addEventListener('gamepaddisconnected', (event: Event) => {
        const { gamepad } = (event as GamepadEvent);
        gamepadButtons.delete(gamepad!.id);
        dispatch(gamepadDisconnected(gamepad!));
        gamepadControllerContainer!.classList.add('disable');
        gamepadFooter!.innerText = 'Gamepad Disconnected !';
    });
};

const checkIfGamepadButtonPressed = () => {
    const gamepads = getGamepads();
    if (gamepads.length === 0) {
        return;
    }
    gamepads.forEach((gamepad) => {
        if (!gamepad) {
            return;
        }
        const buttonsPressedIndices: number[] = [];
        gamepad.buttons.forEach((button, index) => {
            if (button.pressed) {
                buttonsPressedIndices.push(index);
            }
        });
        if (buttonsPressedIndices.length > 0) {
            buttonsPressedIndices.forEach((pressedButtonIndex) => {
                const buttonMap = gamepadButtons.get(gamepad.id)!;
                const wasButtonPressed = buttonMap.get(pressedButtonIndex);
                if (!wasButtonPressed) {
                    buttonMap.set(pressedButtonIndex, true);
                    document.dispatchEvent(new CustomEvent<IGamepadDOMEvents>(
                        'gamepadkeydown', { detail: { pressedButtonIndex } },
                    ));
                }
            });
        } else {
            const buttonMap = gamepadButtons.get(gamepad.id)!;
            buttonMap.forEach((wasPressed, pressedButtonIndex) => {
                if (wasPressed) {
                    buttonMap.set(pressedButtonIndex, false);
                    document.dispatchEvent(new CustomEvent<IGamepadDOMEvents>(
                        'gamepadkeyup', { detail: { pressedButtonIndex } },
                    ));
                }
            });
        }
    });
};

const listenForGamepadButtons = () => {
    setInterval(checkIfGamepadButtonPressed, 100);
};

const addConfigurationHandlers = () => {
    gamepadControllerContainer!.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        gamepadControllerContainer!.classList.add('disable');
        dispatch(listenToKeyBinding(target.getAttribute('data-action') as GamepadControls));
    });
};

export const addSupportForGamepadIfAvailable = () => {
    const isGamepadSupported = Boolean(navigator.getGamepads);
    if (isGamepadSupported) {
        listenForGamepadConnect();
        listenForGamepadDisconnect();
        listenForGamepadButtons();
        addConfigurationHandlers();
    }
};
