import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareTypeComponent } from './welfare-type.component';

describe('WelfareTypeComponent', () => {
  let component: WelfareTypeComponent;
  let fixture: ComponentFixture<WelfareTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelfareTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelfareTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
