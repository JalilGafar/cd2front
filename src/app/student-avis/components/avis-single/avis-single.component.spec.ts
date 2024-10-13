import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisSingleComponent } from './avis-single.component';

describe('AvisSingleComponent', () => {
  let component: AvisSingleComponent;
  let fixture: ComponentFixture<AvisSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisSingleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
