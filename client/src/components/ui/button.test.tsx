import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button Component', () => {
  it('should render with the correct text', () => {
    render(<Button>Click me</Button>);
    
    // Check that the button with text is present
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events without errors', async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    // Simulate a click
    await user.click(button);
    
    // Verify the button is still in the document (no errors occurred)
    expect(button).toBeInTheDocument();
  });
});
