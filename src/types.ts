export type ScreenId =
  | "login"
  | "signup"
  | "otp"
  | "forgot"
  | "home"
  | "rides"
  | "rideDetail"
  | "booking"
  | "map"
  | "wallet"
  | "alerts"
  | "settings"
  | "profile"
  | "security"
  | "support"
  | "history"
  | "driverApply"
  | "driverHome"
  | "offerRide"
  | "requests"
  | "chat";

export type Ride = {
  id: string;
  driver: string;
  initials: string;
  rating: string;
  trips: number;
  from: string;
  to: string;
  time: string;
  price: string;
  seats: string;
  co2: string;
};
