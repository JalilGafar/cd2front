import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMetierItemComponent } from './info-metier-item.component';

describe('InfoMetierItemComponent', () => {
  let component: InfoMetierItemComponent;
  let fixture: ComponentFixture<InfoMetierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoMetierItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoMetierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
