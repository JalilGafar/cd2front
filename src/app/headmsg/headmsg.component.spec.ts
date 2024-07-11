import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadmsgComponent } from './headmsg.component';

describe('HeadmsgComponent', () => {
  let component: HeadmsgComponent;
  let fixture: ComponentFixture<HeadmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadmsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
