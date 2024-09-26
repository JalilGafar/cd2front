import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubAdversComponent } from './pub-advers.component';

describe('PubAdversComponent', () => {
  let component: PubAdversComponent;
  let fixture: ComponentFixture<PubAdversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubAdversComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PubAdversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
