import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCours } from './liste-cours';

describe('ListeCours', () => {
  let component: ListeCours;
  let fixture: ComponentFixture<ListeCours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
