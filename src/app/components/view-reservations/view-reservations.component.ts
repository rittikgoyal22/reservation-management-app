import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { TravelPlannerService, TravelRequestOption } from '../../services/travel-planner.service';
import { ReservationResponseDTO } from '../../models/reservation.model';

declare const Chart: any;

@Component({
  selector: 'app-view-reservations',
  templateUrl: './view-reservations.component.html',
  styleUrls: ['./view-reservations.component.css']
})
export class ViewReservationsComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  travelRequests: TravelRequestOption[] = [];
  reservations: ReservationResponseDTO[] = [];
  selectedTrid: number | null = null;

  private charts: any[] = [];

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
        setTimeout(() => this.renderCharts(), 0);
      },
      error: () => {
        // travel-planner returns 404 when no reservations exist for the travel request.
        this.reservations = [];
        this.noResultsMessage = `No reservation found for this travel request id #${trid}.`;
        this.searched = true;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 0);
      }
    });
  }

  renderCharts(): void {
    if (typeof Chart === 'undefined') { return; }            // CDN not loaded yet -> skip gracefully
    this.charts.forEach(c => c.destroy()); this.charts = []; // avoid duplicate/leaked charts

    if (this.reservations.length === 0) { return; }

    // Group reservations by reservationTypeName and SUM amount per type.
    const spendByType = new Map<string, number>();
    for (const r of this.reservations) {
      const key = r.reservationTypeName ?? 'Unknown';
      spendByType.set(key, (spendByType.get(key) ?? 0) + (r.amount ?? 0));
    }

    const palette = ['#6366f1', '#8b5cf6', '#06b6d4', '#14b8a6', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
    const labels = Array.from(spendByType.keys());
    const values = Array.from(spendByType.values());

    const el = document.getElementById('spendByTypeChart') as HTMLCanvasElement | null;
    if (el) {
      this.charts.push(new Chart(el, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length])
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Spend by Reservation Type' }
          }
        }
      }));
    }
  }

  formatDate(epoch: number): string {
    return epoch ? new Date(epoch).toLocaleDateString('en-IN') : 'N/A';
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }
}
