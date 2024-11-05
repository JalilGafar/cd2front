import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDomaineItemComponent } from './info-domaine-item.component';

describe('InfoDomaineItemComponent', () => {
  let component: InfoDomaineItemComponent;
  let fixture: ComponentFixture<InfoDomaineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoDomaineItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoDomaineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
