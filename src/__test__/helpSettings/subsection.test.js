import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubSection from '../../components/HelpSettings/subsection';

describe('SubSection', () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  it('should handle tab click', () => {
    const handleTabClick = jest.fn();
    const handleEditClick = jest.fn();
    const handleDeleteClick = jest.fn();
    const { getByText } = render(
      <SubSection tabs={tabs} handleTabClick={handleTabClick} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
    );

    fireEvent.click(getByText('Tab 2'));
    expect(handleTabClick).toHaveBeenCalledWith(1);
  });

  it('should handle edit tab click', () => {
    const handleTabClick = jest.fn();
    const handleEditClick = jest.fn();
    const handleDeleteClick = jest.fn();
    const { getByTestId } = render(
      <SubSection tabs={tabs} handleTabClick={handleTabClick} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
    );
    expect(handleEditClick).toHaveBeenCalledTimes(0);
    fireEvent.click(getByTestId('delete-1'));
    expect(handleDeleteClick).toHaveBeenCalledTimes(1);
    expect(handleDeleteClick).toHaveBeenCalledWith('Tab 2');
  });
});


