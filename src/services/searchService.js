// Search service to simulate PostgreSQL-compatible search functionality
// This mimics the search functions from the Streamlit dashboard

import axios from 'axios';

// Search similarity calculation
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  str1 = str1.toLowerCase().trim();
  str2 = str2.toLowerCase().trim();
  
  if (str1 === str2) return 1;
  
  // Simple substring matching for demo
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.8;
  }
  
  // Basic character matching
  const chars1 = str1.split('');
  const chars2 = str2.split('');
  const commonChars = chars1.filter(char => chars2.includes(char));
  
  return commonChars.length / Math.max(chars1.length, chars2.length);
};

// Song search functionality
export const searchSongs = async (searchTerm, limit = 50) => {
  const res = await axios.get('http://localhost:8000/search/songs', {
    params: { q: searchTerm, limit }
  });
  return res.data;
};

// Artist search functionality
export const searchArtists = async (searchTerm, limit = 50) => {
  const res = await axios.get('http://localhost:8000/search/artists', {
    params: { q: searchTerm, limit }
  });
  return res.data;
};

// Get song variants/aliases
export const getSongVariants = async (songId) => {
  const res = await axios.get(`http://localhost:8000/variants/song/${songId}`);
  return res.data;
};

// Get artist variants/aliases
export const getArtistVariants = async (artistId) => {
  const res = await axios.get(`http://localhost:8000/variants/artist/${artistId}`);
  return res.data;
};

// Advanced search with filters
export const advancedSearch = async (query, filters = {}) => {
  // TODO: Implement this endpoint in FastAPI and update here
  throw new Error('Advanced search API not implemented');
};

// Search suggestions/autocomplete
export const getSearchSuggestions = async (query) => {
  // TODO: Implement this endpoint in FastAPI and update here
  return [];
};