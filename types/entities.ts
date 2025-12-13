export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Trend = "up" | "down" | "same";

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
    status: boolean;
    time: string;
    users: User;
    services: Services;
}