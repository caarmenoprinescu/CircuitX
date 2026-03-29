import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { Login } from '../app/pages/Login';

function renderLogin() {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('Login page', () => {
  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('shows error when fields are empty and submitted', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('All fields are required.')).toBeInTheDocument();
  });

  it('shows error for invalid credentials', () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
  });

  it('shows test account hints', () => {
    renderLogin();
    expect(screen.getByText(/pilot@test\.com/)).toBeInTheDocument();
    expect(screen.getByText(/org@test\.com/)).toBeInTheDocument();
  });

  it('has a link to the register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register');
  });
});