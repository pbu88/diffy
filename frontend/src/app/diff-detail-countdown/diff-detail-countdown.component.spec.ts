import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DiffDetailCountdownComponent} from './diff-detail-countdown.component';

describe('DiffDetailCountdownComponent', () => {
  let component: DiffDetailCountdownComponent;
  let fixture: ComponentFixture<DiffDetailCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [DiffDetailCountdownComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDetailCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
