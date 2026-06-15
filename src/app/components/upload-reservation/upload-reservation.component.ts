import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { AccountManagementService } from '../../services/account-management.service';
import { ReservationTypeResponseDTO } from '../../models/reservation.model';
import { TravelPlannerService, TravelRequestOption } from '../../services/travel-planner.service';

@Component({
  selector: 'app-upload-reservation',
  templateUrl: './upload-reservation.component.html',
  styleUrls: ['./upload-reservation.component.css']
})
export class UploadReservationComponent implements OnInit {
  form!: FormGroup;
  types: ReservationTypeResponseDTO[] = [];
  travelRequests: TravelRequestOption[] = [];
  selectedFile: File | null = null;
  fileError = '';
  loading = false;
  dataLoading = true;
  error = '';
  success = '';
  currentEmployeeId = 0;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private accountService: AccountManagementService,
    private travelPlannerService: TravelPlannerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      travelRequestId:           [null, [Validators.required, Validators.min(1)]],
      reservationTypeId:         [null, Validators.required],
      reservationDoneWithEntity: ['', [Validators.required, Validators.minLength(2)]],
      reservationDate:           ['', Validators.required],
      amount:                    [null, [Validators.required, Validators.min(1)]],
      confirmationId:            ['', [Validators.required, Validators.minLength(2)]],
      remarks:                   ['']
    });

    this.reservationService.getTypes().subscribe({
      next: types => { this.types = types; },
      error: () => {}
    });

    this.travelPlannerService.getApprovedTravelRequests().subscribe({
      next: trs => { this.travelRequests = trs; },
      error: () => {}
    });

    this.accountService.getCurrentEmployee().subscribe({
      next: emp => { this.currentEmployeeId = emp.employeeId; this.dataLoading = false; },
      error: () => { this.dataLoading = false; }
    });
  }

  get f() { return this.form.controls; }

  getTypeIcon(typeName: string): string {
    const map: Record<string, string> = {
      Flight: 'bi-airplane-fill',
      Train:  'bi-train-front-fill',
      Bus:    'bi-bus-front-fill',
      Cab:    'bi-car-front-fill',
      Hotel:  'bi-building'
    };
    return map[typeName] ?? 'bi-ticket-fill';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError = '';
    if (!file) { this.selectedFile = null; return; }
    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed.';
      this.selectedFile = null;
      return;
    }
    if (file.size > 1_048_576) {
      this.fileError = 'PDF size should not exceed 1MB.';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.selectedFile) { this.fileError = 'Please attach a PDF file.'; return; }

    const raw = this.form.value;

    const dto = {
      travelRequestId:             raw.travelRequestId,
      reservationDoneByEmployeeId: this.currentEmployeeId,
      reservationTypeId:           Number(raw.reservationTypeId),
      reservationDoneWithEntity:   raw.reservationDoneWithEntity,
      reservationDate:             new Date(raw.reservationDate).getTime(),
      amount:                      raw.amount,
      confirmationId:              raw.confirmationId,
      remarks:                     raw.remarks || ''
    };

    const fd = new FormData();
    fd.append('reservationRequestDTO', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    fd.append('pdfFile', this.selectedFile, this.selectedFile.name);

    this.loading = true;
    this.error   = '';
    this.success = '';

    this.reservationService.addReservation(fd).subscribe({
      next: res => {
        this.loading = false;
        this.success = `Reservation #${res.id} added successfully!`;
        setTimeout(() => this.router.navigate(['/reservations', res.id]), 1500);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add reservation.';
      }
    });
  }
}
