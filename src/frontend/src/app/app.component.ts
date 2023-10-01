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
  private filterSubject = new BehaviorSubject<string> ('');
  filterStatus$ = this.filterSubject.asObservable();s


  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    //we are subsrcibing to the servers$ observable, which is making a http request.
    this.appState$ = this.serverService.servers$
      .pipe(
        map(res => {
          return { dataState: DataState.LOADED_STATE, appData: res };
        }),
        //While servers$ is making the request  (this takes time), we will return the object inside of startWith
        startWith({ dataState: DataState.LOADING_STATE }), //appData is optional so don't need to pass
        catchError((error: string) => {
          //of is from rxjs to make an observable
          return of({ dataState: DataState.ERROR_STATE, error: error })
        })
      );
  }
}
