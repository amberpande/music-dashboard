import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.size === 'large' ? '4rem 2rem' : '2rem'};
  text-align: center;
`;

const Spinner = styled.div`
  width: ${props => {
    if (props.size === 'small') return '20px';
    if (props.size === 'large') return '60px';
    return '40px';
  }};
  height: ${props => {
    if (props.size === 'small') return '20px';
    if (props.size === 'large') return '60px';
    return '40px';
  }};
  border: ${props => {
    const borderWidth = props.size === 'large' ? '6px' : '4px';
    return `${borderWidth} solid var(--border-color)`;
  }};
  border-left: ${props => {
    const borderWidth = props.size === 'large' ? '6px' : '4px';
    return `${borderWidth} solid var(--accent-color)`;
  }};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${props => props.showText ? '1rem' : '0'};
`;

const LoadingText = styled.div`
  color: var(--text-secondary);
  font-size: ${props => props.size === 'large' ? '1.25rem' : '1rem'};
  font-weight: 500;
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtext = styled.div`
  color: var(--text-muted);
  font-size: 0.875rem;
  max-width: 300px;
  line-height: 1.4;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: 30%;
    height: 100%;
    background: var(--accent-color);
    border-radius: 2px;
    animation: ${keyframes`
      0% { transform: translateX(-100%); }
      100% { transform: translateX(333%); }
    `} 2s ease-in-out infinite;
  }
`;

const LoadingSpinner = ({ 
  size = 'medium', 
  text, 
  subtext, 
  showDots = false,
  showProgress = false,
  className 
}) => {
  return (
    <LoadingContainer size={size} className={className}>
      <Spinner size={size} showText={!!text} />
      
      {text && (
        <LoadingText size={size}>
          {text}
        </LoadingText>
      )}
      
      {subtext && (
        <LoadingSubtext>
          {subtext}
        </LoadingSubtext>
      )}
      
      {showDots && (
        <DotsContainer>
          <Dot delay={0} />
          <Dot delay={0.2} />
          <Dot delay={0.4} />
        </DotsContainer>
      )}
      
      {showProgress && <ProgressBar />}
    </LoadingContainer>
  );
};

// Inline loading spinner for buttons and small spaces
export const InlineSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-left: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

// Overlay loading spinner
export const OverlaySpinner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

export default LoadingSpinner;