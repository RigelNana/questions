import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import { useHighlightStore } from '../stores/highlightStore';
import { HighlightableMarkdown } from '../components/question/HighlightableMarkdown';
import { DifficultyBadge } from '../components/filter/DifficultyBadge';
import { TypeBadge } from '../components/filter/TypeBadge';
import { QuizPanel } from '../components/question/QuizPanel';
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain, type QuizAttempt } from '../types';
import { Lightbulb, Star, ChevronUp, ChevronLeft, ChevronRight, BookOpen, ClipboardCheck, Highlighter } from 'lucide-react';

type DetailTab = 'content' | 'quiz';

export function QuestionDetail() {
  const { domain, questionId } = useParams<{ domain: string; questionId: string }>();
  const navigate = useNavigate();
  const {
    fetchIndexForDomain,
    fetchPackForQuestion,
    getQuestionSummariesForDomain,
    getQuestionById,
  } = useQuestionStore();
  const {
    recordQuizAttempt,
    markAnswerViewed,
    toggleBookmark,
    isBookmarked,
    getQuestionProgress,
    setLastVisited,
  } = useProgressStore();
  // 必须返回稳定的原始值（number），否则每次 render 都会产生新数组引用，
  // 触发 useSyncExternalStore 的 Object.is 判定为"变化"，造成无限循环 (React #185)。
  const questionHighlightCount = useHighlightStore((s) => {
    if (!questionId) return 0;
    const prefix = `${questionId}::`;
    let total = 0;
    for (const k of Object.keys(s.byKey)) {
      if (k.startsWith(prefix)) total += s.byKey[k].length;
    }
    return total;
  });
  const clearForQuestion = useHighlightStore((s) => s.clearForQuestion);

  const [showAnswer, setShowAnswer] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('content');
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (domain && questionId) {
      setLoadFailed(false);
      fetchIndexForDomain(domain as Domain)
        .then(() => fetchPackForQuestion(domain as Domain, questionId))
        .then((loaded) => {
          if (!cancelled && !loaded) setLoadFailed(true);
        })
        .catch(() => {
          if (!cancelled) setLoadFailed(true);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [domain, questionId, fetchIndexForDomain, fetchPackForQuestion]);

  useEffect(() => {
    if (domain && questionId) {
      setLastVisited(domain, questionId);
    }
  }, [domain, questionId, setLastVisited]);

  const domainKey = domain as Domain;
  const question = questionId ? getQuestionById(questionId) : undefined;
  const allQuestions = domain ? getQuestionSummariesForDomain(domainKey) : [];
  const currentIndex = allQuestions.findIndex((q) => q.id === questionId);
  const progress = questionId ? getQuestionProgress(questionId) : undefined;
  const bookmarked = questionId ? isBookmarked(questionId) : false;

  const handleToggleAnswer = () => {
    if (!showAnswer && questionId) {
      markAnswerViewed(questionId);
    }
    setShowAnswer((s) => !s);
  };

  const handleQuizAttempt = (attempt: QuizAttempt) => {
    if (questionId) {
      recordQuizAttempt(questionId, attempt);
    }
  };

  const handleNav = (direction: -1 | 1) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < allQuestions.length) {
      navigate(`/domains/${domain}/${allQuestions[newIndex].id}`);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowLeft':
          handleNav(-1);
          break;
        case 'ArrowRight':
          handleNav(1);
          break;
        case ' ':
          e.preventDefault();
          handleToggleAnswer();
          break;
        case 's':
        case 'S':
          if (questionId) toggleBookmark(questionId);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (!question && loadFailed) {
    return (
      <div className="py-16 text-center text-[var(--color-notion-text-secondary)]">
        题目不存在或加载失败
      </div>
    );
  }

  if (!question) {
    return (
      <div className="py-16 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-[var(--color-notion-text-secondary)]">
          <div className="w-5 h-5 border-2 border-[var(--color-notion-accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">题目加载中...</span>
        </div>
      </div>
    );
  }

  const DomainIcon = DOMAIN_ICONS[domainKey];
  const hasQuiz = question.quiz.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-notion-text-secondary)] mb-5 flex items-center flex-wrap gap-y-1">
        <Link to="/" className="hover:text-[var(--color-notion-accent)] no-underline transition-colors">首页</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link to={`/domains/${domain}`} className="hover:text-[var(--color-notion-accent)] no-underline flex items-center gap-1 transition-colors">
          <DomainIcon className="w-3.5 h-3.5" /> {DOMAIN_LABELS[domainKey]}
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-[var(--color-notion-text)] truncate">{question.title}</span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <TypeBadge type={question.type} />
        <DifficultyBadge level={question.difficulty} />
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[var(--color-notion-bg-secondary)] text-[var(--color-notion-text-secondary)] px-2.5 py-0.5 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-6 leading-tight tracking-tight">
        {question.title}
      </h1>

      {/* Tab bar */}
      {hasQuiz && (
        <div className="mb-6 flex min-w-0 items-stretch gap-1 border-b border-[var(--color-notion-border)]">
          <button
            onClick={() => setActiveTab('content')}
            className={`-mb-px flex min-w-0 flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 sm:flex-none sm:px-4 ${
              activeTab === 'content'
                ? 'border-[var(--color-notion-accent)] text-[var(--color-notion-accent)]'
                : 'border-transparent text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 题目内容
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`-mb-px flex min-w-0 flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 sm:flex-none sm:px-4 ${
              activeTab === 'quiz'
                ? 'border-[var(--color-notion-accent)] text-[var(--color-notion-accent)]'
                : 'border-transparent text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" /> 选择题 ({question.quiz.length})
          </button>
        </div>
      )}

      {/* Tab: Content */}
      {activeTab === 'content' && (
        <div className="animate-fade-in">
          {/* Content (可划线批注) */}
          <div className="p-4 sm:p-6 rounded-xl border border-[var(--color-notion-border)] mb-3">
            <HighlightableMarkdown
              content={question.content}
              questionId={question.id}
              section="content"
            />
          </div>

          {/* Highlight hint / summary */}
          <div className="mb-5 flex items-center justify-between gap-2 text-xs text-[var(--color-notion-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Highlighter className="w-3.5 h-3.5 text-[var(--color-notion-accent)]" />
              {questionHighlightCount > 0 ? (
                <>已有 <span className="font-semibold text-[var(--color-notion-text)]">{questionHighlightCount}</span> 条划线批注 · 选中文字可继续划线</>
              ) : (
                <>选中文字即可划线批注 · 点击划线可编辑</>
              )}
            </span>
            {questionHighlightCount > 0 && (
              <button
                onClick={() => {
                  if (!questionId) return;
                  if (window.confirm('确认清除本题全部划线批注？')) clearForQuestion(questionId);
                }}
                className="text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-error)] transition-colors"
              >
                清除全部
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={handleToggleAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-notion-border)] px-4 py-2 text-sm font-medium text-[var(--color-notion-text)] transition-all duration-200 hover:border-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)] sm:w-auto sm:justify-start sm:py-2.5"
            >
              {showAnswer ? <><ChevronUp className="w-4 h-4" /> 收起答案</> : <><Lightbulb className="w-4 h-4 text-[var(--color-notion-warning)]" /> 显示答案</>}
            </button>
            <button
              onClick={() => questionId && toggleBookmark(questionId)}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 sm:w-auto sm:justify-start sm:py-2.5 ${
                bookmarked
                  ? 'border-[var(--color-notion-warning)] bg-[var(--color-notion-warning-light)] text-[var(--color-notion-warning)]'
                  : 'border-[var(--color-notion-border)] text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-warning)] hover:bg-[var(--color-notion-warning-light)]'
              }`}
            >
              <Star className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? '已收藏' : '收藏'}
            </button>
            {hasQuiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-notion-border)] px-4 py-2 text-sm font-medium text-[var(--color-notion-text)] transition-all duration-200 hover:border-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)] sm:w-auto sm:justify-start sm:py-2.5"
              >
                <ClipboardCheck className="w-4 h-4" /> 开始做题
              </button>
            )}
          </div>

          {/* Answer */}
          {showAnswer && (
            <div className="mb-5 p-4 sm:p-6 rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] animate-slide-up">
              <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">
                参考答案
              </h3>

              {/* Key points */}
              {question.keyPoints.length > 0 && (
                <div className="mb-5 p-4 bg-[var(--color-notion-bg)] rounded-lg border border-[var(--color-notion-border)]">
                  <h4 className="text-sm font-medium text-[var(--color-notion-text)] mb-2.5">核心要点</h4>
                  <ul className="text-sm text-[var(--color-notion-text-secondary)] space-y-1.5 pl-4 list-disc">
                    {question.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <HighlightableMarkdown
                content={question.answer}
                questionId={question.id}
                section="answer"
              />

              {/* References */}
              {question.references && question.references.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[var(--color-notion-border)]">
                  <h4 className="text-xs font-medium text-[var(--color-notion-text-secondary)] mb-2">参考资料</h4>
                  <ul className="text-xs text-[var(--color-notion-accent)] space-y-1">
                    {question.references.map((ref, i) => {
                      const url = typeof ref === 'string' ? ref : ref.url;
                      const label = typeof ref === 'string' ? ref : ref.title;
                      return (
                        <li key={i}>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{label}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Quiz */}
      {activeTab === 'quiz' && hasQuiz && (
        <div className="animate-fade-in">
          <QuizPanel
            quizzes={question.quiz}
            existingAttempts={progress?.quizAttempts ?? []}
            onAttempt={handleQuizAttempt}
          />
        </div>
      )}

      {/* Navigation — with generous bottom margin */}
      <div className="flex items-center justify-between pt-5 mt-6 mb-8 border-t border-[var(--color-notion-border)]">
        <button
          onClick={() => handleNav(-1)}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1.5 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" /> 上一题
        </button>
        <span className="text-xs text-[var(--color-notion-text-secondary)] font-mono">
          {currentIndex + 1} / {allQuestions.length}
        </span>
        <button
          onClick={() => handleNav(1)}
          disabled={currentIndex >= allQuestions.length - 1}
          className="flex items-center gap-1.5 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
        >
          下一题 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
