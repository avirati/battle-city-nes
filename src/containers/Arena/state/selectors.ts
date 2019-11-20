import { createSelector } from 'reselect';

import { IApplicationState } from 'state/interfaces';

import { IArena } from '../models/Arena';

export const arenaState = (state: IApplicationState): IArena => state.arena;

export const getArenaMatrix = createSelector(
    arenaState,
    (localState: IArena) => localState.matrix,
);

export const getArenaSize = createSelector(
    arenaState,
    (localState: IArena) => localState.size,
);
