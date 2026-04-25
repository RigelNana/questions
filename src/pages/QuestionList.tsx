import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import { QuestionCard } from '../components/question/QuestionCard';
import {
  DOMAIN_LABELS,
  DOMAIN_ICONS,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_CATEGORY,
  type Domain,
  type QuestionType,
  type Difficulty,
} from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type StatusFilter = 'all' | 'completed' | 'incomplete' | 'bookmarked';
const PAGE_SIZE = 15;

export function QuestionList() {
  const { domain } = useParams<{ domain: string }>();
  const {
    registry,
    fetchRegistry,
    fetchPacksForDomain,
    getQuestionsForDomain,
  } = useQuestionStore();
  const { questions: progress, bookmarks } = useProgressStore();

  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 0>(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTypeFilterChange = (value: QuestionType | 'all') => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleDifficultyFilterChange = (value: Difficulty | 0) => {
    setDifficultyFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  useEffect(() => {
    if (registry && domain) {
      fetchPacksForDomain(domain as Domain);
    }
  }, [registry, domain, fetchPacksForDomain]);

  const allQuestions = getQuestionsForDomain(domain as Domain);

  const filteredQuestions = useMemo(() => {
    let result = allQuestions;

    if (typeFilter !== 'all') {
      result = result.filter((q) => q.type === typeFilter);
    }
    if (difficultyFilter !== 0) {
      result = result.filter((q) => q.difficulty === difficultyFilter);
    }
    if (statusFilter === 'completed') {
      result = result.filter((q) => progress[q.id]?.completedAt);
    } else if (statusFilter === 'incomplete') {
      result = result.filter((q) => !progress[q.id]?.completedAt);
    } else if (statusFilter === 'bookmarked') {
      result = result.filter((q) => bookmarks.includes(q.id));
    }
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(/\s+/);
      result = result.filter((q) =>
        terms.every(
          (t) =>
            q.title.toLowerCase().includes(t) ||
            q.tags.some((tag) => tag.toLowerCase().includes(t)),
        ),
      );
    }

    return result;
  }, [allQuestions, typeFilter, difficultyFilter, statusFilter, searchQuery, progress, bookmarks]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (!domain) return null;
  const domainKey = domain as Domain;
  const DomainIcon = DOMAIN_ICONS[domainKey];

  // Group question types
  const fundamentalTypes = Object.entries(QUESTION_TYPE_LABELS).filter(
    ([t]) => QUESTION_TYPE_CATEGORY[t as QuestionType] === 'fundamental',
  );
  const scenarioTypes = Object.entries(QUESTION_TYPE_LABELS).filter(
    ([t]) => QUESTION_TYPE_CATEGORY[t as QuestionType] === 'scenario',
  );

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-notion-text-secondary)] mb-5 flex items-center">
        <Link to="/" className="hover:text-[var(--color-notion-accent)] no-underline transition-colors">
          首页
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-[var(--color-notion-text)] inline-flex items-center gap-1.5">
          <DomainIcon className="w-4 h-4" /> {DOMAIN_LABELS[domainKey]}
        </span>
      </div>

      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-1.5 flex items-center gap-2.5 tracking-tight">
        <DomainIcon className="w-5 h-5 text-[var(--color-notion-accent)]" /> {DOMAIN_LABELS[domainKey]}
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-7">
        共 {allQuestions.length} 题，已完成{' '}
        {allQuestions.filter((q) => progress[q.id]?.completedAt).length} 题
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-7 p-4 rounded-xl bg-[var(--color-notion-bg-secondary)] border border-[var(--color-notion-border)]">
        {/* Search */}
        <input
          type="text"
          placeholder="搜索题目..."
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          className="w-full sm:flex-1 sm:min-w-[200px] px-3.5 py-2.5 text-sm rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] text-[var(--color-notion-text)] focus:outline-none focus:border-[var(--color-notion-accent)] focus:ring-2 focus:ring-[var(--color-notion-accent)]/10 transition-all"
        />

        <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3 sm:flex sm:gap-3">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value as QuestionType | 'all')}
            className="w-full rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-3 py-2 text-sm text-[var(--color-notion-text)] transition-colors hover:border-[var(--color-notion-accent)] sm:w-auto"
          >
            <option value="all">全部类型</option>
            <optgroup label="八股题">
              {fundamentalTypes.map(([t, label]) => (
                <option key={t} value={t}>{label}</option>
              ))}
            </optgroup>
            <optgroup label="情景题">
              {scenarioTypes.map(([t, label]) => (
                <option key={t} value={t}>{label}</option>
              ))}
            </optgroup>
          </select>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => handleDifficultyFilterChange(Number(e.target.value) as Difficulty | 0)}
            className="w-full rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-3 py-2 text-sm text-[var(--color-notion-text)] transition-colors hover:border-[var(--color-notion-accent)] sm:w-auto"
          >
            <option value={0}>全部难度</option>
            <option value={1}>⭐ 基础</option>
            <option value={2}>⭐⭐ 进阶</option>
            <option value={3}>⭐⭐⭐ 高级</option>
            <option value={4}>⭐⭐⭐⭐ 专家</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as StatusFilter)}
            className="w-full rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-3 py-2 text-sm text-[var(--color-notion-text)] transition-colors hover:border-[var(--color-notion-accent)] sm:w-auto"
          >
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="incomplete">未完成</option>
            <option value="bookmarked">已收藏</option>
          </select>
        </div>
      </div>

      {/* Question list */}
      {filteredQuestions.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-notion-text-secondary)]">
          {allQuestions.length === 0
            ? '该域暂无题目，请添加题库 JSON 文件'
            : '没有匹配的题目'}
        </div>
      ) : (
        <>
          <div className="border border-[var(--color-notion-border)] rounded-xl overflow-hidden animate-stagger">
            {paginatedQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isCompleted={!!progress[q.id]?.completedAt}
                isBookmarked={bookmarks.includes(q.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 mb-8 flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[var(--color-notion-text-secondary)]">
                {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredQuestions.length)} / {filteredQuestions.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((page, i, arr) => {
                    const showEllipsis = i > 0 && page - arr[i - 1] > 1;
                    return (
                      <span key={page} className="flex items-center">
                        {showEllipsis && <span className="px-1 text-[var(--color-notion-text-secondary)]">…</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            page === currentPage
                              ? 'bg-[var(--color-notion-accent)] text-white'
                              : 'hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)]'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
