import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${modalFadeIn} 0.3s ease-out;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
`;

const ProgressPercentage = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-color);
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${keyframes`
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    `} 2s infinite;
  }
`;

const StatusMessage = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

const PhaseIndicator = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PhaseText = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const PhaseStep = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const LogContainer = styled.div`
  background: #0e1117;
  color: #fafafa;
  border-radius: 0.5rem;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  border: 1px solid #262730;
`;

const LogEntry = styled.div`
  margin-bottom: 0.5rem;
  
  &.info { color: #00d4aa; }
  &.warning { color: #ffab00; }
  &.error { color: #ff6b6b; }
  &.success { color: #51cf66; }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin: 1.5rem 0;
`;

const MetricCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ResultsSection = styled.div`
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1px solid #badbcc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
  color: #0f5132;
`;

const ResultsTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #0f5132;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: var(--accent-color);
    color: white;
    
    &:hover:not(:disabled) {
      background: #3a9bc1;
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover:not(:disabled) {
      background: var(--bg-primary);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProgressModal = ({ 
  isOpen, 
  onClose, 
  title, 
  progress, 
  results, 
  isCompleted, 
  operationType,
  allowCancel = false
}) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (progress?.message) {
      const timestamp = new Date().toLocaleTimeString();
      const logType = progress.progress === 100 ? 'success' : 'info';
      
      setLogs(prev => [...prev, {
        timestamp,
        message: progress.message,
        type: logType
      }].slice(-20)); // Keep last 20 log entries
    }
  }, [progress?.message]);

  useEffect(() => {
    if (isCompleted && results) {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, {
        timestamp,
        message: results.finalMessage || 'Operation completed successfully!',
        type: 'success'
      }]);
    }
  }, [isCompleted, results]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isCompleted && !allowCancel) return;
    onClose();
  };

  const renderResults = () => {
    if (!results || !results.results) return null;

    const { results: data } = results;

    if (operationType === 'comprehensive') {
      return (
        <ResultsSection>
          <ResultsTitle>🎉 Comprehensive Fix Results</ResultsTitle>
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{data.totals?.songsProcessed || 0}</MetricValue>
              <MetricLabel>Songs Processed</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{data.totals?.relationshipsCreated || 0}</MetricValue>
              <MetricLabel>Relationships Created</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{data.totals?.artistsCreated || 0}</MetricValue>
              <MetricLabel>Artists Created</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{data.totals?.totalErrors || 0}</MetricValue>
              <MetricLabel>Errors</MetricLabel>
            </MetricCard>
          </MetricsGrid>
        </ResultsSection>
      );
    }

    if (operationType?.includes('ai_')) {
      return (
        <ResultsSection>
          <ResultsTitle>
            🤖 AI Deduplication Results
          </ResultsTitle>
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{data.groups_found || 0}</MetricValue>
              <MetricLabel>Groups Found</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{data.aliases_created || 0}</MetricValue>
              <MetricLabel>Aliases Created</MetricLabel>
            </MetricCard>
            {data.ai_calls_made && (
              <MetricCard>
                <MetricValue>{data.ai_calls_made}</MetricValue>
                <MetricLabel>AI Calls Made</MetricLabel>
              </MetricCard>
            )}
            {data.estimated_cost && (
              <MetricCard>
                <MetricValue>${data.estimated_cost.toFixed(2)}</MetricValue>
                <MetricLabel>Estimated Cost</MetricLabel>
              </MetricCard>
            )}
          </MetricsGrid>
        </ResultsSection>
      );
    }

    // Single operation results
    const metrics = [];
    if (data.fixed) metrics.push({ label: 'Fixed', value: data.fixed });
    if (data.repaired) metrics.push({ label: 'Repaired', value: data.repaired });
    if (data.deleted) metrics.push({ label: 'Deleted', value: data.deleted });
    if (data.relationshipsCreated) metrics.push({ label: 'Relationships', value: data.relationshipsCreated });
    if (data.artistsCreated) metrics.push({ label: 'Artists Created', value: data.artistsCreated });
    if (data.errors !== undefined) metrics.push({ label: 'Errors', value: data.errors });

    return (
      <ResultsSection>
        <ResultsTitle>✅ Operation Results</ResultsTitle>
        <MetricsGrid>
          {metrics.map((metric, index) => (
            <MetricCard key={index}>
              <MetricValue>{metric.value}</MetricValue>
              <MetricLabel>{metric.label}</MetricLabel>
            </MetricCard>
          ))}
        </MetricsGrid>
      </ResultsSection>
    );
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isCompleted ? '✅' : '🔄'} {title}
          </ModalTitle>
          <CloseButton 
            onClick={handleClose}
            disabled={!isCompleted && !allowCancel}
          >
            ✕
          </CloseButton>
        </ModalHeader>

        {!isCompleted && (
          <ProgressSection>
            <ProgressHeader>
              <ProgressText>
                {progress?.phase || 'Preparing...'}
              </ProgressText>
              <ProgressPercentage>
                {progress?.progress || 0}%
              </ProgressPercentage>
            </ProgressHeader>

            <ProgressBarContainer>
              <ProgressBar progress={progress?.progress || 0} />
            </ProgressBarContainer>

            {progress?.message && (
              <StatusMessage>{progress.message}</StatusMessage>
            )}

            {progress?.currentPhase && progress?.totalPhases && (
              <PhaseIndicator>
                <PhaseText>{progress.operationName || progress.phase}</PhaseText>
                <PhaseStep>
                  Phase {progress.currentPhase}/{progress.totalPhases}
                </PhaseStep>
              </PhaseIndicator>
            )}

            {progress?.aiCallsUsed !== undefined && (
              <PhaseIndicator>
                <PhaseText>AI Calls Used</PhaseText>
                <PhaseStep>
                  {progress.aiCallsUsed}/{progress.maxAICalls} (~${progress.estimatedCost})
                </PhaseStep>
              </PhaseIndicator>
            )}
          </ProgressSection>
        )}

        {logs.length > 0 && (
          <div>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
              📋 Operation Log
            </h4>
            <LogContainer>
              {logs.map((log, index) => (
                <LogEntry key={index} className={log.type}>
                  [{log.timestamp}] {log.message}
                </LogEntry>
              ))}
            </LogContainer>
          </div>
        )}

        {renderResults()}

        <ActionButtons>
          {isCompleted ? (
            <ActionButton className="primary" onClick={onClose}>
              Close
            </ActionButton>
          ) : allowCancel ? (
            <ActionButton className="secondary" onClick={onClose}>
              Cancel
            </ActionButton>
          ) : (
            <ActionButton className="secondary" disabled>
              Running...
            </ActionButton>
          )}
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProgressModal;