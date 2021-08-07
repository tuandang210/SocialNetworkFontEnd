import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStatusComponent } from './image-status.component';

describe('ImageStatusComponent', () => {
  let component: ImageStatusComponent;
  let fixture: ComponentFixture<ImageStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
