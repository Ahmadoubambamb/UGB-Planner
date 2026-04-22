import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEnseignants } from './liste-enseignants';

describe('ListeEnseignants', () => {
  let component: ListeEnseignants;
  let fixture: ComponentFixture<ListeEnseignants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeEnseignants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeEnseignants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
