type NextFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

/** Try URLs in order; return first non-empty OK body. Failures are skipped. */
export async function fetchFirstOkText(
  urls: string[],
  init?: NextFetchInit,
): Promise<string> {
  for (const url of urls) {
    if (!url) continue;
    try {
      const res = await fetch(url, init);
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trim()) return text;
    } catch {
      // try next mirror
    }
  }
  return '';
}
