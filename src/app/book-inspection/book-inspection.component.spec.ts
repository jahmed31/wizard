import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookInspectionComponent } from './book-inspection.component';

describe('BookInspectionComponent', () => {
  let component: BookInspectionComponent;
  let fixture: ComponentFixture<BookInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
