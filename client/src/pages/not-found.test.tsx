import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound Component', () => {
  it('should render the 404 page with correct text', () => {
    render(<NotFound />);
    
    // Check that the 404 text is present
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
    
    // Additional check for the helper text
    expect(screen.getByText('Did you forget to add the page to the router?')).toBeInTheDocument();
  });
});
