import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoTopBnComponent } from './go-top-bn.component';

describe('GoTopBnComponent', () => {
  let component: GoTopBnComponent;
  let fixture: ComponentFixture<GoTopBnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoTopBnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoTopBnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
