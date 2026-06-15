import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackReservationComponent } from './track-reservation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('TrackReservationComponent', () => {
  let component: TrackReservationComponent;
  let fixture: ComponentFixture<TrackReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackReservationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(TrackReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
