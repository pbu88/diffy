import { Component, OnInit, Input } from '@angular/core';
import { Diff2Html }                from 'diff2html';
import { SharedDiff }               from '../SharedDiff';
import { printerUtils }             from '../diff-detail/printer-utils.js';
import { DomSanitizer, SafeHtml }   from '@angular/platform-browser';

@Component({
    selector: 'app-diff-detail-content',
    templateUrl: './diff-detail-content.component.html',
    styleUrls: ['./diff-detail-content.component.css']
})
export class DiffDetailContentComponent implements OnInit {
    @Input() sharedDiff   : SharedDiff;
    @Input() fileToRender : string;
    diffContent           : SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.diffContent = this.sanitizer.bypassSecurityTrustHtml(this.renderDiff());
    }

    renderDiff(): string {
        if(this.fileToRender) {
            return Diff2Html.getPrettyHtmlFromJson(
                this.sharedDiff.diff.filter(
                    fileContent => printerUtils.getHtmlId(fileContent) == this.fileToRender));
        }
        return Diff2Html.getPrettyHtmlFromJson(
            [this.sharedDiff.diff[0]]);
    }

}
