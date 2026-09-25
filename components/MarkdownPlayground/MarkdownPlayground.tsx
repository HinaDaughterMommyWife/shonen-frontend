'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  beautifyContent,
  detectContentKind,
  markdownToQuillHtml,
  toFinalMarkdownCopy,
} from '@/lib/beautifyContent';
import MarkdownPreview from '@/components/MarkdownPreview';
import TweetEmbedModal from './TweetEmbedModal';
import 'react-quill-new/dist/quill.snow.css';
import './markdown-playground.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="markdown-playground__panel-label">Cargando editor…</div>,
});

type ViewMode = 'split' | 'text' | 'preview';

const QUILL_FORMATS = ['size', 'align'];

const MODE_LABELS: { id: ViewMode; label: string }[] = [
  { id: 'split', label: 'Texto + preview' },
  { id: 'text', label: 'Texto' },
  { id: 'preview', label: 'Preview' },
];

const INITIAL = `<p class="ql-align-center"><span class="ql-size-large">Shonen Weekly</span></p>
<p>Escribe markdown o HTML. Beauty formatea según lo que detecte.</p>
<p></p>
<p>## Lista</p>
<p></p>
<p>- uno</p>
<p>- dos</p>
<p></p>
<p>**negrita** y \`codigo\`</p>`;

export default function MarkdownPlayground() {
  const [mode, setMode] = useState<ViewMode>('split');
  const [content, setContent] = useState(INITIAL);
  const [beautyNote, setBeautyNote] = useState<string | null>(null);
  const [tweetModalOpen, setTweetModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const openTweetModalRef = useRef(() => setTweetModalOpen(true));
  openTweetModalRef.current = () => setTweetModalOpen(true);

  const detected = useMemo(() => detectContentKind(content), [content]);
  const finalCopy = useMemo(() => toFinalMarkdownCopy(content), [content]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [[{ size: ['small', false, 'large', 'huge'] }], [{ align: [] }], ['tweet']],
        handlers: {
          tweet() {
            openTweetModalRef.current();
          },
        },
      },
    }),
    [],
  );

  const onBeauty = () => {
    const { kind, value } = beautifyContent(content);
    if (kind === 'markdown') {
      setContent(markdownToQuillHtml(value));
      setBeautyNote('markdown');
    } else if (kind === 'html') {
      setContent(value);
      setBeautyNote('html');
    } else {
      setContent(value);
      setBeautyNote('plain');
    }
  };

  const onCopyFinal = useCallback(async () => {
    const text = toFinalMarkdownCopy(content);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const insertTweetMarkdown = useCallback((markdown: string) => {
    const escaped = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    setContent((prev) => `${prev}<p><br></p><p>${escaped}</p>`);
  }, []);

  const showEditor = mode === 'split' || mode === 'text';
  const showPreview = mode === 'split' || mode === 'preview';

  return (
    <div className="markdown-playground">
      <div className="markdown-playground__toolbar">
        <div className="markdown-playground__modes" role="tablist" aria-label="Modo de vista">
          {MODE_LABELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              data-active={mode === id}
              className="markdown-playground__mode-btn"
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <button type="button" className="markdown-playground__beauty" onClick={onBeauty}>
          Beauty
        </button>

        <button
          type="button"
          className="markdown-playground__beauty"
          onClick={onCopyFinal}
          title="Copia el markdown final (listo para pastebin / preview)"
        >
          {copied ? 'Copiado ✓' : 'Copy final'}
        </button>

        <span className="markdown-playground__hint">
          detectado: {detected}
          {beautyNote ? ` · último beauty: ${beautyNote}` : ''}
          {' · '}
          {finalCopy.length} chars
        </span>
      </div>

      <div className="markdown-playground__grid" data-mode={mode}>
        {showEditor && (
          <section className="markdown-playground__panel" aria-label="Editor">
            <div className="markdown-playground__panel-label">Editor (Quill)</div>
            <div className="markdown-playground__editor">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={QUILL_FORMATS}
              />
            </div>
          </section>
        )}

        {showPreview && (
          <section className="markdown-playground__panel" aria-label="Preview">
            <div className="markdown-playground__panel-label">
              Preview (react-markdown + gfm + breaks + rehype-raw + tweets)
            </div>
            <div className="markdown-playground__preview-body">
              <MarkdownPreview content={content} />
            </div>
          </section>
        )}
      </div>

      <TweetEmbedModal
        open={tweetModalOpen}
        onOpenChange={setTweetModalOpen}
        onInsert={insertTweetMarkdown}
      />
    </div>
  );
}
