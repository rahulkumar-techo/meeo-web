import React from 'react';

interface JsonLdProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * JsonLd Component
 * Renders structured JSON-LD data for search engine rich results
 * (e.g. Google Rich Snippets, Merchant Center, Sitelinks searchbox).
 */
export const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};
