import { createSelector } from 'reselect';

import { IArena } from 'models/Arena';
import { IApplicationState } from 'state/interfaces';

export const arenaStateSelector = (state: IApplicationState): IArena => state.arena;

export const getArenaMatrixSelector = createSelector(
    arenaStateSelector,
    (localState: IArena) => localState.matrix,
);

export const getArenaSizeSelector = createSelector(
    arenaStateSelector,
    (localState: IArena) => localState.size,
);

export const getArenaMetaSelector = createSelector(
    arenaStateSelector,
    (localState: IArena) => localState.meta,
);

export const getActiveBrushSelector = createSelector(
    getArenaMetaSelector,
    (meta: IArena['meta']) => meta.activeBrush,
);
