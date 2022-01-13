import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { SharedDiff } from 'diffy-models';
import {Error} from './types/Error';
import * as Diff2Html from 'diff2html';

// var diff2html = require('diff2html');

@Injectable({providedIn: 'root'})
export class DiffyService {
  private diffyUrl = '/api/diff/';  // URL to web api

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return throwError(this.buildError(error));
    };
  }

  private buildError(httpError): Error {
    if (httpError.status >= 500) {
      return {type: 'SERVER_ERROR', text: 'Oops, something broke on the server :-/'};
    }
    if (httpError.status >= 400) {
      return {
        type: 'CLIENT_ERROR',
        text: httpError.error.error || 'unknown error',
      };
    }
  }

  getDiff(id: string): Observable<SharedDiff> {
    return this.http.get(this.diffyUrl + id)
      .pipe(map((getDiffOutput: any) => this.makeSharedDiffFromJson(getDiffOutput._sharedDiff)))
      .pipe(catchError(this.handleError('getDiff', null)));
  }

  storeDiff(diffText: string): Observable<SharedDiff> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    return this.http.put(this.diffyUrl, {diff: diffText}, httpOptions)
        .pipe(map((createDiffOutput: any) => this.makeSharedDiffFromJson(createDiffOutput._sharedDiff)))
        .pipe(catchError(this.handleError('getDiff', null)));
  }

  deleteDiff(id: string): Observable<boolean> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    return this.http.delete(this.diffyUrl + id, httpOptions)
        .pipe(catchError(this.handleError('deleteDiff', null)));
  }

  extendLifetime(id: string): Observable<SharedDiff> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    return this.http.post(this.diffyUrl + 'extend/' + id, httpOptions)
        .pipe(map(diffyObj => this.makeSharedDiffFromJson(diffyObj)))
        .pipe(catchError(this.handleError('extendLifetimeDiff', null)));
  }

  makePermanent(id: string): Observable<SharedDiff> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
    };

    return this.http.post(this.diffyUrl + 'makePermanent/' + id, httpOptions)
      .pipe(map(diffyObj => this.makeSharedDiffFromJson(diffyObj)))
      .pipe(catchError(this.handleError('extendLifetimeDiff', null)));
  }

  downloadDiff(id: string) {
    window.open('/diff_download/' + id);
  }

  private makeSharedDiff(raw_diff: string, date: Date = new Date()): SharedDiff {
    let expire_date = new Date();
    expire_date.setDate(date.getDate() + 1);
    return {
      created: date,
      expiresAt: expire_date,
      diff: Diff2Html.parse(raw_diff),
      rawDiff: raw_diff,
    };
  }
  
  private makeSharedDiffFromJson(diffyObj): SharedDiff {
    let sharedDiff = this.makeSharedDiff(diffyObj.rawDiff, new Date(diffyObj.created));
    sharedDiff.expiresAt = new Date(diffyObj.expiresAt);
    sharedDiff.id = diffyObj.id;
    return sharedDiff
  }
}