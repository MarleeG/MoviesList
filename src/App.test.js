import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Movie List text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Movie List/i);
  expect(linkElement).toBeInTheDocument();
});
