import { useProgressStore } from '../stores/progressStore';
import { useQuestionStore } from '../stores/questionStore';
import { TrendingUp } from 'lucide-react';
import { ALL_DOMAINS, DOMAIN_LABELS, DOMAIN_ICONS, type Domain } from '../types';

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-accent)]">{totalCompleted}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">已完成题目</div>
        </div>
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-correct)]">{totalAttempts}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">选择题作答</div>
        </div>
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-warning)]">{correctRate}%</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">正确率</div>
        </div>
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--color-notion-error)]">{wrongCount}</div>
          <div className="text-xs sm:text-sm text-[var(--color-notion-text-secondary)] mt-1">错题数</div>
        </div>
      </div>

      {/* Per-domain breakdown */}
      {domainStats.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">各域进度</h2>
          <div className="space-y-3">
            {domainStats.map(({ domain, total, completed, correctRate: dr }) => {
              const Icon = DOMAIN_ICONS[domain as Domain];
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={domain} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-[var(--color-notion-border)]">
                  <Icon className="w-4 h-4 text-[var(--color-notion-text-secondary)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-sm text-[var(--color-notion-text)] truncate">{DOMAIN_LABELS[domain as Domain]}</span>
                      <span className="text-xs text-[var(--color-notion-text-secondary)] flex-shrink-0 whitespace-nowrap">{completed}/{total} <span className="hidden sm:inline">题 · 正确率</span><span className="sm:hidden">·</span> {dr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--color-notion-bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-notion-accent)] rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
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
