import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFormationItemComponent } from './info-formation-item.component';

describe('InfoFormationItemComponent', () => {
  let component: InfoFormationItemComponent;
  let fixture: ComponentFixture<InfoFormationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFormationItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoFormationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
