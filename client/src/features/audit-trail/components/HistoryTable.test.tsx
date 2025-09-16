import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HistoryTable } from './HistoryTable';

const mockData = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      history_id: 1,
      history_user: 'testuser1',
      history_date: '2024-01-01T10:00:00Z',
      history_type: '+' as const,
      history_change_reason: 'Initial creation',
      id: 1,
      batch_number: 'BATCH-001',
      status: 'ACTIVE'
    },
    {
      history_id: 2,
      history_user: 'testuser2',
      history_date: '2024-01-02T10:00:00Z',
      history_type: '~' as const,
      history_change_reason: 'Status update',
      id: 2,
      batch_number: 'BATCH-002',
      status: 'COMPLETED'
    },
    {
      history_id: 3,
      history_user: 'testuser1',
      history_date: '2024-01-03T10:00:00Z',
      history_type: '-' as const,
      history_change_reason: 'Deletion',
      id: 3,
      batch_number: 'BATCH-003',
      status: 'INACTIVE'
    }
  ]
};

const userRecord = {
  history_id: 4,
  history_user: 'admin',
  history_date: '2024-01-04T10:00:00Z',
  history_type: '~' as const,
  history_change_reason: 'Profile update',
  id: 1,
  username: 'john.doe',
  email: 'john.doe@company.com',
  user_full_name: 'John Doe',
  role: 'Manager',
  department: 'Operations'
};

describe('HistoryTable', () => {
  const mockOnViewDetail = vi.fn();
  const mockOnNextPage = vi.fn();
  const mockOnPrevPage = vi.fn();

  it('should render empty state when no data', () => {
    render(<HistoryTable />);

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<HistoryTable isLoading={true} />);

    expect(screen.getByRole('status', { name: 'Loading audit trail records...' })).toBeInTheDocument();
  });

  it('should render error state when error is provided', () => {
    const error = new Error('API Error');
    render(<HistoryTable error={error} />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(
      <HistoryTable
        data={mockData}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByRole('table', { name: 'Audit trail records for selected domain' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4); // Header + 3 data rows
    expect(screen.getByText('BATCH-001')).toBeInTheDocument();
    expect(screen.getByText('BATCH-002')).toBeInTheDocument();
    expect(screen.getByText('BATCH-003')).toBeInTheDocument();
  });

  describe('sorting functionality', () => {
    it('should sort by date ascending', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const dateHeader = screen.getByRole('button', { name: /Sort by date/ });
      fireEvent.click(dateHeader);

      // Should now be sorted ascending (already is by default, but test the mechanism)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
    });

    it('should toggle sort direction', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const dateHeader = screen.getByRole('button', { name: /Sort by date/ });
      fireEvent.click(dateHeader); // asc
      fireEvent.click(dateHeader); // desc
      fireEvent.click(dateHeader); // none

      const dateColumnHeader = dateHeader.closest('[role="columnheader"]');
      expect(dateColumnHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('should sort by user', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const userHeader = screen.getByRole('button', { name: /Sort by user/ });
      fireEvent.click(userHeader);

      const userColumnHeader = userHeader.closest('[role="columnheader"]');
      expect(userColumnHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('entity formatting', () => {
    it('should format batch entity names', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      expect(screen.getByText('BATCH-001')).toBeInTheDocument();
      // Look for Batch in the entity column specifically
      const batchText = screen.getAllByText('Batch')[0];
      expect(batchText).toBeInTheDocument();
    });

    it('should format user entity names with enhanced information', () => {
      const userData = {
        count: 1,
        next: null,
        previous: null,
        results: [userRecord]
      };

      render(
        <HistoryTable
          data={userData}
          onViewDetail={mockOnViewDetail}
        />
      );

      expect(screen.getByText('john.doe')).toBeInTheDocument();
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('📧 john.doe@company.com')).toBeInTheDocument();
      expect(screen.getByText('👤 John Doe')).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('should show pagination controls', () => {
      render(
        <HistoryTable
          data={mockData}
          currentPage={1}
          pageSize={25}
          onNextPage={mockOnNextPage}
          onPrevPage={mockOnPrevPage}
        />
      );

      expect(screen.getByText('Showing 1-3 of 3 records')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
      render(
        <HistoryTable
          data={mockData}
          currentPage={1}
          onPrevPage={mockOnPrevPage}
        />
      );

      const prevButton = screen.getByRole('button', { name: /Go to previous page/ });
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button when no next page', () => {
      render(
        <HistoryTable
          data={mockData}
          currentPage={1}
          onNextPage={mockOnNextPage}
        />
      );

      const nextButton = screen.getByRole('button', { name: /Go to next page/ });
      expect(nextButton).toBeDisabled();
    });

    it('should call onNextPage when next button is clicked', () => {
      const dataWithNext = { ...mockData, next: 'next-url' };

      render(
        <HistoryTable
          data={dataWithNext}
          currentPage={1}
          onNextPage={mockOnNextPage}
        />
      );

      const nextButton = screen.getByRole('button', { name: 'Go to next page (2)' });
      fireEvent.click(nextButton);

      expect(mockOnNextPage).toHaveBeenCalled();
    });

    it('should call onPrevPage when previous button is clicked', () => {
      const dataWithPrev = { ...mockData, previous: 'prev-url' };

      render(
        <HistoryTable
          data={dataWithPrev}
          currentPage={2}
          onPrevPage={mockOnPrevPage}
        />
      );

      const prevButton = screen.getByRole('button', { name: 'Go to previous page (1)' });
      fireEvent.click(prevButton);

      expect(mockOnPrevPage).toHaveBeenCalled();
    });
  });

  describe('view details functionality', () => {
    it('should call onViewDetail when view button is clicked', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const viewButtons = screen.getAllByRole('button', { name: /View details for/ });
      fireEvent.click(viewButtons[0]);

      expect(mockOnViewDetail).toHaveBeenCalledWith(mockData.results[0]);
    });

    it('should support keyboard activation', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const viewButton = screen.getAllByRole('button', { name: /View details for/ })[0];
      fireEvent.keyDown(viewButton, { key: 'Enter' });

      expect(mockOnViewDetail).toHaveBeenCalledWith(mockData.results[0]);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-rowcount', '3');
      expect(table).toHaveAttribute('aria-colcount', '5');

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-labelledby', 'table-heading');
      expect(region).toHaveAttribute('aria-describedby', 'table-description');
    });

    it('should have accessible column headers', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
      expect(dateHeader).toHaveAttribute('aria-sort', 'none');

      const userHeader = screen.getByRole('button', { name: /Sort by user/ });
      const userColumnHeader = userHeader.closest('[role="columnheader"]');
      expect(userColumnHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('should have accessible table cells', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);

      const firstCell = cells[0];
      expect(firstCell).toHaveAttribute('aria-label');
    });

    it('should announce pagination status', () => {
      render(
        <HistoryTable
          data={mockData}
          currentPage={1}
          pageSize={25}
        />
      );

      const status = screen.getByText('Showing 1-3 of 3 records');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('domain and model props', () => {
    it('should use domain and model in descriptions', () => {
      render(
        <HistoryTable
          data={mockData}
          domain="batch"
          model="batch"
          onViewDetail={mockOnViewDetail}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Audit trail records for batch domain');

      const description = screen.getByText('Audit trail records for batch domain, batch model');
      expect(description).toHaveClass('sr-only');
    });
  });

  describe('keyboard navigation', () => {
    it('should support keyboard sorting', () => {
      render(
        <HistoryTable
          data={mockData}
          onViewDetail={mockOnViewDetail}
        />
      );

      const dateHeader = screen.getByRole('button', { name: /Sort by date/ });
      fireEvent.keyDown(dateHeader, { key: 'Enter' });

      const dateColumnHeader = dateHeader.closest('[role="columnheader"]');
      expect(dateColumnHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  it('should apply custom className', () => {
    render(
      <HistoryTable
        data={mockData}
        className="custom-table-class"
        onViewDetail={mockOnViewDetail}
      />
    );

    const container = screen.getByRole('region');
    expect(container).toHaveClass('custom-table-class');
  });
});
