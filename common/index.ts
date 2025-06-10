export { sectionData, getSectionData } from './section';
export { getEmotesData, setEmotesData } from './emotes';

export const URLS = {
  API: process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : process.env.API_URL,
};
