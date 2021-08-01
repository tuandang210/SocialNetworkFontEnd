import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCrateComponent } from './status-crate.component';

describe('StatusCrateComponent', () => {
  let component: StatusCrateComponent;
  let fixture: ComponentFixture<StatusCrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusCrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
