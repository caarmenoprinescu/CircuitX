import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────
export type Role = "pilot" | "organizer";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Car {
  id: number;
  ownerId: number;
  make: string;
  model: string;
  year: number;
  horsepower: number;
  torque: number;
  weight: number;
  zeroToHundred: number;
  driveType: "FWD" | "RWD" | "AWD";
  tireType: "Street" | "Sport" | "Semi-Slick" | "Slick";
  aeroMods: boolean;
}

export interface Event {
  id: number;
  organizerId: number;
  title: string;
  circuit: string;
  country: string;
  date: string;
  maxParticipants: number;
  price: number;
  groupLevel: "Novice" | "Intermediate" | "Pro" | "Mixed";
  description: string;
  status: "Draft" | "Published" | "Completed";
}

export interface Registration {
  id: number;
  pilotId: number;
  eventId: number;
  carId: number;
  status: "Approved" | "Waitlist";
  registeredAt: string;
}

// ─── Mock Data ───────────────────────────────────────────

const initialEvents: Event[] = [
  { id: 1, organizerId: 2, title: "Nurburgring Nordschleife Experience", circuit: "Nürburgring Nordschleife", country: "Germany", date: "2026-06-12", maxParticipants: 20, price: 850, groupLevel: "Pro", description: "Experience the legendary Green Hell with professional instruction and open track sessions.", status: "Published" },
  { id: 2, organizerId: 2, title: "Monza Track Day", circuit: "Autodromo Nazionale di Monza", country: "Italy", date: "2026-04-15", maxParticipants: 20, price: 250, groupLevel: "Intermediate", description: "A full day on the legendary Monza circuit.", status: "Published" },
  { id: 3, organizerId: 2, title: "Silverstone Experience", circuit: "Silverstone Circuit", country: "UK", date: "2026-04-22", maxParticipants: 25, price: 320, groupLevel: "Pro", description: "Drive the home of British motorsport.", status: "Published" },
  { id: 4, organizerId: 2, title: "Spa Track Day", circuit: "Circuit de Spa-Francorchamps", country: "Belgium", date: "2026-05-05", maxParticipants: 20, price: 400, groupLevel: "Mixed", description: "One of the most iconic circuits in the world.", status: "Published" },
  { id: 5, organizerId: 2, title: "Imola Classic", circuit: "Autodromo Enzo e Dino Ferrari", country: "Italy", date: "2026-05-18", maxParticipants: 15, price: 280, groupLevel: "Novice", description: "Perfect for beginners at a legendary circuit.", status: "Draft" },
  { id: 6, organizerId: 2, title: "Brands Hatch Sprint", circuit: "Brands Hatch Circuit", country: "UK", date: "2026-05-25", maxParticipants: 18, price: 240, groupLevel: "Intermediate", description: "The iconic Kent circuit awaits.", status: "Published" },
  { id: 7, organizerId: 2, title: "Barcelona Open Day", circuit: "Circuit de Barcelona-Catalunya", country: "Spain", date: "2026-06-08", maxParticipants: 22, price: 320, groupLevel: "Mixed", description: "Open day at the Formula 1 circuit.", status: "Completed" },
];
const initialUsers: User[] = [
  { id: 1, name: "Alex Popescu", email: "pilot@test.com", password: "test123", role: "pilot" },
  { id: 2, name: "Maria Ionescu", email: "org@test.com", password: "test123", role: "organizer" },
  { id: 3, name: "Luca Rossi", email: "luca@test.com", password: "test123", role: "pilot" },
  { id: 4, name: "Sophie Laurent", email: "sophie@test.com", password: "test123", role: "pilot" },
  { id: 5, name: "Hans Müller", email: "hans@test.com", password: "test123", role: "pilot" },
  { id: 6, name: "James Cooper", email: "james@test.com", password: "test123", role: "pilot" },
  { id: 7, name: "Elena Vasile", email: "elena@test.com", password: "test123", role: "pilot" },
  { id: 8, name: "Marco Ferrari", email: "marco@test.com", password: "test123", role: "pilot" },
  { id: 9, name: "Anna Schmidt", email: "anna@test.com", password: "test123", role: "pilot" },
  { id: 10, name: "Tom Bradley", email: "tom@test.com", password: "test123", role: "pilot" },
];

const initialCars: Car[] = [
  { id: 1, ownerId: 1, make: "Porsche", model: "911 GT3", year: 2022, horsepower: 502, torque: 470, weight: 1435, zeroToHundred: 3.4, driveType: "RWD", tireType: "Semi-Slick", aeroMods: true },
  { id: 2, ownerId: 1, make: "BMW", model: "M4 Competition", year: 2023, horsepower: 510, torque: 650, weight: 1730, zeroToHundred: 3.9, driveType: "AWD", tireType: "Sport", aeroMods: false },
  { id: 3, ownerId: 1, make: "Mazda", model: "MX-5 Miata", year: 2021, horsepower: 184, torque: 205, weight: 1015, zeroToHundred: 6.5, driveType: "RWD", tireType: "Street", aeroMods: false },
  { id: 4, ownerId: 3, make: "Ferrari", model: "488 GTB", year: 2020, horsepower: 660, torque: 760, weight: 1475, zeroToHundred: 3.0, driveType: "RWD", tireType: "Semi-Slick", aeroMods: true },
  { id: 5, ownerId: 4, make: "Renault", model: "Mégane RS Trophy", year: 2022, horsepower: 300, torque: 420, weight: 1450, zeroToHundred: 5.4, driveType: "FWD", tireType: "Sport", aeroMods: false },
  { id: 6, ownerId: 5, make: "Audi", model: "R8 V10 Plus", year: 2021, horsepower: 610, torque: 560, weight: 1555, zeroToHundred: 3.2, driveType: "AWD", tireType: "Slick", aeroMods: true },
  { id: 7, ownerId: 6, make: "Toyota", model: "GR86", year: 2023, horsepower: 234, torque: 250, weight: 1270, zeroToHundred: 6.3, driveType: "RWD", tireType: "Street", aeroMods: false },
  { id: 8, ownerId: 7, make: "Honda", model: "Civic Type R", year: 2023, horsepower: 329, torque: 420, weight: 1430, zeroToHundred: 5.4, driveType: "FWD", tireType: "Sport", aeroMods: false },
  { id: 9, ownerId: 8, make: "Lamborghini", model: "Huracán EVO", year: 2021, horsepower: 640, torque: 600, weight: 1422, zeroToHundred: 2.9, driveType: "AWD", tireType: "Semi-Slick", aeroMods: true },
  { id: 10, ownerId: 9, make: "Volkswagen", model: "Golf GTI Clubsport", year: 2022, horsepower: 300, torque: 400, weight: 1390, zeroToHundred: 5.6, driveType: "FWD", tireType: "Sport", aeroMods: false },
  { id: 11, ownerId: 10, make: "Mercedes", model: "AMG GT Black Series", year: 2022, horsepower: 730, torque: 800, weight: 1625, zeroToHundred: 3.2, driveType: "RWD", tireType: "Slick", aeroMods: true },
];

const initialRegistrations: Registration[] = [
  { id: 1, pilotId: 1, eventId: 1, carId: 1, status: "Approved", registeredAt: "2026-03-01" },
  // Monza Track Day (event 2) — rich participant set for statistics
  { id: 2, pilotId: 1, eventId: 2, carId: 2, status: "Approved", registeredAt: "2026-03-05" },
  { id: 3, pilotId: 3, eventId: 2, carId: 4, status: "Approved", registeredAt: "2026-03-06" },
  { id: 4, pilotId: 4, eventId: 2, carId: 5, status: "Approved", registeredAt: "2026-03-06" },
  { id: 5, pilotId: 5, eventId: 2, carId: 6, status: "Approved", registeredAt: "2026-03-08" },
  { id: 6, pilotId: 6, eventId: 2, carId: 7, status: "Approved", registeredAt: "2026-03-10" },
  { id: 7, pilotId: 7, eventId: 2, carId: 8, status: "Approved", registeredAt: "2026-03-10" },
  { id: 8, pilotId: 8, eventId: 2, carId: 9, status: "Approved", registeredAt: "2026-03-12" },
  { id: 9, pilotId: 9, eventId: 2, carId: 10, status: "Approved", registeredAt: "2026-03-14" },
  { id: 10, pilotId: 10, eventId: 2, carId: 11, status: "Waitlist", registeredAt: "2026-03-15" },
  // Silverstone (event 3)
  { id: 11, pilotId: 3, eventId: 3, carId: 4, status: "Approved", registeredAt: "2026-03-07" },
  { id: 12, pilotId: 5, eventId: 3, carId: 6, status: "Approved", registeredAt: "2026-03-09" },
  // Spa (event 4)
  { id: 13, pilotId: 8, eventId: 4, carId: 9, status: "Approved", registeredAt: "2026-03-10" },
];

// ─── Context ─────────────────────────────────────────────
interface AppContextType {
  currentUser: User | null;
  users: User[];
  cars: Car[];
  events: Event[];
  registrations: Registration[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, role: Role) => boolean;
  addCar: (car: Omit<Car, "id" | "ownerId">) => void;
  updateCar: (id: number, car: Omit<Car, "id" | "ownerId">) => void;
  deleteCar: (id: number) => void;
  addEvent: (event: Omit<Event, "id" | "organizerId">) => void;
  updateEvent: (id: number, event: Omit<Event, "id" | "organizerId">) => void;
  deleteEvent: (id: number) => void;
  registerForEvent: (eventId: number, carId: number) => boolean;
  cancelRegistration: (eventId: number) => void;
  getGroupLevel: (hp: number, tireType: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);

  function login(email: string, password: string): boolean {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }

  function logout() { setCurrentUser(null); }

  function register(name: string, email: string, password: string, role: Role): boolean {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: users.length + 1, name, email, password, role };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  }

  function addCar(car: Omit<Car, "id" | "ownerId">) {
    if (!currentUser) return;
    setCars(prev => [...prev, { ...car, id: Date.now(), ownerId: currentUser.id }]);
  }

  function updateCar(id: number, car: Omit<Car, "id" | "ownerId">) {
    setCars(prev => prev.map(c => c.id === id ? { ...c, ...car } : c));
  }

  function deleteCar(id: number) {
    setCars(prev => prev.filter(c => c.id !== id));
  }

  function addEvent(event: Omit<Event, "id" | "organizerId">) {
    if (!currentUser) return;
    setEvents(prev => [...prev, { ...event, id: Date.now(), organizerId: currentUser.id }]);
  }

  function updateEvent(id: number, event: Omit<Event, "id" | "organizerId">) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  }

  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  function registerForEvent(eventId: number, carId: number): boolean {
    if (!currentUser) return false;
    if (registrations.find(r => r.eventId === eventId && r.pilotId === currentUser.id)) return false;
    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    const count = registrations.filter(r => r.eventId === eventId).length;
    const status: Registration["status"] = count >= event.maxParticipants ? "Waitlist" : "Approved";
    setRegistrations(prev => [...prev, {
      id: Date.now(), pilotId: currentUser.id, eventId, carId, status,
      registeredAt: new Date().toISOString().split("T")[0]
    }]);
    return true;
  }

  function cancelRegistration(eventId: number) {
    if (!currentUser) return;
    setRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.pilotId === currentUser.id)));
  }

  function getGroupLevel(hp: number, tireType: string): string {
    if (tireType === "Semi-Slick" || tireType === "Slick") return hp > 300 ? "Pro" : "Intermediate";
    if (hp <= 250) return "Novice";
    if (hp <= 400) return "Intermediate";
    return "Pro";
  }

  return (
    <AppContext.Provider value={{
      currentUser, users, cars, events, registrations,
      login, logout, register,
      addCar, updateCar, deleteCar,
      addEvent, updateEvent, deleteEvent,
      registerForEvent, cancelRegistration,
      getGroupLevel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}