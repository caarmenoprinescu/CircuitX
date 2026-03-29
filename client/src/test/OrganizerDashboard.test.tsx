import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { OrganizerDashboard } from '../app/pages/OrganizerDashboard';

function WithOrgLogin({ children }: { children: React.ReactNode }) {
  const { login } = useApp();
  return (
    <>
      <button onClick={() => login('org@test.com', 'test123')}>Login</button>
      {children}
    </>
  );
}

function renderDashboard() {
  render(
    <AppProvider>
      <MemoryRouter>
        <WithOrgLogin>
          <OrganizerDashboard />
        </WithOrgLogin>
      </MemoryRouter>
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

describe('OrganizerDashboard', () => {
  it('renders "My Events" heading', () => {
    renderDashboard();
    expect(screen.getByText('My Events')).toBeInTheDocument();
  });

  it('shows organizer stats cards', () => {
    renderDashboard();
    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('Total Registrations')).toBeInTheDocument();
    expect(screen.getByText('Active Events')).toBeInTheDocument();
  });

  it('renders event rows in the table', () => {
    renderDashboard();
    expect(screen.getByText('Monza Track Day')).toBeInTheDocument();
    expect(screen.getByText('Silverstone Experience')).toBeInTheDocument();
  });

  it('shows "Host Event" button', () => {
    renderDashboard();
    expect(screen.getByText('+ Host Event')).toBeInTheDocument();
  });

  it('renders pagination when more than 5 events exist', () => {
    renderDashboard();
    // 7 events total means 2 pages
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  it('navigates to page 2 when pagination button is clicked', () => {
    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    // Page 2 should show remaining events (Imola Classic, Brands Hatch, Barcelona Open Day)
    expect(screen.getByText('Barcelona Open Day')).toBeInTheDocument();
  });
});