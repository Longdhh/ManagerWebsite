import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSlideComponent } from './banner.component';

describe('HomeSlideComponent', () => {
  let component: HomeSlideComponent;
  let fixture: ComponentFixture<HomeSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSlideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
