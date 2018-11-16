import { Injectable }              from '@angular/core';

import { Observable, of }          from 'rxjs';
import { catchError, map, tap }    from 'rxjs/operators';
import { SharedDiff }              from './SharedDiff';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Diff2Html }               from 'diff2html';
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

    public submitDiff(diffText: string): Observable<number> {
        this.storage[this.idCount] = diffText;
        const id = this.idCount;
        this.idCount++;
        return of(id);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    public getDiff(id: string): Observable<any> {
        return this.http.get(this.diffyUrl + id).pipe(
            catchError(this.handleError('getDiff', null))
        );
    }

    /** PUT: update the hero on the server */
    storeDiff(diffText: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.put(this.diffyUrl, {diff: diffText}, httpOptions).pipe(
            catchError(this.handleError('getDiff', null))
        );
    }
}
