import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import { DomainCard } from '../components/domain/DomainCard';
import { ALL_DOMAINS, DOMAIN_LABELS } from '../types';
import { Target, BookOpen } from 'lucide-react';

export function Dashboard() {
  const { registry, fetchRegistry, isLoadingRegistry } = useQuestionStore();
  const { questions, bookmarks, lastVisited, getCorrectRate } = useProgressStore();

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const totalQuestions = registry?.packs.reduce((sum, p) => sum + p.questionCount, 0) ?? 0;
  const completedCount = Object.keys(questions).length;
  const correctRate = getCorrectRate();
  const bookmarkCount = bookmarks.length;
  const totalAttempts = Object.values(questions).flatMap((q) => q.quizAttempts).length;

  const getDomainStats = (domain: string) => {
    const packs = registry?.packs.filter((p) => p.domain === domain) ?? [];
    const total = packs.reduce((s, p) => s + p.questionCount, 0);
    // Count completed questions that belong to this domain
    const domainQuestionIds = Object.keys(questions).filter((id) =>
      id.startsWith(domain) || questions[id].questionId?.startsWith(domain),
    );
    const completed = domainQuestionIds.filter((id) => questions[id]?.completedAt).length;
    const domainAttempts = domainQuestionIds.flatMap((id) => questions[id]?.quizAttempts ?? []);
    const domainCorrectRate =
      domainAttempts.length > 0
        ? Math.round(
            (domainAttempts.filter((a) => a.isCorrect).length / domainAttempts.length) * 100,
          )
        : 0;
    return { total, completed, correctRate: domainCorrectRate };
  };

  if (isLoadingRegistry) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-[var(--color-notion-text-secondary)]">
          <div className="w-4 h-4 border-2 border-[var(--color-notion-accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">加载题库...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-7 h-7 text-[var(--color-notion-accent)]" />
          <h1 className="text-2xl font-bold text-[var(--color-notion-text)]">
            SRE 刷题工具
          </h1>
        </div>
        <p className="text-[var(--color-notion-text-secondary)]">
          后端 / DevOps / SRE 面试知识体系全覆盖
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-3 sm:p-4 rounded-lg border border-[var(--color-notion-border)]">
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-notion-text)]">{completedCount}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)]">已完成</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-[var(--color-notion-border)]">
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-notion-text)]">{totalQuestions}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)]">总题数</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-[var(--color-notion-border)]">
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-notion-accent)]">{correctRate}%</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)]">正确率</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-[var(--color-notion-border)]">
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-notion-warning)]">{totalAttempts}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)]">选择题作答</div>
        </div>
      </div>

      {/* Continue last */}
      {lastVisited && (
        <div className="mb-8 p-4 rounded-lg border border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]">
          <Link
            to={`/domains/${lastVisited.domain}/${lastVisited.questionId}`}
            className="flex items-center gap-2 text-sm text-[var(--color-notion-accent)] font-medium no-underline hover:underline"
          >
            <BookOpen className="w-4 h-4" />
            继续上次 — {DOMAIN_LABELS[lastVisited.domain as keyof typeof DOMAIN_LABELS]}
          </Link>
        </div>
      )}

      {/* Bookmarks quick access */}
      {bookmarkCount > 0 && (
        <div className="mb-6 text-sm text-[var(--color-notion-text-secondary)]">
          已收藏 {bookmarkCount} 道题目
        </div>
      )}

      {/* Domain grid */}
      <h2 className="text-lg font-semibold text-[var(--color-notion-text)] mb-4">知识域</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
        {ALL_DOMAINS.map((domain) => {
          const stats = getDomainStats(domain);
          return (
            <DomainCard
              key={domain}
              domain={domain}
              totalQuestions={stats.total}
              completedQuestions={stats.completed}
              correctRate={stats.correctRate}
            />
          );
        })}
      </div>
    </div>
  );
}
