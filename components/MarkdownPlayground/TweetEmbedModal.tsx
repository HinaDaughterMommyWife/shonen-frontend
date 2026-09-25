'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  formatTwitterEmbedPaste,
  type TweetAlign,
  type TweetEmbedOptions,
} from '@/lib/twitterEmbed';

type TweetEmbedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (markdown: string) => void;
};

const ALIGNS: { id: TweetAlign; label: string }[] = [
  { id: 'start', label: 'Start' },
  { id: 'center', label: 'Center' },
  { id: 'end', label: 'End' },
];

export default function TweetEmbedModal({ open, onOpenChange, onInsert }: TweetEmbedModalProps) {
  const [paste, setPaste] = useState('');
  const [align, setAlign] = useState<TweetAlign>('center');
  const [dark, setDark] = useState(false);
  const [big, setBig] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const opts: TweetEmbedOptions = useMemo(
    () => ({ align, theme: dark ? 'dark' : 'light', big }),
    [align, dark, big],
  );

  const previewShort = useMemo(() => {
    if (!paste.trim()) return '';
    const result = formatTwitterEmbedPaste(paste, opts);
    return result.ok ? result.markdown : '';
  }, [paste, opts]);

  const handleInsert = () => {
    const result = formatTwitterEmbedPaste(paste, opts);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onInsert(result.markdown);
    setPaste('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Twitter / X embed</DialogTitle>
          <DialogDescription>
            Pegá el embed completo. Se quita el {'<script>'} y se guarda un formato corto{' '}
            <code className="text-xs">![tweet](url){'{ ... }'}</code>.
          </DialogDescription>
        </DialogHeader>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Embed pegado</span>
          <textarea
            value={paste}
            onChange={(e) => {
              setPaste(e.target.value);
              setError(null);
            }}
            rows={7}
            placeholder='<blockquote class="twitter-tweet" ...>...</blockquote> <script ...></script>'
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
          />
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Align</span>
            {ALIGNS.map(({ id, label }) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={align === id ? 'default' : 'outline'}
                onClick={() => setAlign(id)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Theme</span>
            <Button
              type="button"
              size="sm"
              variant={!dark ? 'default' : 'outline'}
              onClick={() => setDark(false)}
            >
              Light
            </Button>
            <Button
              type="button"
              size="sm"
              variant={dark ? 'default' : 'outline'}
              onClick={() => setDark(true)}
            >
              Dark
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Size</span>
            <Button
              type="button"
              size="sm"
              variant={!big ? 'default' : 'outline'}
              onClick={() => setBig(false)}
            >
              Normal (560)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={big ? 'default' : 'outline'}
              onClick={() => setBig(true)}
            >
              Big (680)
            </Button>
          </div>
        </div>

        {previewShort ? (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="mb-1 text-xs text-muted-foreground">Se insertará:</p>
            <code className="break-all text-xs">{previewShort}</code>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleInsert} disabled={!paste.trim()}>
            Insertar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
