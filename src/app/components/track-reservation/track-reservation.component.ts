import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { TravelPlannerService, TravelRequestOption } from '../../services/travel-planner.service';
import { ReservationResponseDTO } from '../../models/reservation.model';

@Component({
  selector: 'app-track-reservation',
  templateUrl: './track-reservation.component.html',
  styleUrls: ['./track-reservation.component.css']
})
export class TrackReservationComponent implements OnInit {
  searchForm!: FormGroup;
  reservations: ReservationResponseDTO[] = [];
  travelRequests: TravelRequestOption[] = [];
  trLoading = true;
  searched = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private travelPlannerService: TravelPlannerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      travelRequestId: [null, [Validators.required, Validators.min(1)]]
    });

    // Populate the dropdown with the logged-in employee's own APPROVED travel
    // requests — only approved trips can have reservations.
    this.travelPlannerService.getMyTravelRequests().subscribe({
      next: trs => {
        this.travelRequests = trs.filter(tr => tr.requestStatus === 'APPROVED');
        this.trLoading = false;
      },
      error: () => { this.trLoading = false; }
    });

    // If navigated with a route param, auto-search
    const paramId = this.route.snapshot.paramMap.get('travelRequestId');
    if (paramId) {
      this.searchForm.patchValue({ travelRequestId: Number(paramId) });
      this.doSearch(Number(paramId));
    }
  }

  get f() { return this.searchForm.controls; }

  onSearch(): void {
    if (this.searchForm.invalid) { this.searchForm.markAllAsTouched(); return; }
    this.doSearch(this.searchForm.value.travelRequestId);
  }

  private doSearch(trid: number): void {
    this.loading = true;
    this.error   = '';
    this.reservationService.trackByTravelRequest(trid).subscribe({
      next: data => {
        this.reservations = data;
        this.searched = true;
        this.loading  = false;
      },
      error: err => {
        this.error = err.error?.message || 'No reservations found.';
        this.reservations = [];
        this.searched = true;
        this.loading  = false;
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/reservations', id]);
  }

  formatDate(epoch: number): string {
    return epoch ? new Date(epoch).toLocaleDateString('en-IN') : 'N/A';
  }
}
