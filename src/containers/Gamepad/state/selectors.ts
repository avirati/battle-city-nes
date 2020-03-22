import { createSelector } from 'reselect';

import { IApplicationState } from 'state/interfaces';

import { NAME } from './constants';
import { IGamepadState } from './interfaces';

export const gamepadStateSelector = (state: IApplicationState): IGamepadState => state[NAME];

export const gamepadKeyBindingsSelector = createSelector(
    gamepadStateSelector,
    (gamepadState) => gamepadState.keyBindings,
);
