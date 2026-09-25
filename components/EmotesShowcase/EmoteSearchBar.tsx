import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const MIN_SEARCH_LENGTH = 3;

interface EmoteSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onClearFilters: () => void;
}

export default function EmoteSearchBar({ searchQuery, onSearchQueryChange, onClearFilters }: EmoteSearchBarProps) {
  const tooShort = searchQuery.trim().length > 0 && searchQuery.trim().length < MIN_SEARCH_LENGTH;

  return (
    <div className="flex flex-col gap-small w-full max-w-screen-sm mx-auto">
      <div className="flex gap-small w-full">
        <Input
          value={searchQuery}
          onChange={e => onSearchQueryChange(e.target.value)}
          placeholder="Buscar emote..."
        />
        <Button type="button" variant="outline" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </div>
      <span className="text-xs text-gray-500 min-h-[1rem]">
        {tooShort ? `Mínimo ${MIN_SEARCH_LENGTH} letras para buscar.` : ''}
      </span>
    </div>
  );
}
