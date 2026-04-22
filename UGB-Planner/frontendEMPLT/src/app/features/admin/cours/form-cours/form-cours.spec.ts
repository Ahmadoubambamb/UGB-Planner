import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCours } from './form-cours';

describe('FormCours', () => {
  let component: FormCours;
  let fixture: ComponentFixture<FormCours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
