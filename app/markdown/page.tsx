import MarkdownPlayground from '@/components/MarkdownPlayground/MarkdownPlayground';

export const metadata = {
  title: 'Markdown playground | El Shonen Semanal',
  description: 'Quill editor + beauty compatible con comentarios semanales',
};

export default function MarkdownPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Markdown playground</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Quill (tamaño + alineación) + beauty + preview: remark-gfm, remark-breaks, rehype-raw
          (HTML real; remark-html no habilita HTML en react-markdown).
        </p>
      </header>
      <MarkdownPlayground />
    </main>
  );
}
