import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
  padding: var(--space-6) 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h1`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 3.5vw, 2rem);
  }
  
  @media (max-width: 576px) {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }
`;

const TitleIcon = styled.span`
  font-size: 1.2em;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
`;

const Subtitle = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin: var(--space-2) 0 0 0;
  color: var(--text-secondary);
  font-weight: 400;
  line-height: 1.5;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
`;

const RefreshButton = styled.button`
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-family-display);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
    transition: left var(--transition-slow);
  }
  
  &:hover {
    background: var(--bg-elevated);
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.2);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 576px) {
    padding: var(--space-2) var(--space-4);
    font-size: 0.75rem;
  }
`;

const RefreshIcon = styled.span`
  font-size: 1rem;
  transition: transform var(--transition-normal);
  
  ${RefreshButton}:hover & {
    transform: rotate(180deg);
  }
  
  ${RefreshButton}:disabled & {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  backdrop-filter: blur(8px);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  
  @media (max-width: 576px) {
    font-size: 0.75rem;
    padding: var(--space-1) var(--space-3);
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success-color);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: var(--success-color);
    opacity: 0.3;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.1;
      transform: scale(1.2);
    }
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(139, 92, 246, 0.03) 25%,
    rgba(59, 130, 246, 0.03) 50%,
    rgba(139, 92, 246, 0.03) 75%,
    transparent 100%
  );
  pointer-events: none;
  animation: gradientShift 10s ease-in-out infinite;
  
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Header = ({ onRefresh, isLoading }) => {
  const handleRefresh = () => {
    if (onRefresh && !isLoading) {
      onRefresh();
    }
  };

  return (
    <HeaderContainer>
      <GradientOverlay />
      <HeaderContent>
        <TitleSection>
          <Title>
            <TitleIcon>🎵</TitleIcon>
            Enhanced Music Database Dashboard
          </Title>
        </TitleSection>
        
        <ActionSection>
          <StatusIndicator>
            <StatusDot />
            <span>Connected</span>
          </StatusIndicator>
          
          <RefreshButton 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshIcon>
              {isLoading ? '⟳' : '🔄'}
            </RefreshIcon>
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </RefreshButton>
        </ActionSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;