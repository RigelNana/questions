import { useEffect, useState } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionStore } from '../stores/questionStore';
import { TrendingUp } from 'lucide-react';
import { ALL_DOMAINS, DOMAIN_LABELS, DOMAIN_ICONS, type Domain } from '../types';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

/**
 * Small row that animates its progress bar from 0 to `pct` on mount using
 * the shared .progress-fill back-ease transition. Keeps the mounting jank
 * out of the parent component and plays nicely with list stagger.
 */
function DomainProgressRow({
  Icon,
  label,
  completed,
  total,
  correctRate,
  pct,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  completed: number;
  total: number;
  correctRate: number;
  pct: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className="hover-lift flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/40">
      <Icon className="w-4 h-4 text-[var(--color-notion-text-secondary)] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <span className="text-sm text-[var(--color-notion-text)] truncate">{label}</span>
          <span className="text-xs text-[var(--color-notion-text-secondary)] flex-shrink-0 whitespace-nowrap tabular-nums">
            {completed}/{total} <span className="hidden sm:inline">题 · 正确率</span>
            <span className="sm:hidden">·</span> {correctRate}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--color-notion-bg-secondary)] rounded-full overflow-hidden">
          <div
            className="progress-fill h-full bg-[var(--color-notion-accent)] rounded-full"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function Progress() {
  const { questions, getCorrectRate } = useProgressStore();
  const { registry } = useQuestionStore();

  const totalCompleted = Object.keys(questions).length;
  const totalAttempts = Object.values(questions).flatMap((q) => q.quizAttempts).length;
  const correctRate = getCorrectRate();
  const wrongCount = Object.values(questions)
    .flatMap((q) => q.quizAttempts)
    .filter((a) => !a.isCorrect).length;

  // Per-domain stats
  const domainStats = ALL_DOMAINS.map((domain) => {
    const packs = registry?.packs.filter((p) => p.domain === domain) ?? [];
    const totalInDomain = packs.reduce((s, p) => s + p.questionCount, 0);
    const domainQuestionIds = Object.keys(questions).filter((id) => id.startsWith(domain));
    const completed = domainQuestionIds.filter((id) => questions[id]?.completedAt).length;
    const attempts = domainQuestionIds.flatMap((id) => questions[id]?.quizAttempts ?? []);
    const correct = attempts.filter((a) => a.isCorrect).length;
    return {
      domain,
      total: totalInDomain,
      completed,
      attempts: attempts.length,
      correctRate: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
    };
  }).filter((s) => s.total > 0 || s.completed > 0);

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[var(--color-notion-accent)]" /> 学习进度
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-6">
        你的学习数据总览
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 animate-stagger-up">
        <div className="hover-lift p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center hover:border-[var(--color-notion-accent)]/40">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-accent)] tabular-nums">
            <AnimatedNumber value={totalCompleted} duration={1100} />
          </div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">已完成题目</div>
        </div>
        <div className="hover-lift p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center hover:border-[var(--color-notion-correct)]/40">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-correct)] tabular-nums">
            <AnimatedNumber value={totalAttempts} duration={1100} />
          </div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">选择题作答</div>
        </div>
        <div className="hover-lift p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center hover:border-[var(--color-notion-warning)]/40">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-warning)] tabular-nums">
            <AnimatedNumber value={correctRate} suffix="%" duration={1100} />
          </div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">正确率</div>
        </div>
        <div className="hover-lift p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center hover:border-[var(--color-notion-error)]/40">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-error)] tabular-nums">
            <AnimatedNumber value={wrongCount} duration={1100} />
          </div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">错题数</div>
        </div>
      </div>

      {/* Per-domain breakdown */}
      {domainStats.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">各域进度</h2>
          <div className="space-y-3 animate-stagger-up" style={{ ['--stagger-step' as string]: '45ms' }}>
            {domainStats.map(({ domain, total, completed, correctRate: dr }) => {
              const Icon = DOMAIN_ICONS[domain as Domain];
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <DomainProgressRow
                  key={domain}
                  Icon={Icon}
                  label={DOMAIN_LABELS[domain as Domain]}
                  completed={completed}
                  total={total}
                  correctRate={dr}
                  pct={pct}
                />
              );
            })}
          </div>
        </div>
      )}

      {totalCompleted === 0 && (
        <div className="py-12 text-center text-[var(--color-notion-text-secondary)]">
          还没有学习记录，开始刷题吧
        </div>
      )}
    </div>
  );
}
