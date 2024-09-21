import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCampusComponent } from './list-campus.component';

describe('ListCampusComponent', () => {
  let component: ListCampusComponent;
  let fixture: ComponentFixture<ListCampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCampusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
