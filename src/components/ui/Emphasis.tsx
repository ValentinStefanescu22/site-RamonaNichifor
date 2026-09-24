import { Fragment } from 'react';

/**
 * Renders content text where `_word_` means emphasis, e.g. „Între rațiune și _intuiție._”.
 * Keeps content files free of HTML.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/_([^_]+)_/g); // odd indexes are the emphasized parts
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
