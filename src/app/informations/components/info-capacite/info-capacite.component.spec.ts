import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCapaciteComponent } from './info-capacite.component';

describe('InfoCapaciteComponent', () => {
  let component: InfoCapaciteComponent;
  let fixture: ComponentFixture<InfoCapaciteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCapaciteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoCapaciteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
