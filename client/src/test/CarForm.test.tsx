import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { CarForm } from '../app/pages/CarForm';

function renderCarForm() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <CarForm />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('CarForm validation', () => {
  it('renders the add car heading', () => {
    renderCarForm();
    expect(screen.getByText('Add Car')).toBeInTheDocument();
  });

  it('shows required errors when submitted empty', () => {
    renderCarForm();
    fireEvent.click(screen.getByRole('button', { name: /save car/i }));
    const errors = screen.getAllByText('Required');
    expect(errors.length).toBeGreaterThanOrEqual(2); // make and model at minimum
  });

  it('shows year range error for out-of-range year', () => {
    renderCarForm();
    fireEvent.change(screen.getByPlaceholderText(/e.g., BMW/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g., M3/i), { target: { value: 'GR86' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g., 2022/i), { target: { value: '1800' } });
    fireEvent.click(screen.getByRole('button', { name: /save car/i }));
    expect(screen.getByText('Enter valid year (1990-2026)')).toBeInTheDocument();
  });

  it('shows HP error when horsepower is zero', () => {
    renderCarForm();
    fireEvent.change(screen.getByPlaceholderText(/e.g., BMW/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g., M3/i), { target: { value: 'GR86' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g., 2022/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g., 300/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /save car/i }));
    expect(screen.getByText('Must be > 0')).toBeInTheDocument();
  });
});