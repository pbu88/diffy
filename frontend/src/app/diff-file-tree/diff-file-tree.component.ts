import { Component, OnInit, Input } from '@angular/core';
import { FileTree }                 from '../diff-detail/tree-functions';
import { printerUtils }             from '../diff-detail/printer-utils.js';

@Component({
    selector: 'app-diff-file-tree',
    templateUrl: './diff-file-tree.component.html',
    styleUrls: ['./diff-file-tree.component.css']
})
export class DiffFileTreeComponent implements OnInit {
    @Input() fileTree       : FileTree;
    @Input() isOpen         : boolean;
    @Input() fileSelectorFn : (fileId:string) => void;

    constructor() { }

    ngOnInit() { }

    private getFileName(file) {
        return file.newName == '/dev/null' ? file.oldName : file.newName;
    };

    getFileHash(file) {
        return printerUtils.getHtmlId(file.value);
    }

    toggleFolder() {
        this.isOpen = !this.isOpen;
    }
}
