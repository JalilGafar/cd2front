import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActuComponent } from './edit-actu.component';

describe('EditActuComponent', () => {
  let component: EditActuComponent;
  let fixture: ComponentFixture<EditActuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
