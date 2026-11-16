import type { Ride } from "./types";

// Stable, fictional UI fixtures. Nothing here represents a live ride or account.
export const sampleRides: Ride[] = [
  {
    id: "ride-1",
    driver: "Alex Johnson",
    initials: "AJ",
    rating: "4.9",
    trips: 120,
    from: "Downtown Station",
    to: "Green Valley Office Park",
    time: "08:00 AM · Today",
    price: "12.50",
    seats: "2 / 3",
    co2: "5.2 kg CO₂ saved",
  },
  {
    id: "ride-2",
    driver: "David Miller",
    initials: "DM",
    rating: "4.7",
    trips: 85,
    from: "West End Mall",
    to: "Innovation Hub",
    time: "08:45 AM · Today",
    price: "10.00",
    seats: "1 / 4",
    co2: "4.8 kg CO₂ saved",
  },
  {
    id: "ride-3",
    driver: "Sarah Chen",
    initials: "SC",
    rating: "5.0",
    trips: 42,
    from: "Eco Library",
    to: "Central Square",
    time: "09:15 AM · Today",
    price: "15.20",
    seats: "3 / 4",
    co2: "6.1 kg CO₂ saved",
  },
];

export const sampleBookings = [
  {
    driver: "Alex M.",
    rating: "4.9",
    seats: "2/3",
    status: "Pending",
    from: "Downtown Transit Center",
    to: "Tech Park North",
    time: "08:00 AM · Today",
    co2: "2.5 kg CO₂ saved",
  },
  {
    driver: "Sam K.",
    rating: "4.8",
    seats: "1/4",
    status: "Booked",
    from: "Central Station",
    to: "City Library",
    time: "10:30 AM · Today",
    co2: "1.8 kg CO₂ saved",
  },
];

export const sampleTransactions = [
  { title: "Ride with Sam K.", date: "Today · 10:30 AM", amount: "− 8.50 JOD" },
  { title: "Wallet top-up", date: "Yesterday · 04:15 PM", amount: "+ 20.00 JOD" },
  { title: "Ride with Alex M.", date: "Nov 12 · 08:00 AM", amount: "− 6.00 JOD" },
];
