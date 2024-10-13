import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAvisComponent } from './single-avis.component';

describe('SingleAvisComponent', () => {
  let component: SingleAvisComponent;
  let fixture: ComponentFixture<SingleAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleAvisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
