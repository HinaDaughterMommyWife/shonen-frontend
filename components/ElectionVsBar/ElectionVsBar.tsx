import { electionVsBarStyles as s } from './styles';
import './ElectionVsBar.css';

const CANDIDATES = {
  left: {
    name: 'Roberto Sánchez',
    party: 'Partido Juntos por el Perú',
    percent: 50.1,
    votes: 8_860_379,
    logo: 'https://resultadosegundavuelta.onpe.gob.pe/assets/img-reales/partidos/00000010.png',
  },
  right: {
    name: 'Keiko Fujimori',
    party: 'Partido Fuerza Popular',
    percent: 49.9,
    votes: 8_825_481,
    logo: 'https://resultadosegundavuelta.onpe.gob.pe/assets/img-reales/partidos/00000008.png',
  },
} as const;

const fmtVotes = (n: number) =>
  n.toLocaleString('es-PE', { maximumFractionDigits: 0 });

const fmtPercent = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ElectionVsBar() {
  const { left, right } = CANDIDATES;

  return (
    <div className={s.root}>
      <div className={s.candidatesRow}>
        <div className={s.candidate}>
          <img src={left.logo} alt={left.party} className={s.candidateLogo} />
          <span className={s.candidateName}>{left.name}</span>
          <span className={s.candidateParty}>{left.party}</span>
        </div>

        <div className={s.vsBadge}>VS</div>

        <div className={s.candidate}>
          <img src={right.logo} alt={right.party} className={s.candidateLogo} />
          <span className={s.candidateName}>{right.name}</span>
          <span className={s.candidateParty}>{right.party}</span>
        </div>
      </div>

      <div className={s.barTrack}>
        <div className={s.barLeft} style={{ width: `${left.percent}%` }} />
        <div className={s.barRight} />
      </div>

      <div className={s.statsRow}>
        <div className={s.statBlock}>
          <span className={`${s.statPercent} ${s.statPercentLeft}`}>
            {fmtPercent(left.percent)}%
          </span>
          <span className={s.statVotes}>{fmtVotes(left.votes)} votos</span>
        </div>

        <div className={s.statBlockRight}>
          <span className={`${s.statPercent} ${s.statPercentRight}`}>
            {fmtPercent(right.percent)}%
          </span>
          <span className={s.statVotes}>{fmtVotes(right.votes)} votos</span>
        </div>
      </div>
    </div>
  );
}
