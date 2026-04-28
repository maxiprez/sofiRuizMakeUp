export type Trend = "up" | "down" | "same";
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type Customer = {
  id: string;
  name: string;
  tel: string;
  email?: string;
  is_verified?: boolean;
  role?: string;
};

type User = {
  id: string;
  name: string;
  tel: string;
};

type Services = {
    id: string;
    name: string;
};

export type DailyBookingData = {
  today: number,
  yesterday: number,
  difference: number,
  trend: Trend,
};

export type RevenueData = {
  currentTotal: string;
  previousTotal: string;
  percentageChange: number;
  trend: Trend;
};

export type CancelledBookingsData = {
  today: number,
  yesterday: number,
  difference: number,
  trend: Trend,
};

export type Booking = {
    created_at: string;
    date: string;
    google_event_id: string;
    id: string;
    service_id: string;
    status_new: BookingStatus;
    time: string;
    users: User;
    services: Services;
}