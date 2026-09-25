const MD_HINT =
  /(?:^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|\|)|(\*\*[^*\n]+\*\*|\*[^*\n]+\*|__[^_\n]+__|_[^_\n]+_|`[^`\n]+`|```)/m;

const HTML_TAG = /<\/?[a-z][\w:-]*\b[^>]*>/i;

export function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function looksLikeMarkdown(text: string): boolean {
  if (!text.trim()) return false;
  return MD_HINT.test(text);
}

function looksLikeHtml(content: string): boolean {
  if (!HTML_TAG.test(content)) return false;
  // Quill / real markup (not just a lone wrapper)
  if (/\bclass\s*=|\bstyle\s*=|<\/?(?:span|strong|em|ul|ol|li|h[1-6]|table|a|img)\b/i.test(content)) {
    return true;
  }
  const tagCount = (content.match(/<\/?[a-z][\w:-]*\b[^>]*>/gi) ?? []).length;
  return tagCount >= 2;
}

function beautifyMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = /^(\s*)```/.test(line);
    if (fence) inFence = !inFence;

    if (inFence || fence) {
      out.push(line.replace(/\s+$/, ''));
      continue;
    }

    let next = line.replace(/\s+$/, '');

    // Normalize ATX headings: "#Foo" -> "# Foo"
    next = next.replace(/^(\s{0,3}#{1,6})([^#\s])/, '$1 $2');
    // Collapse spaces after list markers
    next = next.replace(/^(\s*(?:[-*+]|\d+\.)\s)\s+/, '$1');
    // Trim trailing spaces inside table cells lightly
    if (next.includes('|')) {
      next = next
        .split('|')
        .map((cell, idx, arr) => {
          if (idx === 0 || idx === arr.length - 1) return cell;
          return ` ${cell.trim()} `;
        })
        .join('|')
        .replace(/\|\s+\|/g, '| |');
    }

    out.push(next);
  }

  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

/**
 * Pretty-print HTML tags only. Text nodes are preserved byte-for-byte
 * (no trim, no indent) so Quill round-trips don't gain spaces on aligned text.
 */
function beautifyHtml(html: string): string {
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  const parts = html.match(/<[^>]+>|[^<]+/g) ?? [html];
  const out: string[] = [];

  for (const part of parts) {
    if (!part.startsWith('<')) {
      // text / whitespace between tags — never modify
      out.push(part);
      continue;
    }

    if (part.startsWith('<!--')) {
      out.push(part);
      continue;
    }

    const close = /^<\/\s*([a-z][\w:-]*)\s*>/i.exec(part);
    if (close) {
      out.push(`</${close[1].toLowerCase()}>`);
      continue;
    }

    const open = /^<\s*([a-z][\w:-]*)\b([^>]*)>/i.exec(part);
    if (open) {
      const name = open[1].toLowerCase();
      let attrs = (open[2] || '').trim();
      if (attrs) {
        attrs = attrs
          .replace(/\s+/g, ' ')
          .replace(/\s*=\s*/g, '=')
          .replace(/\s*\/\s*$/, '');
        attrs = ` ${attrs}`;
      }
      const selfClosing = /\/>$/.test(part) || voidTags.has(name);
      out.push(selfClosing ? `<${name}${attrs} />` : `<${name}${attrs}>`);
      continue;
    }

    out.push(part);
  }

  // Newlines only *between* block tags (outside text nodes)
  return out
    .join('')
    .replace(
      /<\/(p|div|h[1-6]|ul|ol|li|table|thead|tbody|tr|blockquote|pre|section|article|header|footer)>(?=<)/gi,
      '</$1>\n',
    );
}

export type BeautyKind = 'html' | 'markdown' | 'plain';

export function detectContentKind(content: string): BeautyKind {
  const trimmed = content.trim();
  if (!trimmed) return 'plain';

  const text = stripTags(trimmed);
  const html = looksLikeHtml(trimmed);
  const md = looksLikeMarkdown(text) || looksLikeMarkdown(trimmed);
  const hasQuillMarkup = /\bql-(?:size|align)-/.test(trimmed);

  // Quill size/align classes must stay HTML so preview keeps formatting
  if (hasQuillMarkup) return 'html';
  if (html && !md) return 'html';
  if (md && !html) return 'markdown';
  if (html && md) {
    // Markdown typed inside Quill often sits in bare <p>…</p> wrappers
    const tagsOnly = trimmed.replace(/[^<>]+/g, '');
    const onlySimpleWrappers = /^(?:\s*<\/?(?:p|div|br\s*\/?)[^>]*>\s*)+$/i.test(tagsOnly);
    if (onlySimpleWrappers) return 'markdown';
    return 'html';
  }
  return 'plain';
}

/**
 * Intelligent pretty: formats HTML or Markdown depending on content.
 * Returns { kind, value } — for markdown, value is plain md (caller may wrap for Quill).
 */
export function beautifyContent(content: string): { kind: BeautyKind; value: string } {
  const kind = detectContentKind(content);

  if (kind === 'markdown') {
    const source = looksLikeHtml(content) ? stripTags(content) : content;
    return { kind, value: beautifyMarkdown(source) };
  }

  if (kind === 'html') {
    return { kind, value: beautifyHtml(content) };
  }

  return { kind: 'plain', value: content.trim() };
}

/** Wrap plain/markdown text into Quill-friendly paragraph HTML. */
export function markdownToQuillHtml(md: string): string {
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = block.replace(/\n/g, '<br>');
      return `<p>${withBreaks || '<br>'}</p>`;
    })
    .join('');
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Image-looking URLs (ext or known hosts — ufs.sh often has no extension). */
export function isLikelyImageUrl(url: string): boolean {
  if (/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?|#|$)/i.test(url)) return true;
  if (
    /(?:ufs\.sh\/f\/|imgur\.com\/|i\.ibb\.co\/|media\.tenor\.com\/|giphy\.com\/|cdn\.discordapp\.com\/|raw\.githubusercontent\.com\/)/i.test(
      url,
    )
  ) {
    return true;
  }
  return false;
}

function parseAttrBlock(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!block?.trim()) return out;
  for (const m of block.matchAll(/(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4];
  }
  return out;
}

function buildImgHtml(
  alt: string,
  url: string,
  opts: { width?: string; height?: string; title?: string; align?: string },
): string {
  const parts = [
    `src="${escapeAttr(url)}"`,
    `alt="${escapeAttr(alt)}"`,
    'class="md-preview-img"',
    'loading="lazy"',
  ];
  if (opts.title) parts.push(`title="${escapeAttr(opts.title)}"`);

  const styleBits: string[] = [];
  if (opts.width) {
    if (/%\s*$/.test(opts.width)) {
      styleBits.push(`width:${opts.width}`);
    } else {
      parts.push(`width="${escapeAttr(opts.width)}"`);
    }
  }
  if (opts.height) {
    if (/%\s*$/.test(opts.height)) {
      styleBits.push(`height:${opts.height}`);
    } else {
      parts.push(`height="${escapeAttr(opts.height)}"`);
    }
  }

  const align = (opts.align || '').toLowerCase();
  // center | right/end | left/start — block + margins (inline img ignores text-align alone)
  if (align === 'center' || align === 'middle') {
    styleBits.push('display:block', 'margin-left:auto', 'margin-right:auto');
  } else if (align === 'right' || align === 'end') {
    styleBits.push('display:block', 'margin-left:auto', 'margin-right:0');
  } else if (align === 'left' || align === 'start') {
    styleBits.push('display:block', 'margin-left:0', 'margin-right:auto');
  }

  if (styleBits.length) {
    if (!styleBits.some((s) => s.startsWith('max-width'))) {
      styleBits.push('max-width:100%');
    }
    parts.push(`style="${escapeAttr(styleBits.join(';'))}"`);
  }

  const img = `<img ${parts.join(' ')} />`;

  // Also wrap with ql-align-* so it matches Quill preview CSS if present
  if (align === 'center' || align === 'middle') {
    return `<p class="ql-align-center">${img}</p>`;
  }
  if (align === 'right' || align === 'end') {
    return `<p class="ql-align-right">${img}</p>`;
  }
  if (align === 'left' || align === 'start') {
    return `<p class="ql-align-left">${img}</p>`;
  }

  return img;
}

/**
 * Quill auto-linkifies URLs inside `![](…)`, which breaks the image regex.
 * Also collapses newlines right after `![…](`.
 */
function normalizeImageMarkdown(md: string): string {
  let text = md.replace(
    /!\[([^\]]*)\]\(\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi,
    '![$1]($2',
  );
  // ![](\nurl) / ![alt](\n url)
  text = text.replace(/!\[([^\]]*)\]\(\s+/g, '![$1](');
  return text;
}

/** True when paragraph text is only an image / tweet short embed. */
function isSoloImageMarkdown(text: string): boolean {
  const t = text.trim();
  return /^!\[[^\]]*\]\([^)]*(?:\)(?:\{[^}]*\})?)\s*$/.test(t) || /^\[\]\([^)]+\)\s*$/.test(t);
}

/** If Quill align wrapped a solo `![](…)`, keep align as `{ align=… }` on the md. */
function injectAlignAttr(md: string, align: string | undefined): string {
  if (!align || align === 'left' || align === 'false') return md;
  const t = md.trim();
  if (/\{[^}]*\balign\s*=/i.test(t)) return t;
  if (/\{[^}]*\}\s*$/.test(t)) {
    return t.replace(/\{([^}]*)\}\s*$/, (_, attrs: string) => `{ ${attrs.trim()} align=${align} }`);
  }
  return `${t}{ align=${align} }`;
}

/**
 * Convert markdown images to real <img> HTML (rehype-raw).
 * Supports GitHub + common size / align extras:
 *   ![](url)
 *   ![alt](url)
 *   ![alt](url "title")
 *   ![alt](url =300x200)
 *   ![alt](url =100%)
 *   ![alt](url){ width=300 }
 *   ![alt](url){ width=100% align=center }
 *   ![alt](url =100%){ align=right }
 * Also promotes empty [](imageUrl) → img.
 */
export function expandMarkdownImages(md: string): string {
  let text = normalizeImageMarkdown(md);

  // [](url) / [](url "title") → treat as image when empty label
  text = text.replace(
    /(^|[^!])\[\]\((\S+?)(?:\s+"([^"]*)")?\)/g,
    (full, prefix: string, url: string, title?: string) => {
      const clean = url.replace(/^<|>$/g, '');
      if (!isLikelyImageUrl(clean) && !/^https?:\/\//i.test(clean)) return full;
      return `${prefix}${buildImgHtml('', clean, { title })}`;
    },
  );

  // ![alt](url =WxH "title"){ attrs }
  // size: =300 | =300x200 | =100% | =100%x50%
  text = text.replace(
    /!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+=([0-9]+%?)(?:x([0-9]+%?))?)?(?:\s+"([^"]*)")?\s*\)(?:\{([^}]*)\})?/g,
    (
      _full,
      alt: string,
      url: string,
      w?: string,
      h?: string,
      title?: string,
      attrBlock?: string,
    ) => {
      // Reserved for twitter short embeds
      if (alt.toLowerCase() === 'tweet') return _full;

      const attrs = parseAttrBlock(attrBlock ?? '');
      return buildImgHtml(alt, url, {
        title,
        width: w || attrs.width,
        height: h || attrs.height,
        align: attrs.align,
      });
    },
  );

  return text;
}

/** Strip inline wrappers but keep text (so `##` / `*aa*` reach remark). Preserve <img> and <a>. */
function innerHtmlToMarkdownText(inner: string): string {
  const keep: string[] = [];
  const withPlaceholders = inner
    .replace(/<img\b[^>]*\/?>/gi, (img) => {
      keep.push(img);
      return `\u0000KEEP${keep.length - 1}\u0000`;
    })
    // Keep real links — Quill auto-link inside ![](…) is unwrapped later in expandMarkdownImages
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (a) => {
      keep.push(a);
      return `\u0000KEEP${keep.length - 1}\u0000`;
    });

  const text = decodeEntities(
    withPlaceholders
      // Keep real breaks as HTML so spacing survives markdown collapse
      .replace(/<br\s*\/?>/gi, '<br />')
      .replace(/<\/(?:span|strong|em|u|s|code)>/gi, '')
      .replace(/<(?:span|strong|em|u|s|code)(?:\s[^>]*)?>/gi, '')
      .replace(/<[^>]+>/g, ''),
  );

  return text.replace(/\u0000KEEP(\d+)\u0000/g, (_, i) => keep[Number(i)] ?? '');
}

function isEmptyBreakInner(inner: string): boolean {
  const t = inner.trim();
  return !t || /^<br\s*\/?>$/i.test(t) || /^&nbsp;$/i.test(t);
}

/**
 * Discord-like inline markdown → HTML (so it works even inside Quill ql-align/ql-size HTML).
 *   *italic*  _italic_  **bold**  __underline__  ~~strike~~  `code`  ||spoiler||
 */
export function expandDiscordInlineMarkdown(text: string): string {
  if (!text || !/[*_~`|]/.test(text)) return text;

  const apply = (s: string): string => {
    let out = s;
    // Spoilers first
    out = out.replace(/\|\|([\s\S]+?)\|\|/g, '<span class="md-spoiler">$1</span>');
    // Code (avoid formatting inside)
    const codes: string[] = [];
    out = out.replace(/`([^`]+?)`/g, (_, code: string) => {
      codes.push(`<code class="md-preview-code">${escapeHtmlText(code)}</code>`);
      return `\u0000CODE${codes.length - 1}\u0000`;
    });
    // Strikethrough
    out = out.replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
    // Bold ** before italic *
    out = out.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    // Discord underline __ (GFM would make this bold — we follow Discord here)
    out = out.replace(/__([\s\S]+?)__/g, '<u>$1</u>');
    // Italic *text* (not part of **)
    out = out.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
    // Italic _text_ (not part of __)
    out = out.replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, '$1<em>$2</em>');
    // Restore code
    out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codes[Number(i)] ?? '');
    return out;
  };

  // Only transform text segments; leave existing HTML tags alone
  return text
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith('<') ? part : apply(part)))
    .join('');
}

function escapeHtmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Apply Discord inline md to text nodes inside an HTML fragment. */
function expandDiscordInsideHtml(html: string): string {
  return expandDiscordInlineMarkdown(html);
}

/**
 * Quill wraps everything in <p>…</p>, so remark never sees markdown.
 * Convert plain blocks → markdown text; keep ql-size / ql-align / <img> / <br> as raw HTML.
 * Empty Quill lines (`<p><br></p>`) become `<br />` so vertical space is not collapsed.
 */
export function quillHtmlToPreviewSource(
  html: string,
  opts?: { expandDiscordInQl?: boolean },
): string {
  const expandDiscordInQl = opts?.expandDiscordInQl !== false;
  const trimmed = html.trim();
  if (!trimmed) return '';

  // Already plain markdown (no tags)
  if (!/<\/?[a-z]/i.test(trimmed)) return trimmed;

  const blockRe =
    /<(p|h[1-6]|div|blockquote)(\s[^>]*)?>[\s\S]*?<\/\1>|<br\s*\/?>/gi;

  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRe.exec(trimmed)) !== null) {
    // Text / markdown sitting outside matched tags (e.g. hola<br/>mundo)
    if (match.index > lastIndex) {
      const between = trimmed.slice(lastIndex, match.index);
      if (between.trim()) {
        parts.push(between);
      }
    }

    const block = match[0];

    if (/^<br\s*\/?>$/i.test(block)) {
      parts.push('<br />');
      lastIndex = match.index + block.length;
      continue;
    }

    // Keep Quill size/align wrappers — but lift solo ![](…) out of <p>
    // (Quill wraps pasted markdown; leaving it inside <p> + <a> breaks images).
    if (/\bql-(?:size|align)-/.test(block)) {
      const openTag = block.match(/^<[^>]+>/)?.[0] ?? '<p>';
      const tagName = /^<\/?([a-z0-9]+)/i.exec(openTag)?.[1] ?? 'p';
      const inner = block.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '');
      const asMd = innerHtmlToMarkdownText(inner);
      const qlAlign = /\bql-align-([a-z]+)/i.exec(openTag)?.[1];

      if (isSoloImageMarkdown(asMd)) {
        parts.push(injectAlignAttr(asMd, qlAlign));
      } else if (expandDiscordInQl) {
        parts.push(expandDiscordInsideHtml(`${openTag}${asMd}</${tagName}>`));
      } else {
        // Clipboard: keep *bold* markers, drop size spans, keep align class on <p>
        parts.push(`${openTag}${asMd}</${tagName}>`);
      }
      lastIndex = match.index + block.length;
      continue;
    }

    const inner = block.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '');

    if (isEmptyBreakInner(inner)) {
      // Quill blank line — keep a real break (markdown \n\n alone collapses)
      parts.push('<br />');
      lastIndex = match.index + block.length;
      continue;
    }

    // Block that is only an <img> — keep HTML
    if (/^\s*<img\b[^>]*\/?>\s*$/i.test(inner)) {
      parts.push(inner.trim());
      lastIndex = match.index + block.length;
      continue;
    }

    // Tweet / other HTML embeds inside a paragraph — keep inner HTML
    if (/<blockquote\b/i.test(inner) || /class=["'][^"']*twitter-tweet/i.test(inner)) {
      parts.push(inner.trim());
      lastIndex = match.index + block.length;
      continue;
    }

    parts.push(innerHtmlToMarkdownText(inner));
    lastIndex = match.index + block.length;
  }

  if (lastIndex < trimmed.length) {
    const rest = trimmed.slice(lastIndex);
    if (rest.trim()) parts.push(rest);
  }

  // No block tags matched (e.g. only inline tags) — keep as-is for rehype-raw
  if (!parts.length) return trimmed;

  // Join: stack consecutive <br /> without eating them; separate text blocks with \n\n
  let out = '';
  for (const part of parts) {
    if (!part) continue;
    if (part === '<br />') {
      out += '<br />';
      continue;
    }
    if (!out) {
      out = part;
      continue;
    }
    if (out.endsWith('<br />')) {
      out += part;
      continue;
    }
    out += `\n\n${part}`;
  }

  return out;
}

/**
 * Final markdown for pastebin / clipboard — keeps short forms
 * (`![tweet](...)`, `![](...){...}`, `**bold**`), not expanded HTML.
 */
export function toFinalMarkdownCopy(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return '';

  let source = /<\/?[a-z]/i.test(trimmed)
    ? quillHtmlToPreviewSource(trimmed, { expandDiscordInQl: false })
    : trimmed;

  return (
    source
      .replace(/&nbsp;/gi, ' ')
      .replace(/&#160;/g, ' ')
      .replace(/[\u00a0\u202f\u2007\u2060\ufeff]/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}
