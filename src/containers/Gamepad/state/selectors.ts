import { createSelector } from 'reselect';

import { IApplicationState } from 'state/interfaces';

import { IGamepadState } from './interfaces';

export const gamepadStateSelector = (state: IApplicationState): IGamepadState => state.gamepad;

export const gamepadKeyBindingsSelector = createSelector(
    gamepadStateSelector,
    (gamepadState) => gamepadState.keyBindings,
);
