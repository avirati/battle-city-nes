export interface IApplicationState {
    dummy: any[];
}

export interface IReduxAction<T = any, D = any> {
    type: T;
    data?: D;
}
