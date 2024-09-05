import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBacTechniqueComponent } from './info-bac-technique.component';

describe('InfoBacTechniqueComponent', () => {
  let component: InfoBacTechniqueComponent;
  let fixture: ComponentFixture<InfoBacTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBacTechniqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoBacTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
