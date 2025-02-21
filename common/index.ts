export { sectionData, getSectionData } from './section'
export { EMOTES_URL } from './emotes'

export const URLS = {
    API: process.env.NODE_ENV === "development" ? "http://localhost:8787/survey" : process.env.API_URL,
}