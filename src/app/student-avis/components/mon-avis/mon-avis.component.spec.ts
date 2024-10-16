import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonAvisComponent } from './mon-avis.component';

describe('MonAvisComponent', () => {
  let component: MonAvisComponent;
  let fixture: ComponentFixture<MonAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonAvisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
