import { Component, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT }                         from '@angular/common';
import { DiffyService }                     from '../diffy.service';
import { AlertService }                     from '../alert.service';
import { SharedDiff, makeSharedDiff }       from '../SharedDiff';
import { ActivatedRoute, Router }           from '@angular/router';
import { FileTree }                         from '../diff-detail/tree-functions';
import { printerUtils }                     from '../diff-detail/printer-utils.js';
import { Error }                            from '../types/Error';

@Component({
    selector: 'app-diff-detail',
    templateUrl: './diff-detail.component.html',
    styleUrls: ['./diff-detail.component.css']
})
export class DiffDetailComponent implements OnInit {

    loading        : boolean;
    sharedDiff     : SharedDiff;
    fileTree       : FileTree;
    fileSelectorFn : (fileId: string) => void;
    selectedFileId : string;
    dom            : Document;
    currentId      : string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private diffyService: DiffyService,
        private alertService: AlertService,
        @Inject(DOCUMENT) dom: Document
    ) {
        this.dom = dom;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.currentId = id;
        this.loading = true;
        this.diffyService.getDiff(id)
            .subscribe(diffy => {
                this.sharedDiff = makeSharedDiff(diffy.rawDiff, new Date(diffy.created));
                this.sharedDiff.expiresAt = new Date(diffy.expiresAt);
                this.loading = false;
            }, error => {
                this.loading = false;
            }
        );
    }

    private getFileName(file) {
        return file.newName == '/dev/null' ? file.oldName : file.newName;
    };

    getFileSelectorFn() {
        if(!this.fileSelectorFn) {
            this.fileSelectorFn = (fileId:string) => {
                this.selectedFileId = fileId;
            }
        }
        return this.fileSelectorFn;
    }

    getFileTree(): FileTree {
        if(!this.fileTree) {
            let tree = new FileTree();
            this.sharedDiff.diff.forEach(e => {
                tree.insert(this.getFileName(e), e);
            });
            this.fileTree = tree;
        }
        return this.fileTree;
    }

    getFileCount(): number {
        return this.sharedDiff.diff.length;
    }

    getDeleteDiff() {
        return () => {
            this.diffyService.deleteDiff(this.currentId)
                .subscribe(success => {
                    this.alertService.success("Deleted successfully", true);
                    this.router.navigate(["/"]);
            }, (error: Error) => {
                        this.alertService.error(":-( Error while deleting: " + error.text, true);
            });
        };
    }

    getDownloadDiff() {
        return () => {
            this.diffyService.downloadDiff(this.currentId);
        };
    }

    getCopyUrlToClipboard() {
        return () => {
            //copy logic here
            let element = this.dom.getElementById("clip-txt") as any;
            element.select();
            this.dom.execCommand("copy");
        };
    }

    getCurrentUrl() {
        return window.location.href;
    }
}
