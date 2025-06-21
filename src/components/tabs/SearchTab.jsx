import React, { useState } from 'react';
import styled from 'styled-components';
import SearchInterface from '../search/SearchInterface';
import VariantsViewer from '../search/VariantsViewer';

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

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ResultsColumn = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  background: ${props => props.type === 'songs' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-muted) var(--bg-secondary);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    border-radius: 4px;
  }
`;

const ResultItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const ItemIcon = styled.div`
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSubtitle = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  
  &.has-aliases {
    background: #d4edda;
    color: #155724;
  }
  
  &.no-aliases {
    background: #f8d7da;
    color: #721c24;
  }
`;

const ActionButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #3a9bc1;
    transform: translateY(-1px);
  }
  
  @media (max-width: 576px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
`;

const SearchTab = ({ refreshTrigger }) => {
  const [searchResults, setSearchResults] = useState({ songs: [], artists: [] });
  const [showVariants, setShowVariants] = useState(null);

  const handleResultsUpdate = (results) => {
    setSearchResults(results);
  };

  const handleViewVariants = (type, id, name) => {
    setShowVariants({ type, id, name });
  };

  const handleCloseVariants = () => {
    setShowVariants(null);
  };

  const renderSongResults = () => {
    if (searchResults.songs.length === 0) {
      return (
        <EmptyResults>
          <div className="icon">🎵</div>
          <h4>No songs found</h4>
          <p>Try adjusting your search terms or use different keywords.</p>
        </EmptyResults>
      );
    }

    return (
      <ResultsList>
        {searchResults.songs.map((song, index) => (
          <ResultItem key={song.id}>
            <ItemIcon>🎵</ItemIcon>
            <ItemInfo>
              <ItemTitle>{song.song}</ItemTitle>
              <ItemSubtitle>by {song.artist_0}</ItemSubtitle>
            </ItemInfo>
            <StatusBadge className={song.alias_status === 'Has Aliases' ? 'has-aliases' : 'no-aliases'}>
              {song.alias_status === 'Has Aliases' ? '🟢 Aliases' : '🔴 No Aliases'}
            </StatusBadge>
            <div className="hide-mobile" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ID: {song.id}
            </div>
            <ActionButton onClick={() => handleViewVariants('song', song.id, song.song)}>
              View Variants
            </ActionButton>
          </ResultItem>
        ))}
      </ResultsList>
    );
  };

  const renderArtistResults = () => {
    if (searchResults.artists.length === 0) {
      return (
        <EmptyResults>
          <div className="icon">🎤</div>
          <h4>No artists found</h4>
          <p>Try adjusting your search terms or use different keywords.</p>
        </EmptyResults>
      );
    }

    return (
      <ResultsList>
        {searchResults.artists.map((artist, index) => (
          <ResultItem key={artist.id}>
            <ItemIcon>🎤</ItemIcon>
            <ItemInfo>
              <ItemTitle>{artist.name}</ItemTitle>
              <ItemSubtitle>{artist.song_count} songs total</ItemSubtitle>
            </ItemInfo>
            <StatusBadge className={artist.alias_status === 'Has Aliases' ? 'has-aliases' : 'no-aliases'}>
              {artist.alias_status === 'Has Aliases' ? '🟢 Aliases' : '🔴 No Aliases'}
            </StatusBadge>
            <div className="hide-mobile" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ID: {artist.id}
            </div>
            <ActionButton onClick={() => handleViewVariants('artist', artist.id, artist.name)}>
              View Variants
            </ActionButton>
          </ResultItem>
        ))}
      </ResultsList>
    );
  };

  const hasResults = searchResults.songs.length > 0 || searchResults.artists.length > 0;

  return (
    <SearchContainer>
      <SearchInterface onResultsUpdate={handleResultsUpdate}>
        {hasResults && (
          <ResultsSection>
            <ResultsColumn>
              <ColumnHeader type="songs">
                <span>🎵 Songs</span>
                <span>{searchResults.songs.length} found</span>
              </ColumnHeader>
              {renderSongResults()}
            </ResultsColumn>

            <ResultsColumn>
              <ColumnHeader type="artists">
                <span>🎤 Artists</span>
                <span>{searchResults.artists.length} found</span>
              </ColumnHeader>
              {renderArtistResults()}
            </ResultsColumn>
          </ResultsSection>
        )}
      </SearchInterface>

      {showVariants && (
        <VariantsViewer
          type={showVariants.type}
          itemId={showVariants.id}
          itemName={showVariants.name}
          onClose={handleCloseVariants}
        />
      )}
    </SearchContainer>
  );
};

export default SearchTab;