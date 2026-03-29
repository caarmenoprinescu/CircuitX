import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { EventDetail } from '../app/pages/EventDetail';

function TestLogin({ email }: { email: string }) {
  const { login } = useApp();
  return <button onClick={() => login(email, 'test123')}>Login</button>;
}

function renderEventDetail(eventId: string | number = '2') {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[`/events/${eventId}`]}>
        <TestLogin email="pilot@test.com" />
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>
  );
}

describe('EventDetail page', () => {
  it('renders event title', () => {
    renderEventDetail(2);
    expect(screen.getByText('Monza Track Day')).toBeInTheDocument();
  });

  it('renders event description', () => {
    renderEventDetail(2);
    expect(screen.getByText(/A full day on the legendary Monza circuit/i)).toBeInTheDocument();
  });

  it('shows "Event not found." for invalid id', () => {
    renderEventDetail(99999);
    expect(screen.getByText('Event not found.')).toBeInTheDocument();
  });

  it('shows participants count', () => {
    renderEventDetail(2);
    // Monza has 9 registrations in mock data
    expect(screen.getByText(/Registered Participants/i)).toBeInTheDocument();
  });

  it('shows "Please select a car." when registering without selecting one', () => {
    const { getByText } = render(
      <AppProvider>
        <MemoryRouter initialEntries={['/events/4']}>
          <TestLogin email="pilot@test.com" />
          <Routes>
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );
    // Log in first
    fireEvent.click(getByText('Login'));
    fireEvent.click(getByText(/Register for Event|Join Waitlist/i));
    expect(getByText('Please select a car.')).toBeInTheDocument();
  });

  it('shows "Cancel Registration" when already registered', () => {
    const { getByText } = render(
      <AppProvider>
        <MemoryRouter initialEntries={['/events/1']}>
          <TestLogin email="pilot@test.com" />
          <Routes>
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );
    fireEvent.click(getByText('Login'));
    expect(getByText('Cancel Registration')).toBeInTheDocument();
  });
});