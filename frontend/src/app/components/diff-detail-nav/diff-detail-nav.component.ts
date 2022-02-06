import {Component, Input, OnInit} from '@angular/core';

import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-diff-detail-nav',
  templateUrl: './diff-detail-nav.component.html'
})
export class DiffDetailNavComponent implements OnInit {
  @Input() showActions: boolean;
  @Input() _deleteAction: () => void;
  @Input() _downloadAction: () => void;
  @Input() _copyToClipboard: () => void;
  @Input() currentUrl: string;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {}

  deleteAction() {
    this.analyticsService.clickDeleteButton();
    this._deleteAction();
  }

  downloadAction() {
    this.analyticsService.clickDownloadButton();
    this._downloadAction();
  }

  copyToClipboard() {
    this.analyticsService.clickCopyUrlButton();
    this._copyToClipboard();
  }
}
