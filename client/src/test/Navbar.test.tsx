import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { Navbar } from '../app/components/Navbar';

function WithLogin({ email, children }: { email?: string; children: React.ReactNode }) {
  const { login } = useApp();
  return (
    <>
      {email && <button onClick={() => login(email, 'test123')}>DoLogin</button>}
      {children}
    </>
  );
}

function renderNavbar(email?: string) {
  render(
    <AppProvider>
      <MemoryRouter>
        <WithLogin email={email}>
          <Navbar />
        </WithLogin>
      </MemoryRouter>
    </AppProvider>
  );
  if (email) fireEvent.click(screen.getByRole('button', { name: 'DoLogin' }));
}

describe('Navbar', () => {
  it('shows Login and Sign Up when not logged in', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows pilot links when logged in as pilot', () => {
    renderNavbar('pilot@test.com');
    expect(screen.getByText('Browse Events')).toBeInTheDocument();
    expect(screen.getByText('My Garage')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('shows organizer links when logged in as organizer', () => {
    renderNavbar('org@test.com');
    expect(screen.getByText('My Events')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.queryByText('My Garage')).not.toBeInTheDocument();
  });

  it('shows Logout button when logged in', () => {
    renderNavbar('pilot@test.com');
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});