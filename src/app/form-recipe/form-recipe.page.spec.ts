import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormRecipePage } from './form-recipe.page';

describe('FormRecipePage', () => {
  let component: FormRecipePage;
  let fixture: ComponentFixture<FormRecipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
