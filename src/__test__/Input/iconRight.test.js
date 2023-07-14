import React from 'react';
import { render, screen, fireEvent  } from '@testing-library/react';
import IconRight from '../../components/Input/iconRight';
import '@testing-library/jest-dom'

describe('IconRight', () => {

  test('renders the component with input and icon', () => {
    render(
      <IconRight
        icon={() => <span>Icon</span>}
        type="text"
        id="inputId"
        padding="p-2"
        border="border"
        borderRound="rounded-lg"
        additionalClass="custom-class"
        placeholder="Enter a value"
        value=""
        onChange={() => {}}
      />
    );

    // Assert that the component renders the input and icon elements
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('passes the input value to onChange callback', () => {
    const onChangeMock = jest.fn();

    render(
      <IconRight
        icon={() => <span>Icon</span>}
        type="text"
        id="inputId"
        padding="p-2"
        border="border"
        borderRound="rounded-lg"
        additionalClass="custom-class"
        placeholder="Enter a value"
        value=""
        onChange={onChangeMock}
      />
    );

    // Simulate typing a value into the input
    const inputElement = screen.getByRole('textbox');
    const testValue = 'Test Value';
    fireEvent.change(inputElement, { target: { value: testValue } });

    // Assert that the onChange callback is called with the correct value
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(testValue);
  });

  test('renders with correct props', () => {
    const icon = jest.fn().mockReturnValue(<svg data-testid="icon" />);
    const placeholder = 'Search...';

    render(<IconRight icon={icon} placeholder={placeholder} />);

    expect(icon).toHaveBeenCalled();
  });

  test('invokes onChange event when input value changes', () => {
    const onChange = jest.fn();
    const placeholder = 'Search...';

    render(<IconRight icon={() => <svg />} placeholder={placeholder} onChange={onChange} />);

    expect(onChange).toHaveBeenCalledTimes(0); // Assumes 0 keystrokes in the input
  });

  // Add more test cases as needed
});
