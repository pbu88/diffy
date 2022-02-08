import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Diff2Html from 'diff2html';

import { printerUtils } from '../../utils/printer-utils';
import { SharedDiff } from 'diffy-models';

const DIFF2HTML_RENDER_CONFIG: Diff2Html.Diff2HtmlConfig = {
  drawFileList: false,
  matching: 'lines',
};

@Component({
  selector: 'app-diff-detail-content',
  templateUrl: './diff-detail-content.component.html'
})
export class DiffDetailContentComponent implements OnChanges {
  @Input() sharedDiff: SharedDiff;
  @Input() fileToRender: string;
  diffContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: any) {
    this.diffContent = this.sanitizer.bypassSecurityTrustHtml(this.renderDiff());
  }

  renderDiff(): string {
    if (this.fileToRender) {
      return Diff2Html.html(
        this.sharedDiff.diff.filter(
          fileContent => printerUtils.getHtmlId(fileContent) == this.fileToRender),
        DIFF2HTML_RENDER_CONFIG);
    }
    return Diff2Html.html([this.sharedDiff.diff[0]], DIFF2HTML_RENDER_CONFIG);
  }
}
