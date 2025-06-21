import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 1rem 0;
  margin-top: 2rem;
`;

const StatusContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatusIcon = styled.span`
  font-size: 1.1rem;
`;

const StatusText = styled.span`
  font-weight: 500;
`;

const StatusValue = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const StatusBar = ({ 
  dbHost = 'localhost', 
  dbName = 'music_db', 
  lastRefresh, 
  isConnected = true 
}) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const connectionStatus = isConnected ? {
    icon: '🟢',
    text: 'Connected',
    color: 'var(--success-color)'
  } : {
    icon: '🔴',
    text: 'Disconnected',
    color: 'var(--error-color)'
  };

  return (
    <StatusContainer>
      <StatusContent>
        <StatusItem>
          <StatusIcon>🔗</StatusIcon>
          <StatusText>Database:</StatusText>
          <StatusValue>{dbName} on {dbHost}</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon>🕒</StatusIcon>
          <StatusText>Last refresh:</StatusText>
          <StatusValue>{formatTimestamp(lastRefresh)}</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon style={{ color: connectionStatus.color }}>
            {connectionStatus.icon}
          </StatusIcon>
          <StatusText>Status:</StatusText>
          <StatusValue style={{ color: connectionStatus.color }}>
            {connectionStatus.text}
          </StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon>📊</StatusIcon>
          <StatusText>Enhanced logging active</StatusText>
          <StatusValue>- Check console for detailed logs</StatusValue>
        </StatusItem>
      </StatusContent>
    </StatusContainer>
  );
};

export default StatusBar;