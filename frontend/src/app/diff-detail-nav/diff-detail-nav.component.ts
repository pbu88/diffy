import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-diff-detail-nav',
    templateUrl: './diff-detail-nav.component.html',
    styleUrls: ['./diff-detail-nav.component.css']
})
export class DiffDetailNavComponent implements OnInit {
    @Input() showActions: boolean;
    @Input() _deleteAction: () => void;

    constructor() { }

    ngOnInit() {
    }

    deleteAction() {
        this._deleteAction();
    }
}
