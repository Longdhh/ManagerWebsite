import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkingTypeComponent } from './manage-working-type.component';

describe('ManageWorkingTypeComponent', () => {
  let component: ManageWorkingTypeComponent;
  let fixture: ComponentFixture<ManageWorkingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWorkingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
