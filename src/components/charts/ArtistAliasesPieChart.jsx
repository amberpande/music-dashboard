import React from 'react';
import Plot from 'react-plotly.js';

const ArtistAliasesPieChart = ({ aliasStats = { withAliases: 0, withoutAliases: 0 } }) => {
  const values = [aliasStats.withAliases, aliasStats.withoutAliases];
  const labels = ['With Aliases', 'Without Aliases'];
  if (values[0] + values[1] === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No alias data available</div>;
  }
  return (
    <Plot
      data={[
        {
          values,
          labels,
          type: 'pie',
          marker: {
            colors: ['#10b981', '#fbbf24'],
            line: { color: '#fff', width: 2 },
          },
          textinfo: 'label+percent',
          textposition: 'auto',
        },
      ]}
      layout={{
        title: 'Artists With vs Without Aliases',
        margin: { l: 20, r: 20, t: 60, b: 20 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Source Sans Pro' },
        showlegend: true,
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '350px' }}
      useResizeHandler={true}
    />
  );
};

export default ArtistAliasesPieChart; 