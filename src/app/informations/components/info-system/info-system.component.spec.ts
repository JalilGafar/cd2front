import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSystemComponent } from './info-system.component';

describe('InfoSystemComponent', () => {
  let component: InfoSystemComponent;
  let fixture: ComponentFixture<InfoSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
