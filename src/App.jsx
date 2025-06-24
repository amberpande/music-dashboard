import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/common/Header';
import StatusBar from './components/common/StatusBar';
import OverviewTab from './components/tabs/OverviewTab';
import ArtistAnalyticsTab from './components/tabs/ArtistAnalyticsTab';
import SearchTab from './components/tabs/SearchTab';
import DatabaseFixesTab from './components/tabs/DatabaseFixesTab';
import SchemaPerformanceTab from './components/tabs/SchemaPerformanceTab';
import BusinessIntelligenceTab from './components/tabs/BusinessIntelligenceTab';

// Styles
import './styles/globals.css';
import './styles/components.css';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  background-image: var(--gradient-mesh);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: var(--space-8) 0;
  position: relative;
  z-index: 1;
`;

const TabsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  
  .react-tabs {
    font-family: var(--font-family-display);
  }
  
  .react-tabs__tab-list {
    border-bottom: 1px solid var(--border-color) !important;
    margin: 0 0 var(--space-8) 0 !important;
    padding: 0 !important;
    display: flex !important;
    flex-wrap: nowrap !important;
    gap: var(--space-2) !important;
    background: var(--bg-card) !important;
    border-radius: var(--radius-2xl) !important;
    padding: var(--space-2) !important;
    backdrop-filter: blur(16px) !important;
    box-shadow: var(--shadow-lg) !important;
    border: 1px solid var(--border-color) !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    white-space: nowrap !important;
    scrollbar-width: thin;
    scrollbar-color: var(--border-color) var(--bg-secondary);
  }
  
  .react-tabs__tab {
    background: transparent !important;
    border: none !important;
    border-radius: var(--radius-xl) !important;
    padding: var(--space-3) var(--space-6) !important;
    cursor: pointer !important;
    font-weight: 500 !important;
    color: var(--text-secondary) !important;
    transition: all var(--transition-normal) !important;
    white-space: nowrap !important;
    list-style: none !important;
    position: relative !important;
    overflow: hidden !important;
    font-size: 0.875rem !important;
    display: flex !important;
    align-items: center !important;
    gap: var(--space-2) !important;
    
    @media (max-width: 576px) {
      padding: var(--space-2) var(--space-4) !important;
      font-size: 0.75rem !important;
    }
    
    &::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: var(--gradient-primary) !important;
      opacity: 0 !important;
      transition: opacity var(--transition-normal) !important;
      border-radius: var(--radius-xl) !important;
    }
    
    &:hover {
      color: var(--text-primary) !important;
      transform: translateY(-1px) !important;
    }
    
    &:hover::before {
      opacity: 0.1 !important;
    }
    
    &.react-tabs__tab--selected {
      color: white !important;
      background: var(--gradient-primary) !important;
      transform: translateY(-1px) !important;
      box-shadow: var(--shadow-lg) !important;
      border: none !important;
    }
    
    &.react-tabs__tab--selected::before {
      opacity: 0 !important;
    }
  }
  
  .react-tabs__tab-panel {
    min-height: 400px !important;
    animation: fadeInUp 0.3s ease-out !important;
    padding-top: var(--space-4) !important;
  }
  
  @media (max-width: 768px) {
    .react-tabs__tab-list {
      justify-content: flex-start !important;
      padding: var(--space-1) !important;
      gap: var(--space-1) !important;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'all' : 'none'};
  transition: opacity var(--transition-normal);
`;

const LoadingContent = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  text-align: center;
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-xl);
  transform: scale(${props => props.show ? 1 : 0.9});
  transition: transform var(--transition-normal);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-left: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4) auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: var(--space-2);
`;

const LoadingSubtext = styled.div`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Simulate data refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    toast.info('🔄 Refreshing dashboard data...', {
      position: "top-right",
      autoClose: 2000,
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      }
    });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastRefresh(Date.now());
      setRefreshTrigger(prev => prev + 1); // Trigger refresh in child components
      toast.success('✅ Dashboard refreshed successfully!', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--success-color)',
        }
      });
    } catch (error) {
      toast.error('❌ Failed to refresh dashboard', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--error-color)',
        }
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check connection status on mount
  useEffect(() => {
    // Simulate connection check
    const checkConnection = async () => {
      try {
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const tabsData = [
    { 
      label: 'Overview', 
      icon: '📊',
      description: 'Core metrics and health'
    },
    { 
      label: 'Artist Analysis', 
      icon: '🎤',
      description: 'Performance analytics'
    },
    { 
      label: 'Search & Variants', 
      icon: '🔍',
      description: 'Find and explore'
    },
    { 
      label: 'Database Fixes', 
      icon: '🔧',
      description: 'Repair and enhance'
    },
    { 
      label: 'Schema & Performance', 
      icon: '🏗️',
      description: 'Structure analysis'
    },
    { 
      label: 'Business Intelligence', 
      icon: '📈',
      description: 'Strategic insights'
    },
  ];

  return (
    <AppContainer>
      <Header 
        onRefresh={handleRefresh} 
        isLoading={isLoading}
      />
      
      <MainContent>
        <TabsContainer>
          <Tabs
            selectedIndex={activeTabIndex}
            onSelect={setActiveTabIndex}
          >
            <TabList>
              {tabsData.map((tab, index) => (
                <Tab key={index}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Tab>
              ))}
            </TabList>

            {/* Overview Tab */}
            <TabPanel>
              <OverviewTab refreshTrigger={refreshTrigger} />
            </TabPanel>

            {/* Artist Analysis Tab */}
            <TabPanel>
              <ArtistAnalyticsTab refreshTrigger={refreshTrigger} />
            </TabPanel>

            {/* Search & Variants Tab */}
            <TabPanel>
              <SearchTab refreshTrigger={refreshTrigger} />
            </TabPanel>

            {/* Database Fixes Tab */}
            <TabPanel>
              <DatabaseFixesTab refreshTrigger={refreshTrigger} />
            </TabPanel>

            {/* Schema & Performance Tab */}
            <TabPanel>
              <SchemaPerformanceTab refreshTrigger={refreshTrigger} />
            </TabPanel>

            {/* Business Intelligence Tab */}
            <TabPanel>
              <BusinessIntelligenceTab refreshTrigger={refreshTrigger} />
            </TabPanel>
          </Tabs>
        </TabsContainer>
      </MainContent>
      
      <StatusBar 
        dbHost="localhost"
        dbName="music_db"
        lastRefresh={lastRefresh}
        isConnected={isConnected}
      />
      
      <LoadingOverlay show={isLoading}>
        <LoadingContent show={isLoading}>
          <LoadingSpinner />
          <LoadingText>Refreshing Data</LoadingText>
          <LoadingSubtext>Please wait while we update your dashboard...</LoadingSubtext>
        </LoadingContent>
      </LoadingOverlay>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          backdropFilter: 'blur(16px)',
        }}
      />
    </AppContainer>
  );
}

export default App;