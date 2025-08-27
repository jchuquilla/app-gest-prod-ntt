import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, Observable, retry, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor{

  constructor(){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap(event => {
        if(event instanceof HttpResponse){
          if(event.body && event.body.error === true && event.body.errorMessage){
            throw new Error(event.body.errorMessage);
          }
        }
      })).pipe(catchError( (err) => {
        console.log(err)
        if(err.status === 400){
          alert('Error: ' + err.status + ' - ' + err.name + ' ' + err.message);
        }else if(err.status === 404){
          alert('Error: ' + err.status + ' - ' + err.name + ' ' + err.message);
        }else if(err.status === 500){
          console.log(err);
        }else{
          console.log(err);
        }

        return EMPTY;
      }));
  }

}
