export interface IGamepadState {
    gamepads: { [key: string]: Gamepad | undefined };
    keyBindings: { [gamepadKey: string]: number};
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
