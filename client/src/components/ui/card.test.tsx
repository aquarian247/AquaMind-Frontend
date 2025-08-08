import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';

describe('Card Component', () => {
  it('should render with header, content and footer', () => {
    const titleText = 'Card Title';
    const contentText = 'This is the card content';
    const footerText = 'Card Footer';
    
    render(
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
        </CardHeader>
        <CardContent>
          {contentText}
        </CardContent>
        <CardFooter>
          {footerText}
        </CardFooter>
      </Card>
    );
    
    // Check that the title is present
    expect(screen.getByText(titleText)).toBeInTheDocument();
    
    // Check that the content is present
    expect(screen.getByText(contentText)).toBeInTheDocument();
    
    // Verify footer is also present (additional check)
    expect(screen.getByText(footerText)).toBeInTheDocument();
  });
});
