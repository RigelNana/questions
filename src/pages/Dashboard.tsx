import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuestionStore } from "../stores/questionStore";
import { useProgressStore } from "../stores/progressStore";
import { DomainCard } from "../components/domain/DomainCard";
import { ALL_DOMAINS, DOMAIN_LABELS } from "../types";
import {
  Target,
  BookOpen,
  Zap,
  CheckCircle,
  BarChart3,
  Star,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl border border-[var(--color-notion-border)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl skeleton" />
        <div className="w-16 h-4 skeleton" />
      </div>
      <div className="w-28 h-5 skeleton mb-2" />
      <div className="w-20 h-4 skeleton mb-4" />
      <div className="w-full h-2 skeleton" />
    </div>
  );
}

export function Dashboard() {
  const { registry, fetchRegistry, isLoadingRegistry } = useQuestionStore();
  const { questions, bookmarks, lastVisited, getCorrectRate } =
    useProgressStore();

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const totalQuestions =
    registry?.packs.reduce((sum, p) => sum + p.questionCount, 0) ?? 0;
  const completedCount = Object.keys(questions).length;
  const correctRate = getCorrectRate();
  const bookmarkCount = bookmarks.length;
  const totalAttempts = Object.values(questions).flatMap(
    (q) => q.quizAttempts,
  ).length;

  const getDomainStats = (domain: string) => {
    const packs = registry?.packs.filter((p) => p.domain === domain) ?? [];
    const total = packs.reduce((s, p) => s + p.questionCount, 0);
    const domainQuestionIds = Object.keys(questions).filter(
      (id) =>
        id.startsWith(domain) || questions[id].questionId?.startsWith(domain),
    );
    const completed = domainQuestionIds.filter(
      (id) => questions[id]?.completedAt,
    ).length;
    const domainAttempts = domainQuestionIds.flatMap(
      (id) => questions[id]?.quizAttempts ?? [],
    );
    const domainCorrectRate =
      domainAttempts.length > 0
        ? Math.round(
            (domainAttempts.filter((a) => a.isCorrect).length /
              domainAttempts.length) *
              100,
          )
        : 0;
    return { total, completed, correctRate: domainCorrectRate };
  };

  if (isLoadingRegistry) {
    return (
      <div className="animate-fade-in">
        {/* Skeleton hero */}
        <div className="mb-10">
          <div className="w-48 h-8 skeleton mb-3" />
          <div className="w-72 h-5 skeleton" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-[var(--color-notion-border)]"
            >
              <div className="w-12 h-8 skeleton mb-2" />
              <div className="w-16 h-4 skeleton" />
            </div>
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="w-20 h-6 skeleton mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "已完成",
      value: completedCount,
      icon: CheckCircle,
      color: "text-[var(--color-notion-correct)]",
    },
    {
      label: "总题数",
      value: totalQuestions,
      icon: Target,
      color: "text-[var(--color-notion-accent)]",
    },
    {
      label: "正确率",
      value: `${correctRate}%`,
      icon: BarChart3,
      color: "text-[var(--color-notion-warning)]",
    },
    {
      label: "作答数",
      value: totalAttempts,
      icon: Zap,
      color: "text-[var(--color-notion-accent)]",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-notion-accent)] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-notion-text)] tracking-tight">
            刷题工具
          </h1>
        </div>
        <p className="text-[var(--color-notion-text-secondary)] ml-12">
          面试知识体系全覆盖
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 animate-stagger">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 sm:p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)] transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon
                className={`w-4 h-4 ${color} opacity-70 group-hover:opacity-100 transition-opacity`}
              />
              <span className="text-xs text-[var(--color-notion-text-secondary)]">
                {label}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-text)] tracking-tight">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Continue last */}
      {lastVisited && (
        <div className="mb-8 p-4 rounded-xl border border-[var(--color-notion-accent)]/30 bg-[var(--color-notion-accent-light)] hover:bg-[var(--color-notion-accent)]/10 transition-colors animate-slide-in-right">
          <Link
            to={`/domains/${lastVisited.domain}/${lastVisited.questionId}`}
            className="flex items-center gap-2.5 text-sm text-[var(--color-notion-accent)] font-medium no-underline hover:underline"
          >
            <BookOpen className="w-4 h-4" />
            继续上次 —{" "}
            {DOMAIN_LABELS[lastVisited.domain as keyof typeof DOMAIN_LABELS]}
          </Link>
        </div>
      )}

      {/* Bookmarks quick access */}
      {bookmarkCount > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-notion-text-secondary)]">
          <Star className="w-4 h-4 text-[var(--color-notion-warning)]" />
          已收藏 {bookmarkCount} 道题目
        </div>
      )}

      {/* Domain grid */}
      <h2 className="text-lg font-semibold text-[var(--color-notion-text)] mb-5 tracking-tight">
        知识域
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
        {ALL_DOMAINS.map((domain) => {
          const domainStats = getDomainStats(domain);
          return (
            <DomainCard
              key={domain}
              domain={domain}
              totalQuestions={domainStats.total}
              completedQuestions={domainStats.completed}
              correctRate={domainStats.correctRate}
            />
          );
        })}
      </div>
    </div>
  );
}
