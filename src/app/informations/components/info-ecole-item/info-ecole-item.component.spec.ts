import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEcoleItemComponent } from './info-ecole-item.component';

describe('InfoEcoleItemComponent', () => {
  let component: InfoEcoleItemComponent;
  let fixture: ComponentFixture<InfoEcoleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEcoleItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoEcoleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
