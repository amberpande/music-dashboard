import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../common/LoadingSpinner';
import { searchSongs, searchArtists, getSearchSuggestions, advancedSearch } from '../../services/searchService';

const SearchContainer = styled.div`
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const SearchSubtitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
`;

const SearchForm = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem 1rem 3rem;
  font-size: 1.1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(69, 183, 209, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-muted);
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: var(--shadow-md);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionText = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const SuggestionSubtext = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const SearchButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  
  &.primary {
    background: var(--accent-color);
    color: white;
    
    &:hover {
      background: #3a9bc1;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--bg-primary);
      transform: translateY(-2px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
`;

const ResultsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ResultsCount = styled.span`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
`;

const SearchInterface = ({ onResultsUpdate, children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('simple'); // 'simple' or 'advanced'
  const [filters, setFilters] = useState({
    type: 'all',
    year: '',
    genre: '',
    artistCount: '',
    minSongs: '',
    maxSongs: '',
    limit: 20
  });
  const [results, setResults] = useState({ songs: [], artists: [] });
  const [hasSearched, setHasSearched] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        getSearchSuggestions(searchQuery).then(setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    // Auto-search when suggestion is selected
    performSearch(suggestion.text);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const performSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      let searchResults;

      if (searchMode === 'advanced') {
        // Use advanced search with filters
        searchResults = await advancedSearch(query, filters);
      } else {
        // Simple search for both songs and artists
        const [songsResults, artistsResults] = await Promise.all([
          searchSongs(query, filters.limit),
          searchArtists(query, filters.limit)
        ]);
        
        searchResults = {
          songs: songsResults,
          artists: artistsResults
        };
      }

      setResults(searchResults);
      
      // Notify parent component
      if (onResultsUpdate) {
        onResultsUpdate(searchResults);
      }

    } catch (error) {
      console.error('Search error:', error);
      setResults({ songs: [], artists: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      performSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults({ songs: [], artists: [] });
    setHasSearched(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setFilters({
      type: 'all',
      year: '',
      genre: '',
      artistCount: '',
      minSongs: '',
      maxSongs: '',
      limit: 20
    });
  };

  const totalResults = results.songs.length + results.artists.length;

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>🔍 Search & Explore All Variants</SearchTitle>
        <SearchSubtitle>
          Advanced search functionality with variants viewer and intelligent filtering
        </SearchSubtitle>
      </SearchHeader>

      <SearchForm>
        <SearchInputContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Search for songs by title or artist name..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionsDropdown ref={suggestionsRef}>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <SuggestionText>
                    {suggestion.type === 'song' ? '🎵' : '🎤'} {suggestion.text}
                  </SuggestionText>
                  <SuggestionSubtext>{suggestion.subtext}</SuggestionSubtext>
                </SuggestionItem>
              ))}
            </SuggestionsDropdown>
          )}
        </SearchInputContainer>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="searchMode"
              value="simple"
              checked={searchMode === 'simple'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            Simple Search
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="searchMode"
              value="advanced"
              checked={searchMode === 'advanced'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            Advanced Search with Filters
          </label>
        </div>

        {searchMode === 'advanced' && (
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Search Type</FilterLabel>
              <FilterSelect
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Results</option>
                <option value="songs">Songs Only</option>
                <option value="artists">Artists Only</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Release Year</FilterLabel>
              <FilterInput
                type="number"
                placeholder="e.g., 2023"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                min="1900"
                max="2024"
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Genre</FilterLabel>
              <FilterSelect
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                <option value="pop">Pop</option>
                <option value="hip hop">Hip Hop</option>
                <option value="rock">Rock</option>
                <option value="r&b">R&B</option>
                <option value="alternative">Alternative</option>
                <option value="electronic">Electronic</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Collaboration Type</FilterLabel>
              <FilterSelect
                value={filters.artistCount}
                onChange={(e) => handleFilterChange('artistCount', e.target.value)}
              >
                <option value="">Any</option>
                <option value="solo">Solo Artists Only</option>
                <option value="collab">Collaborations Only</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Min Songs (Artists)</FilterLabel>
              <FilterInput
                type="number"
                placeholder="Min songs"
                value={filters.minSongs}
                onChange={(e) => handleFilterChange('minSongs', e.target.value)}
                min="1"
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Results Limit</FilterLabel>
              <FilterSelect
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              >
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={50}>50 results</option>
                <option value={100}>100 results</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
        )}

        <SearchButtons>
          <SearchButton
            className="primary"
            onClick={() => performSearch()}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </SearchButton>
          <SearchButton
            className="secondary"
            onClick={clearSearch}
            disabled={loading}
          >
            🗑️ Clear
          </SearchButton>
        </SearchButtons>
      </SearchForm>

      {loading && (
        <LoadingSpinner
          size="large"
          text="Searching database..."
          subtext="Finding songs and artists matching your query"
          showDots={true}
        />
      )}

      {hasSearched && !loading && (
        <ResultsContainer>
          <ResultsHeader>
            <ResultsTitle>Search Results</ResultsTitle>
            <ResultsCount>
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </ResultsCount>
          </ResultsHeader>

          {totalResults === 0 ? (
            <NoResults>
              <div className="icon">🔍</div>
              <h3>No results found</h3>
              <p>
                Try adjusting your search terms or filters.
                <br />
                Make sure your spelling is correct or try broader terms.
              </p>
            </NoResults>
          ) : (
            children
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchInterface;