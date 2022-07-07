import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTosComponent } from './manage-tos.component';

describe('ManageTosComponent', () => {
  let component: ManageTosComponent;
  let fixture: ComponentFixture<ManageTosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
