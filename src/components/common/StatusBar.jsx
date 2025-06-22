import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-color);
  padding: var(--space-4) 0;
  margin-top: var(--space-8);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--primary-color) 50%,
      transparent 100%
    );
  }
`;

const StatusContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    text-align: center;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--bg-secondary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-elevated);
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatusIcon = styled.span`
  font-size: 1.1rem;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
  transition: all var(--transition-normal);
  
  ${StatusItem}:hover & {
    filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.5));
    transform: scale(1.1);
  }
`;

const StatusText = styled.span`
  font-weight: 500;
  color: var(--text-secondary);
`;

const StatusValue = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-family-display);
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ConnectionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? 'var(--success-color)' : 'var(--error-color)'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: inherit;
    opacity: 0.3;
    animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.1;
      transform: scale(1.5);
    }
  }
`;

const LoggingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
  
  .indicator-dot {
    width: 6px;
    height: 6px;
    background: var(--primary-color);
    border-radius: 50%;
    animation: blink 1.5s ease-in-out infinite;
  }
  
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.3; }
  }
`;

const StatusBar = ({ 
  dbHost = 'localhost', 
  dbName = 'music_db', 
  lastRefresh, 
  isConnected = true 
}) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeSince = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes === 0) {
      return `${seconds}s ago`;
    }
    return `${minutes}m ${seconds}s ago`;
  };

  return (
    <StatusContainer>
      <StatusContent>
        <StatusItem>
          <StatusIcon>🗄️</StatusIcon>
          <StatusText>Database:</StatusText>
          <StatusValue>{dbName}</StatusValue>
          <StatusText>@</StatusText>
          <StatusValue>{dbHost}</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon>🕒</StatusIcon>
          <StatusText>Last refresh:</StatusText>
          <StatusValue>{formatTimestamp(lastRefresh)}</StatusValue>
          {lastRefresh && (
            <StatusText style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              ({getTimeSince(lastRefresh)})
            </StatusText>
          )}
        </StatusItem>
        
        <StatusItem>
          <ConnectionStatus>
            <ConnectionDot connected={isConnected} />
            <StatusText>Status:</StatusText>
            <StatusValue style={{ 
              color: isConnected ? 'var(--success-color)' : 'var(--error-color)' 
            }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </StatusValue>
          </ConnectionStatus>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon>📊</StatusIcon>
          <LoggingIndicator>
            <div className="indicator-dot"></div>
            <StatusText>Enhanced logging active</StatusText>
          </LoggingIndicator>
        </StatusItem>
      </StatusContent>
    </StatusContainer>
  );
};

export default StatusBar;