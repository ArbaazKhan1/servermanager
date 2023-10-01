import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';
/*
  ***** We will be using this client to make all our http call backend and reterive our data  
*/
@Injectable({
  providedIn: 'root'
})
export class ServerService {
//Procedural approch to making calls to the backend (the typical way)
  // getServers(): Observable<CustomResponse> {
  //   return this.http.get<CustomResponse>(`http://localhost:8080/server/list`);
  // }

  constructor(private http: HttpClient) { } 
  //A more reactive way to make api calls to the backend
  private readonly apiUrl = 'http://localhost:8080';

  //When defining Obervables it is good practice to out down a $ at the end of it
  servers$ = <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //save call takes a param: server of tpe Server
  save$ = (server: Server) => <Observable<CustomResponse>> this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server) //pass in the request body from backend 
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ = (ipAddress: string) => <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>> 
  new Observable<CustomResponse> (
    subscriber => {
      console.log(response);
      //Observe the next customResponse 
      subscriber.next(
        //If the status we revives was of type ALL then return response (...response) and override the message with `Servers filtered by ${status} status`
        status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} : 
        //If status is not All then we need to filter everything and return a new object to the user, hence {}
          { 
            //keep all of response the same just override the message
            ...response, 
            message: response.data.servers
            //when we filter all the servers by the response status and if that array of filtered servers is >0 then return new message, else message say No servers of ${status} found
              .filter(server => server.status === status).length > 0 ? `Servers filtered by
              ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status` :
              `No servers of ${status} found`,
            //We also want to override the data we return. Where the servers is = to the filtered list of servers
            data: {servers: response.data.servers
              .filter(server => server.status === status) }
          }
      );
      subscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  delete$ = (serverId: number) => <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/server/ping${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
