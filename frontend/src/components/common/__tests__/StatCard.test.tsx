import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(
      <StatCard
        title="Total Employees"
        value="150"
        icon={<div>Icon</div>}
        color="#1976d2"
      />
    );

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="100"
        icon={<div>Icon</div>}
        color="#ff0000"
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
