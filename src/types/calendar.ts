export type CalendarStatus = "Active" | "InActive" | "Processing";

export interface CalendarSession {
  id: number; // Match your backend (string or number)
  session_name: string;
  year: string;
  month: string;
  calendarStatus?: CalendarStatus;
}
