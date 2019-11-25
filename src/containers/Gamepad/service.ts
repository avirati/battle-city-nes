import 'gamecontroller.js/dist/gamecontroller';

import { dispatch } from 'state/store';

import { listenToKeyBinding } from './state/actions';
import { buttonNames } from './state/constants';
import { GamepadControls, IGamepadDOMEvents } from './state/interfaces';

const gamepadContainer: HTMLElement | null = document.getElementById('gamepad');
const gamepadControllerContainer: HTMLElement | null = gamepadContainer!.querySelector('.controller');
const gamepadFooter: HTMLElement | null = gamepadContainer!.querySelector('.footer');

const listenForGamepadConnect = () => {
    gameControl.on('connect', (gamepad: IGamepadObject) => {
        addButtonListeners(gamepad);
        gamepadFooter!.innerText = 'Gamepad Connected !';
    });
};

const listenForGamepadDisconnect = () => {
    gameControl.on('disconnect', () => {
        gamepadFooter!.innerText = 'Gamepad Disconnected !';
    });
};

const onButtonDown = (buttonName: GameControlButtonTypes) => {
    document.dispatchEvent(new CustomEvent<IGamepadDOMEvents>('gamepadkeydown', { detail: { buttonName } }));
};

const onButtonUp = (buttonName: GameControlButtonTypes) => {
    document.dispatchEvent(new CustomEvent<IGamepadDOMEvents>('gamepadkeyup', { detail: { buttonName } }));
};

const addButtonListeners = (gamepad: IGamepadObject) => {
    buttonNames.forEach((buttonName) => {
        gamepad.before(buttonName, () => onButtonDown(buttonName));
        gamepad.after(buttonName, () => onButtonUp(buttonName));
    });
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
        addConfigurationHandlers();
    }
};
