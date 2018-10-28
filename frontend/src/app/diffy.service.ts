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

  constructor(
    private http: HttpClient
  ) { }

  public submitDiff(diffText: string): Observable<number> {
      this.storage[this.idCount] = diffText;
      const id = this.idCount;
      this.idCount++;
      console.log(`submitted`);
      console.log(diffText);
      return of(id);
  }

  public getDiff(id: number): Observable<SharedDiff> {
    const raw_diff = this.storage[id];
    return of(raw_diff && this.makeSharedDiff(raw_diff));
  }
}
