import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DiffyService } from '../diffy.service';

import { DiffDetailComponent } from './diff-detail.component';

describe('DiffDetailComponent', () => {
  let component: DiffDetailComponent;
  let fixture: ComponentFixture<DiffDetailComponent>;
  const DIFF_ID = "1";
  const DIFF_CREATED_DATE = new Date('2022-01-01');
  const DIFF_EXPIRES_AT = new Date('2022-01-02');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [DiffDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => DIFF_ID } },
          },
        },
        {
          provide: DiffyService,
          useValue: {
            getDiff: () => of({
              id: DIFF_ID,
              rawDiff: "--",
              created: DIFF_CREATED_DATE,
              expiresAt: DIFF_EXPIRES_AT,
              diff: [],
            }),
            extendLifetime: () => of({
              id: DIFF_ID,
              rawDiff: "--",
              created: DIFF_CREATED_DATE,
              expiresAt: new Date("2022-01-03"),
              diff: [],
            }),
            makePermanent: () => of({
              id: DIFF_ID,
              rawDiff: "--",
              created: DIFF_CREATED_DATE,
              expiresAt: new Date("9999-01-01"),
              diff: [],
            }),
          },
        }
      ]

    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should fetch a diff by id', () => {
    expect(component.currentId).toBe(DIFF_ID);
    expect(component.sharedDiff.expiresAt).toEqual(DIFF_EXPIRES_AT);
  });

  it('getExtendLifetimeFn', () => {
    component.getExtendLifetimeFn()();
    expect(component.sharedDiff.expiresAt).toEqual(new Date("2022-01-03"));
  });

  it('getMakePermanentDiffFn', () => {
    component.getMakePermanentDiffFn()("foo@example.com");
    expect(component.sharedDiff.expiresAt).toEqual(new Date("9999-01-01"));
  });
});
