import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ProgressModal from '../fixes/ProgressModal';
import { 
  fetchDatabaseIssues,
  fetchDatabaseStats,
  fetchSecondaryArtistStats,
  simulateNetworkError 
} from '../../services/mockData';
import { 
  executeFixOperation,
  executeComprehensiveFix,
  executeAIDeduplication,
  getOperationName,
  getOperationDescription,
  getOperationImpact
} from '../../services/fixService';

const FixesContainer = styled.div`
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

const FixesHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FixesTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const FixesSubtitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:first-child {
    margin-top: 0;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FixOperationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FixOperationCard = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const OperationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OperationIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || 'var(--accent-color)'};
  color: white;
`;

const OperationInfo = styled.div`
  flex: 1;
`;

const OperationTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
`;

const OperationSubtitle = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ImpactBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.high {
    background: #fee2e2;
    color: #991b1b;
  }
  
  &.medium {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.enhancement {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.critical {
    background: #f3e8ff;
    color: #6b21a8;
  }
`;

const OperationDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 1rem 0;
`;

const OperationActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
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
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover:not(:disabled) {
      background: var(--bg-primary);
      transform: translateY(-1px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ComprehensiveFixSection = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin: 2rem 0;
`;

const ComprehensiveTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ComprehensiveDescription = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const ComprehensiveStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
`;

const AlertCard = styled.div`
  background: ${props => {
    if (props.type === 'success') return 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
    if (props.type === 'warning') return 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)';
    if (props.type === 'danger') return 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
    return 'linear-gradient(135deg, #cff4fc 0%, #b6effb 100%)';
  }};
  border: 1px solid ${props => {
    if (props.type === 'success') return '#badbcc';
    if (props.type === 'warning') return '#ffecb5';
    if (props.type === 'danger') return '#f5c2c7';
    return '#b6effb';
  }};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  color: ${props => {
    if (props.type === 'success') return '#0f5132';
    if (props.type === 'warning') return '#664d03';
    if (props.type === 'danger') return '#842029';
    return '#055160';
  }};
`;

const DatabaseFixesTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    issues: {},
    secondaryStats: {}
  });
  
  // Progress modal state
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [operationResults, setOperationResults] = useState(null);
  const [isOperationComplete, setIsOperationComplete] = useState(false);
  const [currentOperation, setCurrentOperation] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      simulateNetworkError();
      
      const [issues, stats, secondaryStats] = await Promise.all([
        fetchDatabaseIssues(),
        fetchDatabaseStats(),
        fetchSecondaryArtistStats()
      ]);
      
      setData({ issues, secondaryStats });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleFixOperation = async (operationType, settings = {}) => {
    setCurrentOperation(operationType);
    setShowProgress(true);
    setIsOperationComplete(false);
    setProgressData(null);
    setOperationResults(null);

    try {
      let result;
      
      if (operationType === 'comprehensive') {
        result = await executeComprehensiveFix((progress) => {
          setProgressData(progress);
        });
      } else if (operationType.startsWith('ai_')) {
        const type = operationType.includes('artists') ? 'artists' : 'songs';
        result = await executeAIDeduplication(type, settings, (progress) => {
          setProgressData(progress);
        });
      } else {
        result = await executeFixOperation(operationType, (progress) => {
          setProgressData(progress);
        });
      }

      setOperationResults(result);
      setIsOperationComplete(true);
      
      // Reload data after successful operation
      setTimeout(() => {
        loadData();
      }, 1000);

    } catch (error) {
      setError(error.message);
      setShowProgress(false);
    }
  };

  const closeProgressModal = () => {
    setShowProgress(false);
    setProgressData(null);
    setOperationResults(null);
    setIsOperationComplete(false);
    setCurrentOperation(null);
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="large"
        text="Loading database health status..."
        subtext="Analyzing current issues and preparing fix operations"
        showDots={true}
      />
    );
  }

  if (error) {
    return (
      <AlertCard type="danger">
        <h4>⚠️ Connection Error</h4>
        <p>Failed to load database status: {error}</p>
        <button 
          className="btn btn-danger btn-sm"
          onClick={loadData}
          style={{ marginTop: '0.5rem' }}
        >
          Retry Connection
        </button>
      </AlertCard>
    );
  }

  const { issues, secondaryStats } = data;
  const totalIssues = Object.values(issues).reduce((sum, val) => sum + val, 0);

  // Calculate health status
  const getHealthStatus = () => {
    if (totalIssues === 0) return { type: 'success', text: 'Excellent', icon: '🟢' };
    if (totalIssues < 100) return { type: 'warning', text: 'Good', icon: '🟡' };
    return { type: 'danger', text: 'Needs Attention', icon: '🔴' };
  };

  const healthStatus = getHealthStatus();

  // Define fix operations
  const fixOperations = [
    {
      id: 'missing_primary',
      title: 'Missing Primary Artists',
      subtitle: `${issues.missing_primary || 0} issues found`,
      description: 'Fixes songs without primary artist relationships by deleting invalid records and creating proper relationships for valid songs.',
      icon: '🎯',
      impact: getOperationImpact('missing_primary'),
      disabled: (issues.missing_primary || 0) === 0
    },
    {
      id: 'orphaned_songs',
      title: 'Orphaned Songs',
      subtitle: `${issues.orphaned_songs || 0} issues found`,
      description: 'Creates artist relationships for songs that have no artist connections in the database.',
      icon: '🏠',
      impact: getOperationImpact('orphaned_songs'),
      disabled: (issues.orphaned_songs || 0) === 0
    },
    {
      id: 'inconsistent_artists',
      title: 'Artist Inconsistencies',
      subtitle: `${issues.inconsistent_artists || 0} issues found`,
      description: 'Updates song-artist relationships to use correct artist names when metadata and relationships don\'t match.',
      icon: '🔧',
      impact: getOperationImpact('inconsistent_artists'),
      disabled: (issues.inconsistent_artists || 0) === 0
    },
    {
      id: 'missing_secondary',
      title: 'Missing Secondary Artists',
      subtitle: `${secondaryStats.missing_relationships || 0} issues found`,
      description: 'Creates secondary/featured artist relationships based on artist_n metadata in songs.',
      icon: '🎼',
      impact: getOperationImpact('missing_secondary'),
      disabled: (secondaryStats.missing_relationships || 0) === 0
    }
  ];

  return (
    <FixesContainer>
      <FixesHeader>
        <FixesTitle>🔧 Database Fixes & Deduplication</FixesTitle>
        <FixesSubtitle>
          Traditional database repair operations and AI-enhanced deduplication tools
        </FixesSubtitle>
      </FixesHeader>

      <SectionTitle>🏥 Database Health Assessment</SectionTitle>
      
      <AlertCard type={healthStatus.type}>
        <h4>{healthStatus.icon} {healthStatus.text} - Database Health Status</h4>
        <p>
          {totalIssues === 0 
            ? "No critical issues detected - Your database is in perfect health and ready for AI optimization!"
            : totalIssues < 100 
            ? `${totalIssues} issues found that should be addressed for optimal performance.`
            : `${totalIssues} critical issues require immediate attention before AI operations.`
          }
        </p>
      </AlertCard>

      <MetricsGrid>
        <MetricCard
          title="Missing Primary Artists"
          value={issues.missing_primary || 0}
          delta={issues.missing_primary === 0 ? "All good" : "Needs attention"}
          deltaColor={issues.missing_primary === 0 ? 'normal' : 'inverse'}
          icon="🎯"
          help="Songs without primary artist relationships"
        />
        <MetricCard
          title="Orphaned Songs"
          value={issues.orphaned_songs || 0}
          delta={issues.orphaned_songs === 0 ? "All good" : "Needs attention"}
          deltaColor={issues.orphaned_songs === 0 ? 'normal' : 'inverse'}
          icon="🏠"
          help="Songs without any artist relationships"
        />
        <MetricCard
          title="Artist Inconsistencies"
          value={issues.inconsistent_artists || 0}
          delta={issues.inconsistent_artists === 0 ? "All good" : "Needs attention"}
          deltaColor={issues.inconsistent_artists === 0 ? 'normal' : 'inverse'}
          icon="🔧"
          help="Mismatched artist names between metadata and relationships"
        />
        <MetricCard
          title="Missing Secondary Artists"
          value={secondaryStats.missing_relationships || 0}
          delta={secondaryStats.missing_relationships === 0 ? "All good" : "Needs attention"}
          deltaColor={secondaryStats.missing_relationships === 0 ? 'normal' : 'inverse'}
          icon="🎼"
          help="Missing featured artist relationships"
        />
      </MetricsGrid>

      <SectionTitle>🛠️ Individual Fix Operations</SectionTitle>
      
      <FixOperationsGrid>
        {fixOperations.map((operation) => (
          <FixOperationCard key={operation.id}>
            <OperationHeader>
              <OperationIcon color={operation.impact.color}>
                {operation.impact.icon}
              </OperationIcon>
              <OperationInfo>
                <OperationTitle>{operation.title}</OperationTitle>
                <OperationSubtitle>{operation.subtitle}</OperationSubtitle>
                <ImpactBadge className={operation.impact.level}>
                  {operation.impact.level} Impact
                </ImpactBadge>
              </OperationInfo>
            </OperationHeader>
            
            <OperationDescription>
              {operation.description}
            </OperationDescription>
            
            <OperationActions>
              <ActionButton
                className="primary"
                onClick={() => handleFixOperation(operation.id)}
                disabled={operation.disabled}
              >
                {operation.disabled ? 'No Issues Found' : 'Run Fix'}
              </ActionButton>
              <ActionButton className="secondary" disabled>
                Preview
              </ActionButton>
            </OperationActions>
          </FixOperationCard>
        ))}
      </FixOperationsGrid>

      {totalIssues > 0 && (
        <ComprehensiveFixSection>
          <ComprehensiveTitle>
            🚀 Comprehensive Database Enhancement
          </ComprehensiveTitle>
          <ComprehensiveDescription>
            Run all traditional fixes in sequence for complete database health restoration.
            This will address all {totalIssues} issues found across the database.
          </ComprehensiveDescription>
          
          <ComprehensiveStats>
            <StatCard>
              <StatValue>{issues.missing_primary || 0}</StatValue>
              <StatLabel>Missing Primary</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{issues.orphaned_songs || 0}</StatValue>
              <StatLabel>Orphaned Songs</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{issues.inconsistent_artists || 0}</StatValue>
              <StatLabel>Inconsistencies</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{secondaryStats.missing_relationships || 0}</StatValue>
              <StatLabel>Missing Secondary</StatLabel>
            </StatCard>
          </ComprehensiveStats>
          
          <OperationActions>
            <ActionButton
              className="primary"
              onClick={() => handleFixOperation('comprehensive')}
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              🚀 Run Comprehensive Fix
            </ActionButton>
          </OperationActions>
        </ComprehensiveFixSection>
      )}

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgress}
        onClose={closeProgressModal}
        title={getOperationName(currentOperation)}
        progress={progressData}
        results={operationResults}
        isCompleted={isOperationComplete}
        operationType={currentOperation}
        allowCancel={false}
      />
    </FixesContainer>
  );
};

export default DatabaseFixesTab;