import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadReservationComponent } from './upload-reservation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('UploadReservationComponent', () => {
  let component: UploadReservationComponent;
  let fixture: ComponentFixture<UploadReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadReservationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(UploadReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
