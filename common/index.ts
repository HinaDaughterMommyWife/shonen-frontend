export { sectionData, getSectionData } from './section';
export { getEmotesData, setEmotesData, subscribeEmotesData, EMOTES_TUTORIAL_IMAGE_URL } from './emotes';

export const URLS = {
  API: process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://survey-cache.hina-daughtermommywife-uoooh-sob.workers.dev',
};
