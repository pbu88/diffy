import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffDetailComponent } from './diff-detail.component';

describe('DiffDetailComponent', () => {
  let component: DiffDetailComponent;
  let fixture: ComponentFixture<DiffDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
