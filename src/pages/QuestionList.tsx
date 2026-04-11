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

type StatusFilter = 'all' | 'completed' | 'incomplete' | 'bookmarked';

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
      <div className="text-sm text-[var(--color-notion-text-secondary)] mb-4 flex items-center">
        <Link to="/" className="hover:text-[var(--color-notion-accent)] no-underline">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-notion-text)] inline-flex items-center gap-1.5">
          <DomainIcon className="w-4 h-4" /> {DOMAIN_LABELS[domainKey]}
        </span>
      </div>

      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-1 flex items-center gap-2">
        <DomainIcon className="w-5 h-5" /> {DOMAIN_LABELS[domainKey]}
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-6">
        共 {allQuestions.length} 题，已完成{' '}
        {allQuestions.filter((q) => progress[q.id]?.completedAt).length} 题
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-lg bg-[var(--color-notion-bg-secondary)] border border-[var(--color-notion-border)]">
        {/* Search */}
        <input
          type="text"
          placeholder="搜索题目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 sm:min-w-[200px] px-3 py-2 text-sm rounded border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] text-[var(--color-notion-text)] focus:outline-none focus:border-[var(--color-notion-accent)]"
        />

        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')}
            className="px-3 py-2 text-sm rounded border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] text-[var(--color-notion-text)] w-full sm:w-auto"
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
            onChange={(e) => setDifficultyFilter(Number(e.target.value) as Difficulty | 0)}
            className="px-3 py-2 text-sm rounded border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] text-[var(--color-notion-text)] w-full sm:w-auto"
          >
            <option value={0}>全部难度</option>
            <option value={1}>* 基础</option>
            <option value={2}>** 进阶</option>
            <option value={3}>*** 高级</option>
            <option value={4}>**** 专家</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 text-sm rounded border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] text-[var(--color-notion-text)] w-full sm:w-auto"
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
        <div className="py-12 text-center text-[var(--color-notion-text-secondary)]">
          {allQuestions.length === 0
            ? '该域暂无题目，请添加题库 JSON 文件'
            : '没有匹配的题目'}
        </div>
      ) : (
        <div className="border border-[var(--color-notion-border)] rounded-lg overflow-hidden animate-stagger">
          {filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isCompleted={!!progress[q.id]?.completedAt}
              isBookmarked={bookmarks.includes(q.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
