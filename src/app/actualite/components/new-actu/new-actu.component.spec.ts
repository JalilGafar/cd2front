import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActuComponent } from './new-actu.component';

describe('NewActuComponent', () => {
  let component: NewActuComponent;
  let fixture: ComponentFixture<NewActuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewActuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
