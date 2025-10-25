export function highlighter(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={`highlight-${i}-${part.length}`} className="bg-bgColor-accent px-0.5 text-fgColor-primary">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
