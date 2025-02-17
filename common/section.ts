import { Section } from "@/store";

interface SectionData {
    key: Section;
    title: string;
    tinyTitle: string;
    icon: string;
    order: number;
}

export const sectionData: Record<string, SectionData> = {
    [Section.LIKED]: {
        key: Section.LIKED,
        title: "¿Cuál ha sido el capitulo que más ha gustado de la semana?",
        tinyTitle: "Mas gustados 👍",
        icon: "👍",
        order: 1
    },
    [Section.DISLIKED]: {
        key: Section.DISLIKED,
        title: "¿Cuál ha sido el capitulo que menos ha gustado de la semana?",
        tinyTitle: "Menos gustados 👎",
        icon: "👎",
        order: 2
    },
    [Section.COMMENT]: {
        key: Section.COMMENT,
        title: "Comentarios semanales",
        tinyTitle: "Comentarios 💬",
        icon: "💬",
        order: 3
    }
}

export function getSectionData(section: Section) {
    return sectionData[section];
}