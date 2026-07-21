import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowRawHtml?: boolean;
}

export function MarkdownRenderer({
  content,
  className = '',
  allowRawHtml = true,
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={allowRawHtml
          ? [rehypeRaw, rehypeHighlight]
          : [rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
