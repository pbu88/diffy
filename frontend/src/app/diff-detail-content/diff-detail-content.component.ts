import { Component, OnInit, Input } from '@angular/core';
import { Diff2Html }                from 'diff2html';
import { SharedDiff }               from '../SharedDiff';

@Component({
  selector: 'app-diff-detail-content',
  templateUrl: './diff-detail-content.component.html',
  styleUrls: ['./diff-detail-content.component.css']
})
export class DiffDetailContentComponent implements OnInit {
  @Input() sharedDiff: SharedDiff;

  constructor() { }

  ngOnInit() {
  }

  renderDiff(): string {
    return Diff2Html.getPrettyHtmlFromJson(this.sharedDiff.diff);
  }

}
