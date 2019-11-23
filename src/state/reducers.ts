import { NAME as ArenaReducerName } from 'containers/Arena/state/constants';
import { reducer as ArenaReducer } from 'containers/Arena/state/reducers';
import { NAME as GamepadReducerName } from 'containers/Gamepad/state/constants';
import { reducer as GamepadReducer } from 'containers/Gamepad/state/reducers';

export const reducers = {
    [ArenaReducerName]: ArenaReducer,
    [GamepadReducerName]: GamepadReducer,
};
