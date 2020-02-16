import { takeLatest } from 'redux-saga/effects';

import { ActionTypes } from 'containers/Gamepad/state/actions';
import { TANK_SPAWN_POSITION } from 'global/constants';
import { TankDirection, TankType } from 'models/Tank';

import { spawnTank } from '../service';

function * watchForSaveKeyBindingSuccess() {
    yield takeLatest(ActionTypes.SAVE_KEY_BINDING_SUCCESS, saveKeyBindingSuccess);
}

function saveKeyBindingSuccess() {
    spawnTank(
        TankDirection.FORWARD,
        TANK_SPAWN_POSITION.BOTTOM_LEFT,
        TankType.PLAYER,
    );
}

export const sagas = [
    watchForSaveKeyBindingSuccess,
];
