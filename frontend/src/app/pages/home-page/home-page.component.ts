import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { AlertService } from '../../services/alert.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { DiffyService } from 'src/app/services/diffy.service';
import { Error } from '../../types/Error';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  @Input() diffText: string;
  private uploading: boolean;
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router, private diffyService: DiffyService,
    private alertService: AlertService, private analyticsService: AnalyticsService) {

    this.uploading = false;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  isUploading(): boolean {
    return this.uploading;
  }

  diffMeClick() {
    this.analyticsService.clickDiffMeButton();
    this.submitDiff();
  }

  submitDiff() {
    this.uploading = true;
    this.diffyService.storeDiff(this.diffText)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this.uploading = false)
      )
      .subscribe(
        sharedDiff => {
          this.router.navigate([`/diff/${sharedDiff.id}`])
        },
        (error: Error) => {
          this.alertService.error('Error: ' + error.text);
        });
  }

  uploadChange(fileInput: Event) {
    this.analyticsService.clickUploadDiffButton();
    let file = (fileInput.target as any).files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      this.diffText = (e.target as any).result;
      this.submitDiff();
    };
    reader.readAsText(file);
  }
}
