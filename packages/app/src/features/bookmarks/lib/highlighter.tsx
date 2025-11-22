export const highlighter = (text: string, query: string) => {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const parts: Array<string | JSX.Element> = [];
  let startIndex = 0;

  // Find all case-insensitive occurrences without using RegExp,
  // which avoids rebuilding a regex for every render.
  // This is cheaper and also avoids issues with special characters in the query.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matchIndex = lowerText.indexOf(lowerQuery, startIndex);
    if (matchIndex === -1) {
      break;
    }

    if (matchIndex > startIndex) {
      parts.push(text.slice(startIndex, matchIndex));
    }

    const matchText = text.slice(matchIndex, matchIndex + query.length);
    parts.push(
      <mark
        className="bg-bgColor-accent px-0.5 text-fgColor-primary"
        key={`highlight-${matchIndex}-${matchText.length}`}
      >
        {matchText}
      </mark>
    );

    startIndex = matchIndex + query.length;
  }

  if (startIndex < text.length) {
    parts.push(text.slice(startIndex));
  }

  return parts;
};
