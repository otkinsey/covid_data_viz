import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotatingGlobeComponent } from './rotating-globe.component';

describe('RotatingGlobeComponent', () => {
  let component: RotatingGlobeComponent;
  let fixture: ComponentFixture<RotatingGlobeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotatingGlobeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotatingGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
