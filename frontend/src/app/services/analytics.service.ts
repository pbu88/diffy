import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  constructor() {}

  clickCopyUrlButton() {
    (<any>window).ga('send', 'event', 'copyUrlButton', 'click');
  }

  clickDownloadButton() {
    (<any>window).ga('send', 'event', 'downloadButton', 'click');
  }

  clickDeleteButton() {
    (<any>window).ga('send', 'event', 'deleteButton', 'click');
  }

  clickUploadDiffButton() {
    (<any>window).ga('send', 'event', 'uploadDiffButton', 'click');
  }

  clickDiffMeButton() {
    (<any>window).ga('send', 'event', 'diffMeButton', 'click');
  }
}
