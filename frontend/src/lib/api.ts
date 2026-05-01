import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export const wsUrl = `${API_URL.replace(/^http/, 'ws')}/ws/metrics`;
export const videoFeedUrl = `${API_URL}/video-feed`;
