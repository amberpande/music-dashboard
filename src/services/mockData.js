// API service to fetch dashboard data from FastAPI backend using axios
import axios from 'axios';

export const fetchDatabaseStats = async () => {
  const res = await axios.get('http://localhost:8000/stats');
  return res.data;
};

export const fetchSecondaryArtistStats = async () => {
  const res = await axios.get('http://localhost:8000/secondary-stats');
  return res.data;
};

export const fetchDeduplicationStats = async () => {
  const res = await axios.get('http://localhost:8000/deduplication-stats');
  return res.data;
};

export const fetchDatabaseIssues = async () => {
  const res = await axios.get('http://localhost:8000/issues');
  return res.data;
};

export const fetchTopArtists = async () => {
  const res = await axios.get('http://localhost:8000/top-artists');
  return res.data;
};

export const fetchDistributionData = async () => {
  const res = await axios.get('http://localhost:8000/distribution');
  return res.data;
};

export const fetchYearDistribution = async () => {
  const res = await axios.get('http://localhost:8000/year-distribution');
  return res.data;
};

export const fetchTopGenres = async () => {
  const res = await axios.get('http://localhost:8000/top-genres');
  return res.data;
};

export const fetchRecentSongs = async () => {
  const res = await axios.get('http://localhost:8000/recent-songs');
  return res.data;
};
