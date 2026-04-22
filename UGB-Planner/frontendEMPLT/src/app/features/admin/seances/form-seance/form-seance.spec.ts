import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSeance } from './form-seance';

describe('FormSeance', () => {
  let component: FormSeance;
  let fixture: ComponentFixture<FormSeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSeance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSeance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
