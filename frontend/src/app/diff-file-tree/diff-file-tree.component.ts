import { Component, OnInit, Input } from '@angular/core';
import { FileTree }                 from '../diff-detail/tree-functions';

@Component({
  selector: 'app-diff-file-tree',
  templateUrl: './diff-file-tree.component.html',
  styleUrls: ['./diff-file-tree.component.css']
})
export class DiffFileTreeComponent implements OnInit {
  @Input() fileTree: FileTree;
  @Input() isOpen: boolean;

  constructor() { }

  ngOnInit() { }

  private getFileName(file) {
    return file.newName == '/dev/null' ? file.oldName : file.newName;
  };

  toggleFolder() {
      this.isOpen = !this.isOpen;
  }
}
