export type TweetAlign = 'start' | 'center' | 'end';
export type TweetTheme = 'light' | 'dark';

export type TweetEmbedOptions = {
  align?: TweetAlign;
  theme?: TweetTheme;
  /** data-media-max-width — default 560, big ~680 */
  width?: number;
  big?: boolean;
};

const STATUS_URL_RE =
  /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^/\s"'<>]+\/status\/(\d+)/i;

const TWITTER_SCRIPT_RE =
  /<script\b[^>]*\bsrc=["']https?:\/\/platform\.(?:twitter|x)\.com\/widgets\.js["'][^>]*>\s*<\/script>/gi;

/** Strip widgets.js from a pasted Twitter/X embed. */
export function stripTwitterEmbedScript(html: string): string {
  return html.replace(TWITTER_SCRIPT_RE, '').trim();
}

/** Extract first status URL from embed HTML or bare URL text. */
export function extractTweetStatusUrl(input: string): string | null {
  const match = input.match(STATUS_URL_RE);
  if (!match) return null;
  // Normalize to https://x.com/.../status/ID
  const id = match[1];
  const userMatch = match[0].match(/(?:twitter|x)\.com\/([^/]+)\//i);
  const user = userMatch?.[1] ?? 'i';
  return `https://x.com/${user}/status/${id}`;
}

export function resolveTweetWidth(opts: TweetEmbedOptions): number {
  if (opts.width && opts.width > 0) return opts.width;
  return opts.big ? 680 : 560;
}

/**
 * Compact source format (no script, no fat HTML):
 *   ![tweet](https://x.com/user/status/ID){ align=end theme=dark width=680 }
 */
export function toTweetShortMarkdown(statusUrl: string, opts: TweetEmbedOptions = {}): string {
  const align = opts.align ?? 'center';
  const theme = opts.theme ?? 'light';
  const width = resolveTweetWidth(opts);
  const attrs = [`align=${align}`, `theme=${theme}`, `width=${width}`];
  return `![tweet](${statusUrl}){ ${attrs.join(' ')} }`;
}

/** Parse pasted embed + UI options → short markdown ready for Quill/preview. */
export function formatTwitterEmbedPaste(
  paste: string,
  opts: TweetEmbedOptions = {},
): { ok: true; markdown: string; statusUrl: string } | { ok: false; error: string } {
  const cleaned = stripTwitterEmbedScript(paste);
  const statusUrl = extractTweetStatusUrl(cleaned) ?? extractTweetStatusUrl(paste);
  if (!statusUrl) {
    return {
      ok: false,
      error: 'No se encontró un link de status (x.com/.../status/ID) en el embed.',
    };
  }
  return {
    ok: true,
    statusUrl,
    markdown: toTweetShortMarkdown(statusUrl, opts),
  };
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function parseAttrBlock(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!block?.trim()) return out;
  for (const m of block.matchAll(/(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4];
  }
  return out;
}

/**
 * Expand ![tweet](statusUrl){ align=... theme=... width=... } → blockquote HTML
 * (widgets.js hydrates it; script stays out of the source).
 */
export function expandTweetMarkdown(md: string): string {
  return md.replace(
    /!\[tweet\]\(\s*<?([^\s)>]+)>?(?:\s+"([^"]*)")?\s*\)(?:\{([^}]*)\})?/gi,
    (_full, url: string, _title?: string, attrBlock?: string) => {
      const attrs = parseAttrBlock(attrBlock ?? '');
      const statusUrl = extractTweetStatusUrl(url) ?? url;
      if (!STATUS_URL_RE.test(statusUrl)) {
        return _full;
      }

      const align = (attrs.align || 'center').toLowerCase();
      const theme = (attrs.theme || 'light').toLowerCase() === 'dark' ? 'dark' : 'light';
      const width = Number(attrs.width) > 0 ? Number(attrs.width) : 560;

      const alignClass =
        align === 'end' || align === 'right'
          ? 'tweet-embed--end'
          : align === 'start' || align === 'left'
            ? 'tweet-embed--start'
            : 'tweet-embed--center';

      return [
        `<div class="tweet-embed ${alignClass}">`,
        `<blockquote class="twitter-tweet" data-theme="${theme}" data-media-max-width="${width}">`,
        `<a href="${escapeAttr(statusUrl)}">${escapeAttr(statusUrl)}</a>`,
        `</blockquote>`,
        `</div>`,
      ].join('');
    },
  );
}

/** If someone pasted a raw blockquote (no script), keep it and drop any leftover script. */
export function normalizeRawTweetBlockquotes(html: string): string {
  return stripTwitterEmbedScript(html);
}
