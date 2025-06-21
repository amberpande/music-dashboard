import React from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';

const ChartsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const ChartTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
`;

const InsightBox = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 2px dashed var(--border-color);
`;

const YearGenreCharts = ({ 
  yearDistribution = [], 
  topGenres = [] 
}) => {
  // Year distribution chart data
  const yearData = yearDistribution.length > 0 ? {
    x: yearDistribution.map(item => item.year),
    y: yearDistribution.map(item => item.count),
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: '#667eea',
      width: 3,
      shape: 'spline'
    },
    marker: {
      color: '#667eea',
      size: 6,
      line: {
        color: '#ffffff',
        width: 2
      }
    },
    fill: 'tonexty',
    fillcolor: 'rgba(102, 126, 234, 0.1)',
    hovertemplate: '<b>Year: %{x}</b><br>Songs: %{y}<extra></extra>'
  } : null;

  const yearLayout = {
    title: {
      text: 'Songs by Release Year',
      font: { family: 'Source Sans Pro', size: 14, color: 'var(--text-primary)' }
    },
    xaxis: {
      title: 'Release Year',
      gridcolor: 'rgba(0,0,0,0.1)',
      font: { family: 'Source Sans Pro' }
    },
    yaxis: {
      title: 'Number of Songs',
      gridcolor: 'rgba(0,0,0,0.1)',
      font: { family: 'Source Sans Pro' }
    },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' }
  };

  // Genre chart data
  const genreData = topGenres.length > 0 ? {
    x: topGenres.map(genre => genre.count),
    y: topGenres.map(genre => genre.name),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: topGenres.map((_, index) => {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
        return colors[index % colors.length];
      }),
      line: {
        color: '#ffffff',
        width: 1
      }
    },
    text: topGenres.map(genre => genre.count.toLocaleString()),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>Songs: %{x}<extra></extra>'
  } : null;

  const genreLayout = {
    title: {
      text: 'Most Popular Genres',
      font: { family: 'Source Sans Pro', size: 14, color: 'var(--text-primary)' }
    },
    xaxis: {
      title: 'Number of Songs',
      gridcolor: 'rgba(0,0,0,0.1)',
      font: { family: 'Source Sans Pro' }
    },
    yaxis: {
      categoryorder: 'total ascending',
      font: { family: 'Source Sans Pro' }
    },
    margin: { l: 100, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' }
  };

  // Calculate insights
  const yearInsights = yearDistribution.length > 0 ? {
    earliestYear: Math.min(...yearDistribution.map(item => item.year)),
    latestYear: Math.max(...yearDistribution.map(item => item.year)),
    peakYear: yearDistribution.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    ),
    totalYears: yearDistribution.length
  } : null;

  const genreInsights = topGenres.length > 0 ? {
    topGenre: topGenres[0],
    totalGenreSongs: topGenres.reduce((sum, genre) => sum + genre.count, 0),
    genreCount: topGenres.length
  } : null;

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true
  };

  return (
    <ChartsContainer>
      <SectionTitle>📅 Temporal and Genre Analysis</SectionTitle>
      
      <ChartsGrid>
        <ChartContainer>
          <ChartTitle>📅 Release Year Distribution</ChartTitle>
          {yearDistribution.length > 0 ? (
            <>
              <Plot
                data={[yearData]}
                layout={yearLayout}
                config={plotConfig}
                style={{ width: '100%', height: '400px' }}
                useResizeHandler={true}
              />
              {yearInsights && (
                <InsightBox>
                  <strong>📊 Temporal Insights:</strong>
                  <br />
                  • Time span: {yearInsights.earliestYear} - {yearInsights.latestYear}
                  <br />
                  • Peak year: {yearInsights.peakYear.year} ({yearInsights.peakYear.count.toLocaleString()} songs)
                  <br />
                  • Total years covered: {yearInsights.latestYear - yearInsights.earliestYear + 1}
                </InsightBox>
              )}
            </>
          ) : (
            <NoDataMessage>
              ⚠️ No release year data available
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
                This could mean the 'release_year' column doesn't exist or contains no data
              </div>
            </NoDataMessage>
          )}
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>🎵 Top Genres</ChartTitle>
          {topGenres.length > 0 ? (
            <>
              <Plot
                data={[genreData]}
                layout={genreLayout}
                config={plotConfig}
                style={{ width: '100%', height: '400px' }}
                useResizeHandler={true}
              />
              {genreInsights && (
                <InsightBox>
                  <strong>🎯 Genre Insights:</strong>
                  <br />
                  • Top genre: {genreInsights.topGenre.name} ({genreInsights.topGenre.count.toLocaleString()} songs)
                  <br />
                  • Market share: {((genreInsights.topGenre.count / genreInsights.totalGenreSongs) * 100).toFixed(1)}% of categorized songs
                  <br />
                  • Genres tracked: {genreInsights.genreCount}
                </InsightBox>
              )}
            </>
          ) : (
            <NoDataMessage>
              ⚠️ No genre data available
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
                This could mean the genre tables don't exist or contain no data
              </div>
            </NoDataMessage>
          )}
        </ChartContainer>
      </ChartsGrid>
    </ChartsContainer>
  );
};

export default YearGenreCharts;