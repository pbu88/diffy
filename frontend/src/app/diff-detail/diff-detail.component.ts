import { Component, OnInit } from '@angular/core';
import { DiffyService }      from '../diffy.service';
import { SharedDiff }        from '../SharedDiff';
import { FileTree }          from './tree-functions';
import { ActivatedRoute }    from '@angular/router';
//var diff2html = require('diff2html');
import { Diff2Html }         from 'diff2html';
console.log(Diff2Html);

@Component({
  selector: 'app-diff-detail',
  templateUrl: './diff-detail.component.html',
  styleUrls: ['./diff-detail.component.css']
})
export class DiffDetailComponent implements OnInit {
  sharedDiff: SharedDiff;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private diffyService: DiffyService
  ) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.diffyService.getDiff(id)
      .subscribe(diffy => {
        this.sharedDiff = diffy
        this.loading = false;
      });
  }

  renderDiff(): string {
    return Diff2Html.getPrettyHtmlFromJson(this.sharedDiff.diff);
  }

  private getFileName(file) {
    return file.newName == '/dev/null' ? file.oldName : file.newName;
  };

  renderFileTree(): string {
    let tree = new FileTree();
    this.sharedDiff.diff.forEach(e => {
        tree.insert(this.getFileName(e), e);
    });
    let html = tree.printTree(tree, 0);
    return html;
  }

}
