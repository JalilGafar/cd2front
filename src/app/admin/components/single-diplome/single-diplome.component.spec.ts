import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDiplomeComponent } from './single-diplome.component';

describe('SingleDiplomeComponent', () => {
  let component: SingleDiplomeComponent;
  let fixture: ComponentFixture<SingleDiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDiplomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleDiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
