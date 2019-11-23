/// <reference types="node" />

declare type GameControlEventTypes =
    | 'connect'
    | 'disconnect'
    | 'beforeCycle'
    | 'afterCycle'
    ;

declare type GameControlButtonTypes =
    | 'button0'
    | 'button1'
    | 'button2'
    | 'button3'
    | 'button4'
    | 'button5'
    | 'button6'
    | 'button7'
    | 'button8'
    | 'button9'
    | 'button10'
    | 'button11'
    | 'button12'
    | 'button13'
    | 'button14'
    | 'button15'
    | 'button16'
    | 'up0'
    | 'down0'
    | 'right0'
    | 'left0'
    | 'up1'
    | 'down1'
    | 'right1'
    | 'left1'
    | 'start'
    | 'select'
    | 'power'
    | 'l1'
    | 'l2'
    | 'r1'
    | 'r2'
    | 'up'
    | 'down'
    | 'right'
    | 'left'
    ;

declare interface IGamepadObject {
    id: number;
    axes: number;
    axeThreshold: number[];
    buttons: number;
    mapping: string;
    vibration: boolean;

    on: (eventName: GameControlButtonTypes, callback: () => void) => void;
    off: (eventName: GameControlButtonTypes) => void;
    before: (eventName: GameControlButtonTypes, callback: () => void) => void;
    after: (eventName: GameControlButtonTypes, callback: () => void) => void;
    vibrate: (intensity: number, duration: number) => void;
}

declare namespace gameControl {
    export const isReady: boolean;

    export function on(eventName: GameControlEventTypes, callback: (gamepadObject: IGamepadObject) => void): void;
    export function off(eventName: GameControlEventTypes): void;
    export function getGamepad(ID: number): IGamepadObject;
    export function getGamepads(): { [key: number]: IGamepadObject };
}
