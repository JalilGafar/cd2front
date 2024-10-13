import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifAvisComponent } from './modif-avis.component';

describe('ModifAvisComponent', () => {
  let component: ModifAvisComponent;
  let fixture: ComponentFixture<ModifAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifAvisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
