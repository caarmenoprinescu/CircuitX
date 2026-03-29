import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { Register } from '../app/pages/Register';

function renderRegister() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('Register page — validation', () => {
  it('shows error when full name is missing', () => {
    renderRegister();
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
  });

  it('shows error for invalid email format', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('Enter a valid email.')).toBeInTheDocument();
  });

  it('shows error when password is too short', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@new.com' } });
    const [passInput] = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@new.com' } });
    const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('shows error when email is already taken', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'pilot@test.com' } });
    const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passInput, { target: { value: 'test123' } });
    fireEvent.change(confirmInput, { target: { value: 'test123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('An account with this email already exists.')).toBeInTheDocument();
  });

  it('renders Pilot and Organizer role selector buttons', () => {
    renderRegister();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Organizer')).toBeInTheDocument();
  });

  it('has a link to the login page', () => {
    renderRegister();
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
  });
});