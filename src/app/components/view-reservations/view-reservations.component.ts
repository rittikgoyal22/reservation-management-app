import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { TravelPlannerService, TravelRequestOption } from '../../services/travel-planner.service';
import { ReservationResponseDTO } from '../../models/reservation.model';

@Component({
  selector: 'app-view-reservations',
  templateUrl: './view-reservations.component.html',
  styleUrls: ['./view-reservations.component.css']
})
export class ViewReservationsComponent implements OnInit {
  searchForm!: FormGroup;
  travelRequests: TravelRequestOption[] = [];
  reservations: ReservationResponseDTO[] = [];
  selectedTrid: number | null = null;

  trLoading = true;
  trError = '';
  loading = false;
  searched = false;
  noResultsMessage = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private travelPlannerService: TravelPlannerService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      travelRequestId: [null, [Validators.required, Validators.min(1)]]
    });

    // Load the approved travel requests that populate the dropdown.
    this.travelPlannerService.getApprovedTravelRequests().subscribe({
      next: data => { this.travelRequests = data; this.trLoading = false; },
      error: () => { this.trError = 'Could not load approved travel requests.'; this.trLoading = false; }
    });
  }

  get f() { return this.searchForm.controls; }

  onSearch(): void {
    if (this.searchForm.invalid) { this.searchForm.markAllAsTouched(); return; }
    const trid = Number(this.searchForm.value.travelRequestId);
    this.selectedTrid = trid;
    this.loading = true;
    this.searched = false;
    this.noResultsMessage = '';
    this.reservations = [];

    this.reservationService.trackByTravelRequest(trid, true).subscribe({
      next: data => {
        this.reservations = data ?? [];
        if (this.reservations.length === 0) {
          this.noResultsMessage = `No reservation found for this travel request id #${trid}.`;
        }
        this.searched = true;
        this.loading = false;
      },
      error: () => {
        // travel-planner returns 404 when no reservations exist for the travel request.
        this.reservations = [];
        this.noResultsMessage = `No reservation found for this travel request id #${trid}.`;
        this.searched = true;
        this.loading = false;
      }
    });
  }

  formatDate(epoch: number): string {
    return epoch ? new Date(epoch).toLocaleDateString('en-IN') : 'N/A';
  }
}
