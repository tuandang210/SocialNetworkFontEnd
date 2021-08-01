import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBlockComponent } from './account-block.component';

describe('AccountBlockComponent', () => {
  let component: AccountBlockComponent;
  let fixture: ComponentFixture<AccountBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
