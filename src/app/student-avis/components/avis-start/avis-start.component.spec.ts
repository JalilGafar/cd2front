import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisStartComponent } from './avis-start.component';

describe('AvisStartComponent', () => {
  let component: AvisStartComponent;
  let fixture: ComponentFixture<AvisStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
