export function generateDescendingScores(length: number): number[] {
    if (length <= 0) return [];

    const scores: number[] = [];
    let maxScore = (Math.floor(Math.random() * 100) + 1) + 60;
    let decayFactor = 0.92;

    for (let i = 0; i < length; i++) {
        scores.push(maxScore);
        maxScore = Math.max(1, Math.floor(maxScore * decayFactor));
    }

    return scores;
}

export function getTotalScore(scores: number[]): number {
    return scores.reduce((acc, score) => acc + score, 0);
}

export function getAverageScore(scores: number[]): number {
    const totalScore = getTotalScore(scores);
    return scores.length > 0 ? totalScore / scores.length : 0;
}