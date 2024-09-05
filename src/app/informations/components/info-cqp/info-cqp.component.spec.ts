import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCqpComponent } from './info-cqp.component';

describe('InfoCqpComponent', () => {
  let component: InfoCqpComponent;
  let fixture: ComponentFixture<InfoCqpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCqpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoCqpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
