import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBannerComponent } from './manage-banner.component';

describe('ManageBannerComponent', () => {
  let component: ManageBannerComponent;
  let fixture: ComponentFixture<ManageBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
