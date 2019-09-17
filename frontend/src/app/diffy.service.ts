import { Injectable }                 from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap }       from 'rxjs/operators';
import { SharedDiff }                 from './SharedDiff';
import { Error }                      from './types/Error';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { Diff2Html }                  from 'diff2html';
//var diff2html = require('diff2html');

@Injectable({
    providedIn: 'root'
})
export class DiffyService {
    private diffyUrl = '/api/diff/';  // URL to web api

    private storage: {[id: number]: string} = {};
    private idCount = 1;

    constructor(
        private http: HttpClient
    ) { }

    private makeSharedDiff(raw_diff: string, date: Date = new Date()): SharedDiff {
        let expire_date = new Date();
        expire_date.setDate(date.getDate() + 1);
        return {
            created: date,
            expiresAt: expire_date,
            diff: Diff2Html.getJsonFromDiff(raw_diff),
            rawDiff: raw_diff,
        };
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            return throwError(this.buildError(error));
        };
    }

    private buildError(httpError): Error {
        if (httpError.status >= 500) {
            return {
                type: "SERVER_ERROR",
                text: "Oops, something broke on the server :-/"
            };
        }
        if (httpError.status >= 400) {
            return {
                type: "CLIENT_ERROR",
                text: httpError.error.error || "unknown error",
            };
        }
    }

    public getDiff(id: string): Observable<any> {
        return this.http.get(this.diffyUrl + id).pipe(
            catchError(this.handleError('getDiff', null))
        );
    }

    storeDiff(diffText: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.put(this.diffyUrl, {diff: diffText}, httpOptions).pipe(
            catchError(this.handleError('getDiff', null))
        );
    }

    deleteDiff(id: string): Observable<boolean> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.delete(this.diffyUrl + id, httpOptions).pipe(
            catchError(this.handleError('deleteDiff', null))
        );
    }

    extendLifetime(id: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post(this.diffyUrl + 'extend/' + id, httpOptions).pipe(
            catchError(this.handleError('extendLifetimeDiff', null))
        );
    }

    downloadDiff(id: string) {
        window.open("/diff_download/" + id);
    }
}
