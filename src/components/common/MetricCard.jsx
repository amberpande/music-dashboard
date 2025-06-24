import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.color) return props.color;
      return 'var(--gradient-primary)';
    }};
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
    border-color: var(--border-hover);
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
`;

const IconContainer = styled.div`
  font-size: 2rem;
  opacity: 0.8;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
  transition: all var(--transition-normal);
  
  ${CardContainer}:hover & {
    opacity: 1;
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.5));
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-family-display);
`;

const ValueContainer = styled.div`
  margin-bottom: var(--space-3);
`;

const Value = styled.div`
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: var(--space-2);
  font-family: var(--font-family-display);
  letter-spacing: -0.025em;
  
  @media (max-width: 576px) {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
  }
`;

const DeltaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
`;

const Delta = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  
  ${props => {
    if (props.deltaColor === 'normal') {
      return `
        color: var(--success-color);
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
      `;
    }
    if (props.deltaColor === 'inverse') {
      return `
        color: var(--error-color);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
      `;
    }
    if (props.deltaColor === 'off') {
      return `
        color: var(--warning-color);
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.2);
      `;
    }
    return `
      color: var(--text-secondary);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    `;
  }}
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: var(--space-3);
  line-height: 1.4;
  background: var(--bg-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--border-color);
`;

const TrendIndicator = styled.span`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: ${props => {
      if (props.deltaColor === 'normal') return "'▲'";
      if (props.deltaColor === 'inverse') return "'▼'";
      if (props.deltaColor === 'off') return "'⚠️'";
      return "'━'";
    }};
    margin-right: var(--space-1);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    if (props.status === 'excellent') return 'var(--success-color)';
    if (props.status === 'good') return 'var(--warning-color)';
    if (props.status === 'poor') return 'var(--error-color)';
    return 'var(--text-muted)';
  }};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
  ${props => props.animated && `
    animation: statusPulse 2s infinite;
    
    @keyframes statusPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }
  `}
  
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
    animation: ${props => props.animated ? 'statusRipple 2s infinite' : 'none'};
  }
  
  @keyframes statusRipple {
    0% {
      opacity: 0.3;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(2);
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
    135deg,
    transparent 0%,
    rgba(139, 92, 246, 0.02) 50%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const MetricCard = ({
  title,
  value,
  delta,
  deltaColor = 'normal',
  help,
  icon,
  color,
  status,
  animated = false,
  onClick
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <CardContainer 
      color={color} 
      onClick={onClick}
    >
      <GradientOverlay />
      
      <CardHeader>
        <TitleSection>
          <Title>{title}</Title>
        </TitleSection>
        {icon && <IconContainer>{icon}</IconContainer>}
      </CardHeader>
      
      <ValueContainer>
        <Value>{formatValue(value)}</Value>
        
        {delta && (
          <DeltaContainer>
            <Delta deltaColor={deltaColor}>
              <TrendIndicator deltaColor={deltaColor} />
              {delta}
            </Delta>
          </DeltaContainer>
        )}
      </ValueContainer>
      
      {help && <HelpText>{help}</HelpText>}
      
      {status && (
        <StatusBadge status={status} animated={animated} />
      )}
    </CardContainer>
  );
};

export default MetricCard;