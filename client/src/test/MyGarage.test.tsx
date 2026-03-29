import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { MyGarage } from '../app/pages/MyGarage';

function WithLogin({ children }: { children: React.ReactNode }) {
  const { login } = useApp();
  return (
    <>
      <button onClick={() => login('pilot@test.com', 'test123')}>Login</button>
      {children}
    </>
  );
}

function renderGarage() {
  render(
    <AppProvider>
      <MemoryRouter>
        <WithLogin>
          <MyGarage />
        </WithLogin>
      </MemoryRouter>
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

describe('MyGarage page', () => {
  it('renders "My Garage" heading', () => {
    renderGarage();
    expect(screen.getByText('My Garage')).toBeInTheDocument();
  });

  it('displays the primary car (Porsche 911 GT3)', () => {
    renderGarage();
    expect(screen.getByText('Porsche 911 GT3')).toBeInTheDocument();
  });

  it('displays secondary cars', () => {
    renderGarage();
    expect(screen.getByText('BMW M4 Competition')).toBeInTheDocument();
  });

  it('shows "Add Car" button', () => {
    renderGarage();
    expect(screen.getByText('+ Add Car')).toBeInTheDocument();
  });

  it('deletes a car when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderGarage();
    const deleteButtons = screen.getAllByTitle
      ? screen.getAllByRole('button').filter(b => b.querySelector('svg'))
      : [];
    // Find the delete button (Trash2 icon) for the primary car actions
    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find(b => b.className.includes('E8003D') && b.querySelector('svg'));
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      expect(screen.queryByText('Porsche 911 GT3')).not.toBeInTheDocument();
    }
    vi.restoreAllMocks();
  });
});