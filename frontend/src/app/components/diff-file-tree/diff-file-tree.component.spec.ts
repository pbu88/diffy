import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileTree } from '../../utils/tree-functions';

import { DiffFileTreeComponent } from './diff-file-tree.component';

describe('DiffFileTreeComponent', () => {
  let component: DiffFileTreeComponent;
  let fixture: ComponentFixture<DiffFileTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [DiffFileTreeComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffFileTreeComponent);
    component = fixture.componentInstance;
    component.fileTree = new FileTree();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
