import { createSelector } from 'reselect';

import { IApplicationState } from 'state/interfaces';

import { NAME } from './constants';
import { ITanksState } from './interfaces';

export const tanksStateSelector = (state: IApplicationState): ITanksState => state[NAME];

export const shellsSelector = createSelector(
    [tanksStateSelector],
    (state) => state.shells,
);

export const tanksSelector = createSelector(
    [tanksStateSelector],
    (state) => state.vehicles,
);

export const playerTankIDSelector = createSelector(
    [tanksStateSelector],
    (state) => state.playerID,
);

export const playerTankSelector = createSelector(
    [
        tanksSelector,
        playerTankIDSelector,
    ],
    (tanks, playerID) => tanks[playerID],
);
