import { Component, OnInit, Input } from '@angular/core';
import { Diff2Html }                from 'diff2html';
import { SharedDiff }               from '../SharedDiff';
import { printerUtils }             from '../diff-detail/printer-utils.js';

@Component({
    selector: 'app-diff-detail-content',
    templateUrl: './diff-detail-content.component.html',
    styleUrls: ['./diff-detail-content.component.css']
})
export class DiffDetailContentComponent implements OnInit {
    @Input() sharedDiff   : SharedDiff;
    @Input() fileToRender : string;

    constructor() { }

    ngOnInit() { }

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
