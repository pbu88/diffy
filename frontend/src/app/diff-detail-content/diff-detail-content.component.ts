import {Component, Input, OnChanges} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Diff2Html} from 'diff2html';

import {printerUtils} from '../diff-detail/printer-utils';
import {SharedDiff} from '../SharedDiff';

@Component({
  selector: 'app-diff-detail-content',
  templateUrl: './diff-detail-content.component.html',
  styleUrls: ['./diff-detail-content.component.css']
})
export class DiffDetailContentComponent implements OnChanges {
  @Input() sharedDiff: SharedDiff;
  @Input() fileToRender: string;
  diffContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: any) {
    this.diffContent = this.sanitizer.bypassSecurityTrustHtml(this.renderDiff());
  }

  renderDiff(): string {
    if (this.fileToRender) {
      return Diff2Html.getPrettyHtmlFromJson(this.sharedDiff.diff.filter(
          fileContent => printerUtils.getHtmlId(fileContent) == this.fileToRender));
    }
    return Diff2Html.getPrettyHtmlFromJson([this.sharedDiff.diff[0]]);
  }
}
