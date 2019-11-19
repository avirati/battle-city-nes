import { ICell } from '../models/Cell';

export interface IState {
    arena: {
        cells: ICell[][];
    };
}
