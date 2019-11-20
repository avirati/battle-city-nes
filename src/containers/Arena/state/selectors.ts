import { createSelector } from 'reselect';

import { IArena } from 'models/Arena';
import { IApplicationState } from 'state/interfaces';


export const arenaState = (state: IApplicationState): IArena => state.arena;

export const getArenaMatrix = createSelector(
    arenaState,
    (localState: IArena) => localState.matrix,
);

export const getArenaSize = createSelector(
    arenaState,
    (localState: IArena) => localState.size,
);
