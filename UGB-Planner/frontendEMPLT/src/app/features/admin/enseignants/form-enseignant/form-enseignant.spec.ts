import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEnseignant } from './form-enseignant';

describe('FormEnseignant', () => {
  let component: FormEnseignant;
  let fixture: ComponentFixture<FormEnseignant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEnseignant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEnseignant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
