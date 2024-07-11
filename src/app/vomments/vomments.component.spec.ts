import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VommentsComponent } from './vomments.component';

describe('VommentsComponent', () => {
  let component: VommentsComponent;
  let fixture: ComponentFixture<VommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
