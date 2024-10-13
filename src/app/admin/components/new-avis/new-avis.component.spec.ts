import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAvisComponent } from './new-avis.component';

describe('NewAvisComponent', () => {
  let component: NewAvisComponent;
  let fixture: ComponentFixture<NewAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAvisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
