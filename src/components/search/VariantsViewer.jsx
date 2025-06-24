import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../common/LoadingSpinner';
import { getSongVariants, getArtistVariants } from '../../services/searchService';

const ViewerContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  margin: 1rem 0;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const ViewerHeader = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ViewerContent = styled.div`
  padding: 1.5rem;
`;

const TabNavigation = styled.div`
  display: flex;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'var(--bg-secondary)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const InfoSection = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
`;

const VariantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const VariantItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const VariantText = styled.div`
  flex: 1;
`;

const VariantName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const VariantType = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  
  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const RelatedItemsList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const RelatedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SummaryCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const VariantsViewer = ({ type, itemId, itemName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('aliases');
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadVariants = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;
        if (type === 'song') {
          result = await getSongVariants(itemId);
          setData(result.songData);
        } else {
          result = await getArtistVariants(itemId);
          setData(result.artistData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadVariants();
    }
  }, [itemId, type]);

  // Defensive checks for missing data
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  if (loading) {
    return (
      <ViewerContainer>
        <ViewerHeader>
          <span>Loading {type} variants...</span>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ViewerHeader>
        <ViewerContent>
          <LoadingSpinner
            text={`Loading ${type} variants...`}
            subtext="Fetching aliases and related items"
          />
        </ViewerContent>
      </ViewerContainer>
    );
  }

  if (error) {
    return (
      <ViewerContainer>
        <ViewerHeader>
          <span>Error Loading Variants</span>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ViewerHeader>
        <ViewerContent>
          <EmptyState>
            <div className="icon">⚠️</div>
            <h4>Error: {error}</h4>
            <p>Failed to load variant information</p>
          </EmptyState>
        </ViewerContent>
      </ViewerContainer>
    );
  }

  if (!data) {
    return (
      <ViewerContainer>
        <ViewerHeader>
          <span>{type === 'song' ? 'Song' : 'Artist'} not found</span>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ViewerHeader>
        <ViewerContent>
          <EmptyState>
            <div className="icon">❓</div>
            <h4>{type === 'song' ? 'Song' : 'Artist'} not found</h4>
            <p>The requested {type} could not be found in the database</p>
          </EmptyState>
        </ViewerContent>
      </ViewerContainer>
    );
  }

  const renderSongVariants = () => {
    if (!data) {
      return (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          <h4>No variant data available for this song.</h4>
        </div>
      );
    }
    const aliases = safeArray(data.aliases);
    const sibling_songs = safeArray(data.sibling_songs);
    const [originalId, originalSong, originalArtist, canonicalId] = data.original;
    
    const tabs = [
      { id: 'aliases', label: '🏷️ Direct Aliases', count: aliases.length },
      { id: 'related', label: '👥 Related Songs', count: sibling_songs.length },
      { id: 'summary', label: '📋 Summary', count: null }
    ];

    return (
      <>
        <InfoSection>
          <InfoTitle>🎵 Song Information</InfoTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Song Title</InfoLabel>
              <InfoValue>{originalSong}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Artist</InfoLabel>
              <InfoValue>{originalArtist}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Song ID</InfoLabel>
              <InfoValue>{originalId}</InfoValue>
            </InfoItem>
            {canonicalId && canonicalId !== originalId && (
              <InfoItem>
                <InfoLabel>Canonical ID</InfoLabel>
                <InfoValue>{canonicalId}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </InfoSection>

        <TabNavigation>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== null && ` (${tab.count})`}
            </TabButton>
          ))}
        </TabNavigation>

        <TabContent>
          {activeTab === 'aliases' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Direct Aliases</h4>
              {aliases.length > 0 ? (
                <VariantsList>
                  {aliases.map(([alias, type], index) => (
                    <VariantItem key={index}>
                      <VariantText>
                        <VariantName>{alias}</VariantName>
                        <VariantType>{type}</VariantType>
                      </VariantText>
                    </VariantItem>
                  ))}
                </VariantsList>
              ) : (
                <EmptyState>
                  <div className="icon">🏷️</div>
                  <p>No direct aliases found for this song</p>
                </EmptyState>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Related Songs</h4>
              {sibling_songs.length > 0 ? (
                <RelatedItemsList>
                  {sibling_songs.map(([id, song, artist, relation], index) => (
                    <RelatedItem key={index}>
                      <div>
                        <VariantName>{song}</VariantName>
                        <VariantType>by {artist} • {relation}</VariantType>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ID: {id}
                      </div>
                    </RelatedItem>
                  ))}
                </RelatedItemsList>
              ) : (
                <EmptyState>
                  <div className="icon">👥</div>
                  <p>No related songs found</p>
                </EmptyState>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Summary</h4>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryValue>{aliases.length}</SummaryValue>
                  <SummaryLabel>Direct Aliases</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryValue>{sibling_songs.length}</SummaryValue>
                  <SummaryLabel>Related Songs</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryValue>{aliases.length + sibling_songs.length + 1}</SummaryValue>
                  <SummaryLabel>Total Variants</SummaryLabel>
                </SummaryCard>
              </SummaryGrid>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h5>All Variants:</h5>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li><strong>{originalSong}</strong> (Original)</li>
                  {aliases.map(([alias], index) => (
                    <li key={index}>• {alias}</li>
                  ))}
                  {sibling_songs.map(([, song, artist], index) => (
                    <li key={index}>→ {song} by {artist} (related)</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </TabContent>
      </>
    );
  };

  const renderArtistVariants = () => {
    if (!data) {
      return (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          <h4>No variant data available for this artist.</h4>
        </div>
      );
    }
    const aliases = safeArray(data.aliases);
    const sample_songs = safeArray(data.sample_songs);
    const [originalId, originalName] = data.original;
    const [totalSongs, primarySongs, featuredSongs] = data.song_stats;
    
    const tabs = [
      { id: 'aliases', label: '🏷️ Aliases', count: aliases.length },
      { id: 'songs', label: '🎵 Sample Songs', count: sample_songs.length },
      { id: 'summary', label: '📋 Summary', count: null }
    ];

    return (
      <>
        <InfoSection>
          <InfoTitle>🎤 Artist Information</InfoTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Artist Name</InfoLabel>
              <InfoValue>{originalName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Artist ID</InfoLabel>
              <InfoValue>{originalId}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Total Songs</InfoLabel>
              <InfoValue>{totalSongs.toLocaleString()}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Primary Artist</InfoLabel>
              <InfoValue>{primarySongs.toLocaleString()}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Featured Artist</InfoLabel>
              <InfoValue>{featuredSongs.toLocaleString()}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoSection>

        <TabNavigation>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== null && ` (${tab.count})`}
            </TabButton>
          ))}
        </TabNavigation>

        <TabContent>
          {activeTab === 'aliases' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Artist Aliases</h4>
              {aliases.length > 0 ? (
                <VariantsList>
                  {aliases.map(([alias, type], index) => (
                    <VariantItem key={index}>
                      <VariantText>
                        <VariantName>{alias}</VariantName>
                        <VariantType>{type}</VariantType>
                      </VariantText>
                    </VariantItem>
                  ))}
                </VariantsList>
              ) : (
                <EmptyState>
                  <div className="icon">🏷️</div>
                  <p>No aliases found for this artist</p>
                </EmptyState>
              )}
            </div>
          )}

          {activeTab === 'songs' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Sample Songs</h4>
              {sample_songs.length > 0 ? (
                <RelatedItemsList>
                  {sample_songs.map(([id, song, isPrimary], index) => (
                    <RelatedItem key={index}>
                      <div>
                        <VariantName>{song}</VariantName>
                        <VariantType>
                          Role: {isPrimary ? 'Primary Artist' : 'Featured Artist'}
                        </VariantType>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ID: {id}
                      </div>
                    </RelatedItem>
                  ))}
                </RelatedItemsList>
              ) : (
                <EmptyState>
                  <div className="icon">🎵</div>
                  <p>No songs found for this artist</p>
                </EmptyState>
              )}
              
              {sample_songs.length === 10 && (
                <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Showing first 10 songs. This artist may have more songs.
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Summary</h4>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryValue>{aliases.length}</SummaryValue>
                  <SummaryLabel>Aliases</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryValue>{totalSongs}</SummaryValue>
                  <SummaryLabel>Total Songs</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryValue>{primarySongs}</SummaryValue>
                  <SummaryLabel>Primary</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryValue>{featuredSongs}</SummaryValue>
                  <SummaryLabel>Featured</SummaryLabel>
                </SummaryCard>
              </SummaryGrid>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h5>All Variants:</h5>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li><strong>{originalName}</strong> (Original)</li>
                  {aliases.map(([alias], index) => (
                    <li key={index}>• {alias}</li>
                  ))}
                </ul>
                
                {totalSongs > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Performance Breakdown:</h5>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      <li>Primary artist: {primarySongs} songs ({((primarySongs / totalSongs) * 100).toFixed(1)}%)</li>
                      <li>Featured artist: {featuredSongs} songs ({((featuredSongs / totalSongs) * 100).toFixed(1)}%)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabContent>
      </>
    );
  };

  return (
    <ViewerContainer>
      <ViewerHeader>
        <span>
          {type === 'song' ? '🎵' : '🎤'} Variants for: {itemName}
        </span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </ViewerHeader>
      <ViewerContent>
        {type === 'song' ? renderSongVariants() : renderArtistVariants()}
      </ViewerContent>
    </ViewerContainer>
  );
};

export default VariantsViewer;