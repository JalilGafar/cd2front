import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisSchoolComponent } from './avis-school.component';

describe('AvisSchoolComponent', () => {
  let component: AvisSchoolComponent;
  let fixture: ComponentFixture<AvisSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisSchoolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
