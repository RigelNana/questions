import { Link } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionStore } from '../stores/questionStore';
import { XCircle, ExternalLink } from 'lucide-react';

export function Review() {
  const { questions } = useProgressStore();
  const { getQuestionById } = useQuestionStore();

  const wrongAttempts = Object.values(questions).flatMap((q) =>
    q.quizAttempts.filter((a) => !a.isCorrect).map((a) => ({
      questionId: q.questionId,
      ...a,
    })),
  );

  // Group by question
  const groupedByQuestion = wrongAttempts.reduce<Record<string, typeof wrongAttempts>>((acc, item) => {
    if (!acc[item.questionId]) acc[item.questionId] = [];
    acc[item.questionId].push(item);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-2 flex items-center gap-2">
        <XCircle className="w-5 h-5 text-[var(--color-notion-error)]" /> 错题回顾
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-6">
        共 {wrongAttempts.length} 道错题，来自 {Object.keys(groupedByQuestion).length} 个知识点
      </p>

      {wrongAttempts.length === 0 ? (
        <div className="py-12 text-center text-[var(--color-notion-text-secondary)]">
          暂无错题，继续刷题吧
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByQuestion).map(([questionId, attempts]) => {
            const questionData = getQuestionById(questionId);
            return (
              <div
                key={questionId}
                className="rounded-lg border border-[var(--color-notion-border)] overflow-hidden"
              >
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--color-notion-bg-secondary)] border-b border-[var(--color-notion-border)] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0 sm:justify-between">
                  <span className="text-sm font-medium text-[var(--color-notion-text)] truncate">
                    {questionData?.title ?? questionId}
                  </span>
                  {questionData && (
                    <Link
                      to={`/domains/${questionData.domain}/${questionId}`}
                      className="text-xs text-[var(--color-notion-accent)] flex items-center gap-1 no-underline hover:underline flex-shrink-0"
                    >
                      查看题目 <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                <div className="divide-y divide-[var(--color-notion-border)]">
                  {attempts.map((item, i) => (
                    <div key={`${item.quizId}-${i}`} className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="text-sm text-[var(--color-notion-text)]">
                        {item.quizId}
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs text-[var(--color-notion-text-secondary)]">
                        <span>你的答案: <span className="text-[var(--color-notion-error)] font-medium">{item.selectedAnswer}</span></span>
                        <span className="hidden sm:inline">{new Date(item.attemptedAt).toLocaleString()}</span>
                        <span className="sm:hidden">{new Date(item.attemptedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
