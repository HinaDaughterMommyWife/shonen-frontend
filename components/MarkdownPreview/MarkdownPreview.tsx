'use client';

import React, { Component, useMemo, type ErrorInfo, type ReactNode } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { expandDiscordInlineMarkdown, expandMarkdownImages, isLikelyImageUrl, quillHtmlToPreviewSource, stripTags } from '@/lib/beautifyContent';
import { expandTweetMarkdown, normalizeRawTweetBlockquotes } from '@/lib/twitterEmbed';
import { useTwitterWidgets } from '@/hooks/useTwitterWidgets';
import EmoteDecorator from '@/components/EmoteDecorator';
import './markdown-preview.css';

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ');
}

const COMPLETE_TAG =
  /<\/?[a-zA-Z][\w:-]*(?:\s+[a-zA-Z_:][\w:.-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>/g;

/** True when every `<...>` looks like a finished tag (typing mid-tag → false). */
function hasOnlyCompleteHtmlTags(value: string): boolean {
  const withoutComments = value.replace(/<!--[\s\S]*?-->/g, '');
  const withoutTags = withoutComments.replace(COMPLETE_TAG, '');
  return !/[<>]/.test(withoutTags);
}

/**
 * Quill escapes typed HTML (&lt;p&gt;…). Only unescape when tags are complete,
 * otherwise mid-typing (`&lt;p`) becomes `<p` and React blows up with tags like `p<`.
 */
function unescapeTypedHtml(content: string): string {
  if (!/&lt;\/?[a-zA-Z]/.test(content)) return content;

  const candidate = content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  if (!hasOnlyCompleteHtmlTags(candidate)) {
    return content;
  }

  return candidate;
}

function prepareSource(content: string): { source: string; draft: boolean } {
  const unescaped = unescapeTypedHtml(content);

  // Incomplete HTML while typing → plain text, no crash
  if (/<[a-zA-Z]/.test(unescaped) && !hasOnlyCompleteHtmlTags(unescaped)) {
    // Still try to expand complete image markdown inside draft text
    const plain = stripTags(content) || '\u00a0';
    return { source: expandMarkdownImages(plain), draft: true };
  }

  // Quill HTML → markdown text + raw HTML for ql-size/ql-align / img
  let source = /<\/?[a-z]/i.test(unescaped)
    ? quillHtmlToPreviewSource(unescaped)
    : unescaped;

  // Tweets before images — otherwise ![tweet](url) becomes <img>
  source = expandTweetMarkdown(source);
  source = expandMarkdownImages(source);
  source = normalizeRawTweetBlockquotes(source);
  // Discord-like *italic* / **bold** / __underline__ even inside leftover HTML text
  source = expandDiscordInlineMarkdown(source);
  // NBSP / word-joiner make "lorem lorem" one blob → letter-wrap. Use real spaces.
  source = normalizeWrapSpaces(source);

  return { source, draft: false };
}

/** Turn non-breaking / joiner spaces into normal spaces so wrap happens between words. */
function normalizeWrapSpaces(html: string): string {
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith('<')) return part;
      return part
        .replace(/&nbsp;/gi, ' ')
        .replace(/&#160;/g, ' ')
        .replace(/[\u00a0\u202f\u2007\u2060\ufeff]/g, ' ');
    })
    .join('');
}

const components: Components = {
  img: ({ src, alt, title, width, height, className, style }) => {
    const w = width != null && width !== '' ? String(width) : undefined;
    const h = height != null && height !== '' ? String(height) : undefined;
    const styleObj: React.CSSProperties =
      typeof style === 'object' && style ? { ...style } : {};

    if (w != null) {
      styleObj.width = /%$/.test(w) ? w : Number.isFinite(Number(w)) ? Number(w) : w;
    }
    if (h != null) {
      styleObj.height = /%$/.test(h) ? h : Number.isFinite(Number(h)) ? Number(h) : h;
    } else if (!styleObj.height) {
      styleObj.height = 'auto';
    }
    styleObj.maxWidth = styleObj.maxWidth ?? '100%';

    return (
      <img
        src={typeof src === 'string' ? src : undefined}
        alt={alt ?? ''}
        title={title}
        width={w != null && !/%$/.test(w) ? w : undefined}
        height={h != null && !/%$/.test(h) ? h : undefined}
        className={cx('md-preview-img', className)}
        style={styleObj}
        loading="lazy"
      />
    );
  },
  a: ({ children, href, title }) => {
    const empty =
      children == null ||
      children === '' ||
      (Array.isArray(children) && children.length === 0);

    if (empty && href && isLikelyImageUrl(href)) {
      return <img src={href} alt="" title={title} className="md-preview-img" loading="lazy" />;
    }

    return (
      <a
        href={href}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
        className="md-preview-link"
      >
        {children}
      </a>
    );
  },
  ol: ({ children, className, style }) => (
    <ol className={cx('md-preview-ol', className)} style={style}>
      {children}
    </ol>
  ),
  ul: ({ children, className, style }) => (
    <ul className={cx('md-preview-ul', className)} style={style}>
      {children}
    </ul>
  ),
  li: ({ children, className, style }) => (
    <li className={cx('md-preview-li', className)} style={style}>
      {children}
    </li>
  ),
  p: ({ children, className, style }) => (
    <EmoteDecorator>
      <div className={cx('md-preview-p', className)} style={style}>
        {children}
      </div>
    </EmoteDecorator>
  ),
  h1: ({ children, className, style }) => (
    <h1 className={cx(className)} style={style}>
      {children}
    </h1>
  ),
  h2: ({ children, className, style }) => (
    <h2 className={cx(className)} style={style}>
      {children}
    </h2>
  ),
  h3: ({ children, className, style }) => (
    <h3 className={cx(className)} style={style}>
      {children}
    </h3>
  ),
  div: ({ children, className, style }) => (
    <div className={cx(className)} style={style}>
      {children}
    </div>
  ),
  span: ({ children, className, style }) => (
    <span className={cx(className)} style={style}>
      {children}
    </span>
  ),
  em: ({ children }) => <em className="md-preview-em">{children}</em>,
  strong: ({ children }) => <strong className="md-preview-strong">{children}</strong>,
  u: ({ children }) => <u className="md-preview-u">{children}</u>,
  del: ({ children }) => <del className="md-preview-del">{children}</del>,
  code: ({ children }) => <code className="md-preview-code">{children}</code>,
  br: () => <br />,
};

type BoundaryProps = {
  content: string;
  children: ReactNode;
};

type BoundaryState = {
  failed: boolean;
};

/** Last line of defense if a bad tag still reaches React.createElement. */
class PreviewErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // swallow — drafting preview is best-effort
  }

  componentDidUpdate(prevProps: BoundaryProps) {
    if (prevProps.content !== this.props.content && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) {
      const plain = stripTags(this.props.content);
      return (
        <div className="markdown-preview markdown-preview--draft">
          <p className="md-preview-draft-hint">Preview en borrador (markup incompleto)…</p>
          <p className="md-preview-p">{plain || '\u00a0'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SafeMarkdown({ source }: { source: string }) {
  return useMemo(() => {
    try {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {source}
        </ReactMarkdown>
      );
    } catch {
      return <p className="md-preview-p md-preview-draft-hint">No se pudo parsear aún…</p>;
    }
  }, [source]);
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const { source, draft } = useMemo(() => prepareSource(content), [content]);
  useTwitterWidgets(source);

  return (
    <PreviewErrorBoundary content={content}>
      <div className={cx('markdown-preview', draft && 'markdown-preview--draft', className)}>
        {draft && <p className="md-preview-draft-hint">Escribiendo markup…</p>}
        <SafeMarkdown source={source} />
      </div>
    </PreviewErrorBoundary>
  );
}
