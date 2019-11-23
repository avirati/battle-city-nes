export interface IGamepadState {
    keyBindings: { [gamepadKey: string]: GameControlButtonTypes | number};
}

export enum GamepadButtonAssignmentState {
    UNASSIGNED = 'UNASSIGNED',
    ASSIGNED = 'ASSIGNED',
    WAITING = 'WAITING',
}

export enum GamepadControls {
    GAMEPAD_UP = 'GAMEPAD_UP',
    GAMEPAD_DOWN = 'GAMEPAD_DOWN',
    GAMEPAD_LEFT = 'GAMEPAD_LEFT',
    GAMEPAD_RIGHT = 'GAMEPAD_RIGHT',

    GAMEPAD_SHOOT = 'GAMEPAD_SHOOT',
}

export interface IGamepadDOMEvents {
    buttonName: GameControlButtonTypes;
}
