import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useQuestionStore } from '../../stores/questionStore';
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getAllLoadedQuestions } = useQuestionStore();

  const allQuestions = getAllLoadedQuestions();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return allQuestions
      .filter((q) => {
        const searchable = [q.title, ...q.tags, ...q.keyPoints].join(' ').toLowerCase();
        return terms.every((t) => searchable.includes(t));
      })
      .slice(0, 8);
  }, [query, allQuestions]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (index: number) => {
    const item = results[index];
    if (item) {
      navigate(`/domains/${item.domain}/${item.id}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        handleSelect(selectedIndex);
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-3 sm:mx-4 bg-[var(--color-notion-bg)] rounded-xl shadow-2xl shadow-black/20 border border-[var(--color-notion-border)] overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--color-notion-border)]">
          <Search className="w-4 h-4 text-[var(--color-notion-accent)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索题目、标签、知识点..."
            className="flex-1 text-sm bg-transparent text-[var(--color-notion-text)] placeholder:text-[var(--color-notion-text-secondary)]/60 focus:outline-none"
          />
          <kbd className="text-[10px] text-[var(--color-notion-text-secondary)] bg-[var(--color-notion-bg-secondary)] border border-[var(--color-notion-border)] px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="max-h-80 overflow-y-auto py-1.5">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-notion-text-secondary)]">
                没有找到匹配的题目
              </div>
            ) : (
              results.map((item, index) => {
                const Icon = DOMAIN_ICONS[item.domain as Domain];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all duration-150 ${
                      index === selectedIndex
                        ? 'bg-[var(--color-notion-accent-light)]'
                        : 'hover:bg-[var(--color-notion-bg-hover)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${index === selectedIndex ? 'text-[var(--color-notion-accent)]' : 'text-[var(--color-notion-text-secondary)]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--color-notion-text)] truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--color-notion-text-secondary)] opacity-70">
                        {DOMAIN_LABELS[item.domain]} · {item.tags.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--color-notion-accent)] flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Footer hints */}
        {query.trim() && results.length > 0 && (
          <div className="px-4 py-2 border-t border-[var(--color-notion-border)] flex items-center gap-4 text-[10px] text-[var(--color-notion-text-secondary)]">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> 选择
            </span>
            <span>↑↓ 导航</span>
          </div>
        )}
      </div>
    </div>
  );
}
