import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the landing page', () => {
  render(<App />);

  expect(screen.getAllByText(/Every Day Better/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('link', { name: /Start Learning Free/i })).toBeInTheDocument();
});
