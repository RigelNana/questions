import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import { QuestionCard } from '../components/question/QuestionCard';
import { useProgressStore } from '../stores/progressStore';
import { ALL_DOMAINS } from '../types';
import {
  loadQuestionIndex,
  type QuestionIndexEntry,
} from '../utils/questionLoader';

export function Bookmarks() {
  const { bookmarks, questions: progress, toggleBookmark } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState<QuestionIndexEntry[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all(ALL_DOMAINS.map(loadQuestionIndex))
      .then((indexes) => {
        if (active) setQuestionIndex(indexes.flat());
      })
      .catch(() => {
        if (active) setQuestionIndex([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const bookmarkedQuestions = useMemo(() => {
    const bookmarkOrder = new Map(bookmarks.map((id, index) => [id, index]));
    const query = searchQuery.trim().toLowerCase();
    return questionIndex
      .filter((question) => bookmarkOrder.has(question.id))
      .filter((question) => (
        !query
        || question.title.toLowerCase().includes(query)
        || question.tags.some((tag) => tag.toLowerCase().includes(query))
      ))
      .sort((a, b) => (bookmarkOrder.get(b.id) ?? 0) - (bookmarkOrder.get(a.id) ?? 0));
  }, [questionIndex, bookmarks, searchQuery]);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-bold text-[var(--color-notion-text)]">
        <Star className="h-5 w-5 fill-current text-[var(--color-notion-warning)]" /> 我的收藏
      </h1>
      <p className="mb-6 text-sm text-[var(--color-notion-text-secondary)]">
        共收藏 {bookmarks.length} 个知识点
      </p>

      {bookmarks.length > 0 && (
        <label className="search-control mb-5 flex items-center gap-2 rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-4 py-2.5">
          <Search className="h-4 w-4 flex-shrink-0 text-[var(--color-notion-text-secondary)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索收藏的题目或标签..."
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--color-notion-text)] outline-none placeholder:text-[var(--color-notion-text-secondary)]"
          />
        </label>
      )}

      {isLoading && bookmarks.length > 0 ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-[var(--color-notion-text-secondary)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-notion-accent)] border-t-transparent" />
          正在加载收藏...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-notion-border)] px-5 py-16 text-center">
          <Star className="mx-auto mb-3 h-8 w-8 text-[var(--color-notion-border)]" />
          <p className="text-sm font-medium text-[var(--color-notion-text)]">还没有收藏题目</p>
          <p className="mb-4 mt-1 text-xs text-[var(--color-notion-text-secondary)]">在题目列表或详情页点击星标即可收藏</p>
          <Link to="/" className="text-sm text-[var(--color-notion-accent)] hover:underline">
            去选择知识域
          </Link>
        </div>
      ) : bookmarkedQuestions.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--color-notion-text-secondary)]">
          没有匹配的收藏
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-notion-border)]">
          {bookmarkedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isCompleted={!!progress[question.id]?.completedAt}
              isBookmarked
              onToggleBookmark={() => toggleBookmark(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
