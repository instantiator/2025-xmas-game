import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../src/Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home', () => {
  it('renders the main heading', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const heading = screen.getByText(/Footsteps/i);
    expect(heading).toBeInTheDocument();
  });
});
