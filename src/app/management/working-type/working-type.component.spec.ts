import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTypeComponent } from './working-type.component';

describe('WorkingTypeComponent', () => {
  let component: WorkingTypeComponent;
  let fixture: ComponentFixture<WorkingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
