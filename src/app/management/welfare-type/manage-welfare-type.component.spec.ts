import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWelfareTypeComponent } from './manage-welfare-type.component';

describe('ManageWelfareTypeComponent', () => {
  let component: ManageWelfareTypeComponent;
  let fixture: ComponentFixture<ManageWelfareTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWelfareTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWelfareTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
