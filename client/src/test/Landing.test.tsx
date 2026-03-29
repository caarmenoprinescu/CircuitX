import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { Landing } from '../app/pages/Landing';

function renderLanding() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('Landing page — presentation view', () => {
  it('renders the app name CircuitX', () => {
    renderLanding();
    expect(screen.getByText('Circuit')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderLanding();
    expect(screen.getByText('Your Track Day, Engineered.')).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    renderLanding();
    expect(screen.getByText(/all-in-one platform for motorsport enthusiasts/i)).toBeInTheDocument();
  });

  it('renders feature highlight cards', () => {
    renderLanding();
    expect(screen.getByText('Discover Events')).toBeInTheDocument();
    expect(screen.getByText('Tech Advantage')).toBeInTheDocument();
    expect(screen.getByText('For Organizers')).toBeInTheDocument();
    expect(screen.getByText('Event Analytics')).toBeInTheDocument();
  });

  it('renders Browse Events and Host an Event CTAs', () => {
    renderLanding();
    expect(screen.getByRole('link', { name: /browse events/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /host an event/i })).toBeInTheDocument();
  });

  it('renders upcoming event preview cards', () => {
    renderLanding();
    expect(screen.getByText('Monza Track Day')).toBeInTheDocument();
    expect(screen.getByText('Silverstone Experience')).toBeInTheDocument();
    expect(screen.getByText('Spa-Francorchamps')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderLanding();
    expect(screen.getByText(/© 2026 CircuitX/i)).toBeInTheDocument();
  });
});