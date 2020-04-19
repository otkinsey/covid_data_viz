import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectionGraphComponent } from './infection-graph.component';

describe('InfectionGraphComponent', () => {
  let component: InfectionGraphComponent;
  let fixture: ComponentFixture<InfectionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
