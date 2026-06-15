// ─── Reservation Models ───────────────────────────────────────────────────────

export interface ReservationRequestDTO {
  reservationDoneByEmployeeId: number;
  travelRequestId: number;
  reservationTypeId: number;
  reservationDoneWithEntity: string;
  reservationDate: number;    // epoch milliseconds
  amount: number;
  confirmationId: string;
  remarks?: string;
}

export interface ReservationTypeResponseDTO {
  id: number;
  typeName: string;
}

export interface ReservationResponseDTO {
  id: number;
  reservationDoneByEmployeeId: number;
  travelRequestId: number;
  reservationTypeName: string;
  createdOn: number;
  reservationDoneWithEntity: string;
  reservationDate: number;
  amount: number;
  confirmationId: string;
  remarks: string | null;
}

export interface ErrorDTO {
  message: string;
  fieldName: string | null;
  status: string;
}
