import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { EventForm } from '../app/pages/EventForm';

function renderForm() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('EventForm validation', () => {
  it('renders the form heading', () => {
    renderForm();
    expect(screen.getByText('Host a Track Day')).toBeInTheDocument();
  });

  it('shows validation errors when published with empty fields', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(screen.getByText('Event name is required.')).toBeInTheDocument();
    expect(screen.getByText('Circuit name is required.')).toBeInTheDocument();
    expect(screen.getByText('Description is required.')).toBeInTheDocument();
  });

  it('allows saving a draft with only the title filled', () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText(/e.g., Monza/i), {
      target: { value: 'My Draft Event' },
    });
    // Save draft should not complain about other fields
    fireEvent.click(screen.getByRole('button', { name: /save draft/i }));
    // No title error shown
    expect(screen.queryByText('Event name is required.')).not.toBeInTheDocument();
  });

  it('shows maxParticipants error when zero', () => {
    renderForm();
    // Fill title and circuit to get past those checks
    fireEvent.change(screen.getByPlaceholderText(/e.g., Monza/i), { target: { value: 'Test' } });
    // Leave maxParticipants empty and publish
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(screen.getByText('Must be greater than 0.')).toBeInTheDocument();
  });
});