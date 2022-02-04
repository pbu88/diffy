import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { AlertService } from '../alert.service';
import { FileTree } from '../diff-detail/tree-functions';
import { DiffyService } from '../diffy.service';
import { SharedDiff } from 'diffy-models';
import { Error } from '../types/Error';

const DIFF_MAX_DATE = new Date('9999-01-01');
const MAKE_PERMANENT_THRESHOLD = 5 * 24 * 60 * 60 * 1000 - 1;

@Component({
  selector: 'app-diff-detail',
  templateUrl: './diff-detail.component.html',
  styleUrls: ['./diff-detail.component.css']
})
export class DiffDetailComponent implements OnInit, OnDestroy {

  loading: boolean;
  sharedDiff: SharedDiff;
  fileTree: FileTree;
  fileSelectorFn: (fileId: string) => void;
  selectedFileId: string;
  dom: Document;
  currentId: string;

  private _unsubscribe$ = new Subject<void>();

  constructor(
      private router: Router, private route: ActivatedRoute, private diffyService: DiffyService,
      private alertService: AlertService, @Inject(DOCUMENT) dom: Document) {
    this.dom = dom;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentId = id;
    this.loading = true;
    this.diffyService.getDiff(id)
    .pipe(
      takeUntil(this._unsubscribe$),
      finalize(() => this.loading = false)
    ).subscribe(
        sharedDiff => {
          this.sharedDiff = sharedDiff
        });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private getFileName(file) {
    return file.newName == '/dev/null' ? file.oldName : file.newName;
  };

  shouldDisplayMakePermanent(): boolean {
    const dateDiff = this.sharedDiff.expiresAt.getTime() - this.sharedDiff.created.getTime();
    return dateDiff > MAKE_PERMANENT_THRESHOLD;
  }

  getFileSelectorFn() {
    if (!this.fileSelectorFn) {
      this.fileSelectorFn = (fileId: string) => {
        this.selectedFileId = fileId;
      }
    }
    return this.fileSelectorFn;
  }

  getFileTree(): FileTree {
    if (!this.fileTree) {
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
          .pipe(
            takeUntil(this._unsubscribe$),
          )
          .subscribe(
              success => {
                this.alertService.success('Deleted successfully', true);
                this.router.navigate(['/']);
              },
              (error: Error) => {
                this.alertService.error(':-( Error while deleting: ' + error.text, true);
              });
    };
  }

  getDownloadDiff() {
    return () => {
      this.diffyService.downloadDiff(this.currentId);
    };
  }

  getExtendLifetimeFn() {
    return () => {
      this.diffyService.extendLifetime(this.currentId)
          .pipe(
            takeUntil(this._unsubscribe$),
          )
          .subscribe(
              sharedDiff => {
                this.sharedDiff = sharedDiff;
              },
              (error: Error) => {
                this.alertService.error(':-( Error while extending diff: ' + error.text, true);
              });
  };
  }

  getMakePermanentDiffFn(): (email: string) => void {
    return () => {
      this.diffyService.makePermanent(this.currentId)
          .pipe(
            takeUntil(this._unsubscribe$),
          )
          .subscribe(
              sharedDiff => {
                this.sharedDiff = sharedDiff;
              },
              (error: Error) => {
                this.alertService.error(':-( Error while making diff permanent: ' + error.text, true);
              });
    };
  }

  getCopyUrlToClipboard() {
    return () => {
      // copy logic here
      let element = this.dom.getElementById('clip-txt') as any;
      element.select();
      this.dom.execCommand('copy');
    };
  }

  getCurrentUrl() {
    return window.location.href;
  }
  isDiffPermanent() {
    return this.sharedDiff.expiresAt >= DIFF_MAX_DATE;
  }
}
