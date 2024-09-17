import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DernierdiplomeComponent } from './dernierdiplome.component';

describe('DernierdiplomeComponent', () => {
  let component: DernierdiplomeComponent;
  let fixture: ComponentFixture<DernierdiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DernierdiplomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DernierdiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
