import { NAME as ArenaReducerName } from 'containers/Arena/state/constants';
import { reducer as ArenaReducer } from 'containers/Arena/state/reducers';
import { NAME as GamepadReducerName } from 'containers/Gamepad/state/constants';
import { reducer as GamepadReducer } from 'containers/Gamepad/state/reducers';
import { NAME as TankReducerName } from 'containers/Tanks/state/constants';
import { reducer as TankReducer } from 'containers/Tanks/state/reducers';

export const reducers = {
    [ArenaReducerName]: ArenaReducer,
    [GamepadReducerName]: GamepadReducer,
    [TankReducerName]: TankReducer,
};
