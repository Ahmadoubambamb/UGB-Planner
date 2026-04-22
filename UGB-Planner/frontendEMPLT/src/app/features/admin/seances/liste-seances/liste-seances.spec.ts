import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSeances } from './liste-seances';

describe('ListeSeances', () => {
  let component: ListeSeances;
  let fixture: ComponentFixture<ListeSeances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeSeances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeSeances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
