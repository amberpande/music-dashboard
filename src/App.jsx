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
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const TabsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  .react-tabs {
    font-family: inherit;
  }
  
  .react-tabs__tab-list {
    border-bottom: 2px solid var(--border-color);
    margin: 0 0 2rem 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  
  .react-tabs__tab {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-bottom: none;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 1rem 1.5rem;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    white-space: nowrap;
    
    @media (max-width: 576px) {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }
    
    &:hover {
      background: var(--bg-primary);
      color: var(--text-primary);
      transform: translateY(-2px);
    }
    
    &.react-tabs__tab--selected {
      background: var(--bg-primary);
      color: var(--text-primary);
      border-bottom: 2px solid var(--accent-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  .react-tabs__tab-panel {
    min-height: 400px;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PlaceholderContent = styled.div`
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  
  h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
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
    toast.info('Refreshing dashboard data...', {
      position: "top-right",
      autoClose: 2000,
    });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastRefresh(Date.now());
      setRefreshTrigger(prev => prev + 1); // Trigger refresh in child components
      toast.success('Dashboard refreshed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to refresh dashboard', {
        position: "top-right",
        autoClose: 3000,
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
    { label: '📊 Overview', icon: '📊' },
    { label: '🎤 Artist Analysis', icon: '🎤' },
    { label: '🔍 Search & Variants', icon: '🔍' },
    { label: '🔧 Database Fixes', icon: '🔧' },
    { label: '🏗️ Schema & Performance', icon: '🏗️' },
    { label: '📈 Business Intelligence', icon: '📈' },
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
                  <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                  {tab.label.replace(/^[^\s]+ /, '')}
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
        theme="light"
      />
    </AppContainer>
  );
}

export default App;