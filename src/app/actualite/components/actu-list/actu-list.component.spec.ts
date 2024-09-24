import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuListComponent } from './actu-list.component';

describe('ActuListComponent', () => {
  let component: ActuListComponent;
  let fixture: ComponentFixture<ActuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActuListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
