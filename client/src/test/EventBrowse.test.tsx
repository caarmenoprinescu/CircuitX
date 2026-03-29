import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { EventsBrowse } from '../app/pages/EventsBrowse';

function renderBrowse() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <EventsBrowse />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('EventsBrowse page', () => {
  it('renders the page heading', () => {
    renderBrowse();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('shows only Published events (not Draft or Completed)', () => {
    renderBrowse();
    // "Imola Classic" is Draft — must not appear
    expect(screen.queryByText('Imola Classic')).not.toBeInTheDocument();
    // "Barcelona Open Day" is Completed — must not appear
    expect(screen.queryByText('Barcelona Open Day')).not.toBeInTheDocument();
  });

  it('filters events by search term', () => {
    renderBrowse();
    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'Monza' } });
    expect(screen.getByText('Monza Track Day')).toBeInTheDocument();
    expect(screen.queryByText('Silverstone Experience')).not.toBeInTheDocument();
  });

  it('shows "No events found." when search matches nothing', () => {
    renderBrowse();
    fireEvent.change(screen.getByPlaceholderText('Search events...'), {
      target: { value: 'xyznonexistent' },
    });
    expect(screen.getByText('No events found.')).toBeInTheDocument();
  });

  it('filters by group level', () => {
    renderBrowse();
    const levelSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(levelSelect, { target: { value: 'Pro' } });
    // Nürburgring is Pro, should appear
    expect(screen.getByText(/Nurburgring/i)).toBeInTheDocument();
    // Monza is Intermediate, should not appear
    expect(screen.queryByText('Monza Track Day')).not.toBeInTheDocument();
  });

  it('renders a search input', () => {
    renderBrowse();
    expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
  });
});