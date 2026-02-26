import newsEventsData from '../data/newsEventsData.json';

export const useContentBySlug = (slug) => {
  const createSlug = (text) => 
    text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
  
  return newsEventsData.find(item => createSlug(item.title) === slug);
};