import {Component, Input, OnInit} from '@angular/core';

import {printerUtils} from '../../utils/printer-utils';
import {FileTree} from '../../utils/tree-functions';

@Component({
  selector: 'app-diff-file-tree',
  templateUrl: './diff-file-tree.component.html'
})
export class DiffFileTreeComponent implements OnInit {
  @Input() fileTree: FileTree;
  @Input() isOpen: boolean;
  @Input() fileSelectorFn: (fileId: string) => void;

  constructor() {}

  ngOnInit() {}

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
