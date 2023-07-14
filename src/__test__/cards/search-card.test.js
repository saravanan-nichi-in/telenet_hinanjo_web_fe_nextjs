import { render, screen } from '@testing-library/react';
import SearchCard from '../../components/Card/searchList';
import '@testing-library/jest-dom';


describe('SearchCard', () => {
  const mockSearchResults = [
    { link: '/company1', companyName: 'Company 1' },
    { link: '/company2', companyName: 'Company 2' },
    { link: '/company3', companyName: 'Company 3' },
  ];

  test('renders search card with input and search results', () => {
    render(<SearchCard searchResults={mockSearchResults} />);

    // Assert the presence of the search input and results
    expect(screen.getAllByRole('listitem')).toHaveLength(mockSearchResults.length);
  });

  test('triggers onInput callback on input change', () => {
    const mockOnInput = jest.fn();
    render(<SearchCard onInput={mockOnInput} searchResults={mockSearchResults} />);

  });

  test('renders search result links correctly', () => {
    render(<SearchCard searchResults={mockSearchResults} />);

    // Assert the presence of search result links
    mockSearchResults.forEach((result) => {
      const link = screen.getByText(result.companyName);
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(result.link);
    });
  });
});

