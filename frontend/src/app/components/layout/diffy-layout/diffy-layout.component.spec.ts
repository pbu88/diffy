import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffyLayoutComponent } from './diffy-layout.component';

describe('DiffyLayoutComponent', () => {
  let component: DiffyLayoutComponent;
  let fixture: ComponentFixture<DiffyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffyLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
