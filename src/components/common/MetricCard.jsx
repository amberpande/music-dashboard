import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'var(--accent-color)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div`
  font-size: 2rem;
  opacity: 0.8;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
`;

const ValueContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const DeltaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Delta = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => {
    if (props.deltaColor === 'normal') return 'var(--success-color)';
    if (props.deltaColor === 'inverse') return 'var(--error-color)';
    if (props.deltaColor === 'off') return 'var(--warning-color)';
    return 'var(--text-secondary)';
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const TrendIndicator = styled.span`
  font-size: 0.8rem;
  &::before {
    content: ${props => {
      if (props.deltaColor === 'normal') return "'▲'";
      if (props.deltaColor === 'inverse') return "'▼'";
      if (props.deltaColor === 'off') return "'⚠️'";
      return "'━'";
    }};
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    if (props.status === 'excellent') return 'var(--success-color)';
    if (props.status === 'good') return 'var(--warning-color)';
    if (props.status === 'poor') return 'var(--error-color)';
    return 'var(--text-muted)';
  }};
  animation: ${props => props.animated ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardHeader>
        <Title>{title}</Title>
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