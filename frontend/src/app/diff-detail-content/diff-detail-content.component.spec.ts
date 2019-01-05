import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffDetailContentComponent } from './diff-detail-content.component';

describe('DiffDetailContentComponent', () => {
  let component: DiffDetailContentComponent;
  let fixture: ComponentFixture<DiffDetailContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffDetailContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
