import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { ReservationResponseDTO } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: ReservationResponseDTO | null = null;
  loading = true;
  downloading = false;
  error = '';
  downloadError = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('reservationId'));
    this.reservationService.getById(id).subscribe({
      next: data => { this.reservation = data; this.loading = false; },
      error: err  => { this.error = err.error?.message || 'Reservation not found.'; this.loading = false; }
    });
  }

  downloadPdf(): void {
    if (!this.reservation) return;
    this.downloading = true;
    this.downloadError = '';
    this.reservationService.downloadDocument(this.reservation.id).subscribe({
      next: (blob: Blob) => {
        this.downloading = false;
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href    = url;
        a.download = `reservation-${this.reservation!.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: err => {
        this.downloading = false;
        this.downloadError = err.error?.message || 'Download failed.';
      }
    });
  }

  formatDate(epoch: number): string {
    return epoch ? new Date(epoch).toLocaleDateString('en-IN') : 'N/A';
  }
}
