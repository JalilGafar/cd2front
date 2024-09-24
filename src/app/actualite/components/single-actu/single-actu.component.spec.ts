import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleActuComponent } from './single-actu.component';

describe('SingleActuComponent', () => {
  let component: SingleActuComponent;
  let fixture: ComponentFixture<SingleActuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleActuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
