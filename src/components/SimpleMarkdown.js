import React from 'react';

const SimpleMarkdown = ({ markdown }) => {
  const parseMarkdown = (md) => {
    // Basic Markdown parsing
    const htmlText = md
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d\. (.*$)/gim, '<ol><li>$1</li></ol>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br>');

    return { __html: htmlText };
  };

  return <div dangerouslySetInnerHTML={parseMarkdown(markdown)} />;
};

export default SimpleMarkdown;