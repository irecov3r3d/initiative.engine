import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock lucide-react icons to avoid rendering issues in the test environment
jest.mock('lucide-react', () => ({
  Flame: () => <div data-testid="flame-icon" />,
  Wind: () => <div data-testid="wind-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  CheckCircle2: () => <div data-testid="check-circle-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
}));

describe('App component', () => {
  test('renders Initiative Engine header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Initiative Engine/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders user selection buttons', () => {
    render(<App />);
    expect(screen.getByLabelText(/Start session for Cade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start session for Morgan/i)).toBeInTheDocument();
  });

  test('renders admin settings button', () => {
    render(<App />);
    expect(screen.getByLabelText(/Admin Settings/i)).toBeInTheDocument();
  });
});
