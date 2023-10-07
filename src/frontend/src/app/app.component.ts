import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  //is readonly cuz we don't use it to do anything in this class
  readonly DataState = DataState;
  readonly Status = Status;
  //use to show the spinner when loading
  private filterSubject = new BehaviorSubject<string> ('');
  //save response from backend
  private dataSubject = new BehaviorSubject<CustomResponse> (null);
  filterStatus$ = this.filterSubject.asObservable();s


  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    //we are subsrcibing to the servers$ observable, which is making a http request.
    this.appState$ = this.serverService.servers$
      .pipe(
        map(res => {
          this.dataSubject.next(res);
          return { dataState: DataState.LOADED_STATE, appData: res };
        }),
        //While servers$ is making the request  (this takes time), we will return the object inside of startWith
        startWith({ dataState: DataState.LOADING_STATE }), //appData is optional so don't need to pass
        catchError((error: string) => {
          //of is from rxjs to make an observable
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  pingServer(ipAddress: string): void {
    //show spinner when pinging ipaddress
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        //load backend data
        map(res => {
          //update dataSubject
          const index = this.dataSubject.value.data.servers.findIndex(server => server.id === res.data.server.id)
          this.dataSubject.value.data.servers[index] = res.data.server;
          //stop showing spinner
          this.filterSubject.next('');
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        //wait for response, state and data already already loaded, thus loaded_state, and dataSubject is intial values 
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          //stop showing spinner
          this.filterSubject.next('');
          //since variable error is the same name as error, can use shorthand and just set appData to error
          return of({dataState: DataState.ERROR_STATE, error});
        })
      )
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        //load backend data
        map(res => {
          return {dataState: DataState.LOADED_STATE, appData: res}
        }),
        //wait for response, state and data already already loaded, thus loaded_state, and dataSubject is intial values 
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          //since variable error is the same name as error, can use shorthand and just set appData to error
          return of({dataState: DataState.ERROR_STATE, error});
        })
      )
  }
}
