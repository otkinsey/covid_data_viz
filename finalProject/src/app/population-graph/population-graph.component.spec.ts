import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationGraphComponent } from './population-graph.component';

describe('PopulationGraphComponent', () => {
  let component: PopulationGraphComponent;
  let fixture: ComponentFixture<PopulationGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulationGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
