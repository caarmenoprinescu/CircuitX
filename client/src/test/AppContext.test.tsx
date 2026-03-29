import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

// Helper: renders a component that uses useApp and exposes ctx via a ref
function TestConsumer({ fn }: { fn: (ctx: ReturnType<typeof useApp>) => void }) {
  const ctx = useApp();
  fn(ctx);
  return null;
}

function renderWithProvider(fn: (ctx: ReturnType<typeof useApp>) => void) {
  let ctx!: ReturnType<typeof useApp>;
  render(
    <AppProvider>
      <TestConsumer fn={(c) => { ctx = c; fn(c); }} />
    </AppProvider>
  );
  return () => ctx;
}

// ─── login / logout / register ───────────────────────────

describe('login', () => {
  it('returns true and sets currentUser for valid pilot credentials', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestConsumer fn={(c) => { appCtx = c; }} />
      </AppProvider>
    );
    let result!: boolean;
    act(() => { result = appCtx.login('pilot@test.com', 'test123'); });
    expect(result).toBe(true);
    expect(appCtx.currentUser?.email).toBe('pilot@test.com');
    expect(appCtx.currentUser?.role).toBe('pilot');
  });

  it('returns true for valid organizer credentials', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.login('org@test.com', 'test123'); });
    expect(result).toBe(true);
    expect(appCtx.currentUser?.role).toBe('organizer');
  });

  it('returns false for wrong password', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.login('pilot@test.com', 'wrongpassword'); });
    expect(result).toBe(false);
    expect(appCtx.currentUser).toBeNull();
  });

  it('returns false for unknown email', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.login('nobody@test.com', 'test123'); });
    expect(result).toBe(false);
  });
});

describe('logout', () => {
  it('clears currentUser after logout', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    expect(appCtx.currentUser).not.toBeNull();
    act(() => { appCtx.logout(); });
    expect(appCtx.currentUser).toBeNull();
  });
});

describe('register', () => {
  it('registers a new pilot and logs them in', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.register('New User', 'new@test.com', 'pass123', 'pilot'); });
    expect(result).toBe(true);
    expect(appCtx.currentUser?.email).toBe('new@test.com');
    expect(appCtx.currentUser?.role).toBe('pilot');
  });

  it('registers a new organizer', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.register('Org User', 'orgNew@test.com', 'pass123', 'organizer'); });
    expect(result).toBe(true);
    expect(appCtx.currentUser?.role).toBe('organizer');
  });

  it('returns false when email already exists', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.register('Duplicate', 'pilot@test.com', 'pass123', 'pilot'); });
    expect(result).toBe(false);
  });

  it('adds the new user to the users list', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const countBefore = appCtx.users.length;
    act(() => { appCtx.register('Another', 'another@test.com', 'pass123', 'pilot'); });
    expect(appCtx.users.length).toBe(countBefore + 1);
  });
});

// ─── car CRUD ────────────────────────────────────────────

const newCarPayload = {
  make: 'Honda', model: 'Civic Type R', year: 2023,
  horsepower: 329, torque: 420, weight: 1400,
  zeroToHundred: 5.4, driveType: 'FWD' as const,
  tireType: 'Sport' as const, aeroMods: false,
};

describe('addCar', () => {
  it('adds a car for the logged-in pilot', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    const countBefore = appCtx.cars.length;
    act(() => { appCtx.addCar(newCarPayload); });
    expect(appCtx.cars.length).toBe(countBefore + 1);
    const added = appCtx.cars[appCtx.cars.length - 1];
    expect(added.make).toBe('Honda');
    expect(added.ownerId).toBe(appCtx.currentUser!.id);
  });

  it('does nothing when no user is logged in', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const countBefore = appCtx.cars.length;
    act(() => { appCtx.addCar(newCarPayload); });
    expect(appCtx.cars.length).toBe(countBefore);
  });
});

describe('updateCar', () => {
  it('updates an existing car by id', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    const carId = appCtx.cars.find(c => c.ownerId === 1)!.id;
    act(() => { appCtx.updateCar(carId, { ...newCarPayload, make: 'Toyota' }); });
    const updated = appCtx.cars.find(c => c.id === carId);
    expect(updated?.make).toBe('Toyota');
  });
});

describe('deleteCar', () => {
  it('removes a car by id', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    const carId = appCtx.cars[0].id;
    const countBefore = appCtx.cars.length;
    act(() => { appCtx.deleteCar(carId); });
    expect(appCtx.cars.length).toBe(countBefore - 1);
    expect(appCtx.cars.find(c => c.id === carId)).toBeUndefined();
  });
});

// ─── event CRUD ──────────────────────────────────────────

const newEventPayload = {
  title: 'Test Event', circuit: 'Test Circuit', country: 'Romania',
  date: '2026-07-01', maxParticipants: 10, price: 100,
  groupLevel: 'Novice' as const, description: 'Test desc',
  status: 'Published' as const,
};

describe('addEvent', () => {
  it('adds an event for the logged-in organizer', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('org@test.com', 'test123'); });
    const countBefore = appCtx.events.length;
    act(() => { appCtx.addEvent(newEventPayload); });
    expect(appCtx.events.length).toBe(countBefore + 1);
    const added = appCtx.events[appCtx.events.length - 1];
    expect(added.title).toBe('Test Event');
    expect(added.organizerId).toBe(appCtx.currentUser!.id);
  });

  it('does nothing when no user is logged in', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const countBefore = appCtx.events.length;
    act(() => { appCtx.addEvent(newEventPayload); });
    expect(appCtx.events.length).toBe(countBefore);
  });
});

describe('updateEvent', () => {
  it('updates an existing event', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const eventId = appCtx.events[0].id;
    act(() => { appCtx.updateEvent(eventId, { ...newEventPayload, title: 'Updated Title' }); });
    expect(appCtx.events.find(e => e.id === eventId)?.title).toBe('Updated Title');
  });
});

describe('deleteEvent', () => {
  it('removes an event by id', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const eventId = appCtx.events[0].id;
    const countBefore = appCtx.events.length;
    act(() => { appCtx.deleteEvent(eventId); });
    expect(appCtx.events.length).toBe(countBefore - 1);
    expect(appCtx.events.find(e => e.id === eventId)).toBeUndefined();
  });
});

// ─── registrations ───────────────────────────────────────

describe('registerForEvent', () => {
  it('registers a pilot and returns true', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    const eventId = appCtx.events.find(e => e.status === 'Published' &&
      !appCtx.registrations.some(r => r.eventId === e.id && r.pilotId === 1))!.id;
    const countBefore = appCtx.registrations.length;
    let result!: boolean;
    act(() => { result = appCtx.registerForEvent(eventId, appCtx.cars[0].id); });
    expect(result).toBe(true);
    expect(appCtx.registrations.length).toBe(countBefore + 1);
  });

  it('returns false when already registered', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    // pilot@test.com is already registered for event 1
    let result!: boolean;
    act(() => { result = appCtx.registerForEvent(1, 1); });
    expect(result).toBe(false);
  });

  it('returns false when not logged in', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    let result!: boolean;
    act(() => { result = appCtx.registerForEvent(1, 1); });
    expect(result).toBe(false);
  });

  it('returns false for non-existent event', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    let result!: boolean;
    act(() => { result = appCtx.registerForEvent(99999, 1); });
    expect(result).toBe(false);
  });

  it('assigns Waitlist status when event is full', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    // Use event 2 (Monza, maxParticipants: 20) — register enough to fill it
    // First fill slots, then check a new one goes to Waitlist
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    // Create a tiny event to fill easily
    act(() => { appCtx.login('org@test.com', 'test123'); });
    act(() => { appCtx.addEvent({ ...newEventPayload, maxParticipants: 1, status: 'Published' }); });
    const tinyEvent = appCtx.events[appCtx.events.length - 1];
    // Register user 1
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    act(() => { appCtx.registerForEvent(tinyEvent.id, 1); });
    // Register user 3 (luca) — should be Waitlist
    act(() => { appCtx.login('luca@test.com', 'test123'); });
    act(() => { appCtx.registerForEvent(tinyEvent.id, 4); });
    const regs = appCtx.registrations.filter(r => r.eventId === tinyEvent.id);
    const waitlisted = regs.find(r => r.pilotId === 3);
    expect(waitlisted?.status).toBe('Waitlist');
  });
});

describe('cancelRegistration', () => {
  it('removes a registration for the current user', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    act(() => { appCtx.login('pilot@test.com', 'test123'); });
    // pilot@test.com is registered for event 1
    const countBefore = appCtx.registrations.length;
    act(() => { appCtx.cancelRegistration(1); });
    expect(appCtx.registrations.length).toBe(countBefore - 1);
    expect(appCtx.registrations.find(r => r.eventId === 1 && r.pilotId === 1)).toBeUndefined();
  });

  it('does nothing when not logged in', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    const countBefore = appCtx.registrations.length;
    act(() => { appCtx.cancelRegistration(1); });
    expect(appCtx.registrations.length).toBe(countBefore);
  });
});

// ─── getGroupLevel ────────────────────────────────────────

describe('getGroupLevel', () => {
  it('returns Pro for Semi-Slick with HP > 300', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(400, 'Semi-Slick')).toBe('Pro');
  });

  it('returns Intermediate for Semi-Slick with HP <= 300', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(250, 'Semi-Slick')).toBe('Intermediate');
  });

  it('returns Pro for Slick with HP > 300', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(500, 'Slick')).toBe('Pro');
  });

  it('returns Intermediate for Slick with HP <= 300', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(200, 'Slick')).toBe('Intermediate');
  });

  it('returns Novice for Street tires with HP <= 250', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(200, 'Street')).toBe('Novice');
  });

  it('returns Intermediate for Street tires with HP 251-400', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(300, 'Street')).toBe('Intermediate');
  });

  it('returns Pro for Street tires with HP > 400', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(500, 'Street')).toBe('Pro');
  });

  it('returns Novice for Sport tires with HP <= 250', () => {
    let appCtx!: ReturnType<typeof useApp>;
    render(<AppProvider><TestConsumer fn={(c) => { appCtx = c; }} /></AppProvider>);
    expect(appCtx.getGroupLevel(180, 'Sport')).toBe('Novice');
  });
});