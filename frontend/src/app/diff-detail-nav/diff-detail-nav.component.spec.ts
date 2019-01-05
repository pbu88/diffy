import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffDetailNavComponent } from './diff-detail-nav.component';

describe('DiffDetailNavComponent', () => {
  let component: DiffDetailNavComponent;
  let fixture: ComponentFixture<DiffDetailNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffDetailNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDetailNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
