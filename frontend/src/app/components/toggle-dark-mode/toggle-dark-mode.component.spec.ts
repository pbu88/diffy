import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleDarkModeComponent } from './toggle-dark-mode.component';

describe('ToggleDarkModeComponent', () => {
  let component: ToggleDarkModeComponent;
  let fixture: ComponentFixture<ToggleDarkModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleDarkModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleDarkModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
