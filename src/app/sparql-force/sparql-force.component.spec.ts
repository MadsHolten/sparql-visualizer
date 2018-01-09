import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlForceComponent } from './sparql-force.component';

describe('SparqlForceComponent', () => {
  let component: SparqlForceComponent;
  let fixture: ComponentFixture<SparqlForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparqlForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparqlForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
