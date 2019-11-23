/// <reference types="node" />

declare enum GameControlEvents {
    CONNECT         = 'connect',
    DISCONNECT      = 'disconnect',
    BEFORE_CYCLE    = 'beforeCycle',
    AFTER_CYCLE     = 'afterCycle',
}

declare enum GameControlButtons {
    BUTTON_ZERO         = 'button0',
    BUTTON_ONE          = 'button1',
    BUTTON_TWO          = 'button2',
    BUTTON_THREE        = 'button3',
    BUTTON_FOUR         = 'button4',
    BUTTON_FIVE         = 'button5',
    BUTTON_SIX          = 'button6',
    BUTTON_SEVEN        = 'button7',
    BUTTON_EIGHT        = 'button8',
    BUTTON_NINE         = 'button9',
    BUTTON_TEN          = 'button10',
    BUTTON_ELEVEN       = 'button11',
    BUTTON_TWELVE       = 'button12',
    BUTTON_THIRTEEN     = 'button13',
    BUTTON_FOURTEEN     = 'button14',
    BUTTON_FIFTEEN      = 'button15',
    BUTTON_SIXTEEN      = 'button16',
    BUTTON_UP_ZERO      = 'up0',
    BUTTON_DOWN_ZERO    = 'down0',
    BUTTON_RIGHT_ZERO   = 'right0',
    BUTTON_LEFT_ZERO    = 'left0',
    BUTTON_UP_ONE       = 'up1',
    BUTTON_DOWN_ONE     = 'down1',
    BUTTON_RIGHT_ONE    = 'right1',
    BUTTON_LEFT_ONE     = 'left1',
    BUTTON_START        = 'start',
    BUTTON_SELECT       = 'select',
    BUTTON_POWER        = 'power',
    BUTTON_L_ONE        = 'l1',
    BUTTON_L_TWO        = 'l2',
    BUTTON_R_ONE        = 'r1',
    BUTTON_R_TWO        = 'r2',
    BUTTON_UP           = 'up',
    BUTTON_DOWN         = 'down',
    BUTTON_RIGHT        = 'right',
    BUTTON_LEFT         = 'left',
}

declare interface GamepadObject {
    id:             number;
    axes:           number;
    axeThreshold:   number[];
    buttons:        number;
    mapping:        string;
    vibration:      boolean;

    on:             (eventName: GameControlButtons, callback: () => void) => void;
    off:            (eventName: GameControlButtons) => void;
    before:         (eventName: GameControlButtons, callback: () => void) => void;
    after:          (eventName: GameControlButtons, callback: () => void) => void;
    vibrate:        (intensity: number, duration: number) => void;
}

declare namespace gameControl {
    export const isReady: boolean;

    export function on(eventName: GameControlEvents, callback: () => void): void;
    export function off(eventName: GameControlEvents): void;
    export function getGamepad(ID: number): GamepadObject;
    export function getGamepads(): { [key: number]: GamepadObject };
}
