import { DataState } from "../enum/data-state.enum";

/*
********** Will handle what state the application is, at any given moment
*/
export interface AppState<T> {
    dataState: DataState;
    //user generics to catch what every type of data is being passed into appData. 
    // Can only have 1 either appData or error
    appData?: T
    error?: string;
}