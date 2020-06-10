import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AlertService} from '../alert.service';
import {AnalyticsService} from '../analytics.service';
import {DiffyService} from '../diffy.service';
import {Error} from '../types/Error';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @Input() diffText: string;

  constructor(
      private router: Router, private diffyService: DiffyService,
      private alertService: AlertService, private analyticsService: AnalyticsService) {}

  ngOnInit() {}

  diffMeClick() {
    this.analyticsService.clickDiffMeButton();
    this.submitDiff();
  }

  submitDiff() {
    this.diffyService.storeDiff(this.diffText)
        .subscribe(
            sharedDiff => {
              if (!sharedDiff || !sharedDiff.id) {
                return;
              }
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
      this.diffText = (e.target as any).result this.submitDiff();
    };
    reader.readAsText(file);
  }
}
