import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { DifficultyBadge } from '../components/filter/DifficultyBadge';
import { TypeBadge } from '../components/filter/TypeBadge';
import { QuizPanel } from '../components/question/QuizPanel';
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain, type QuizAttempt } from '../types';
import { Lightbulb, Star, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export function QuestionDetail() {
  const { domain, questionId } = useParams<{ domain: string; questionId: string }>();
  const navigate = useNavigate();
  const {
    registry,
    fetchRegistry,
    fetchPacksForDomain,
    getQuestionsForDomain,
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

  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  useEffect(() => {
    if (registry && domain) {
      fetchPacksForDomain(domain as Domain);
    }
  }, [registry, domain, fetchPacksForDomain]);

  useEffect(() => {
    if (domain && questionId) {
      setLastVisited(domain, questionId);
    }
  }, [domain, questionId, setLastVisited]);

  const domainKey = domain as Domain;
  const question = questionId ? getQuestionById(questionId) : undefined;
  const allQuestions = getQuestionsForDomain(domainKey);
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
      setShowAnswer(false);
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

  if (!question) {
    return (
      <div className="py-12 text-center text-[var(--color-notion-text-secondary)]">
        题目加载中...
      </div>
    );
  }

  const DomainIcon = DOMAIN_ICONS[domainKey];

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--color-notion-text-secondary)] mb-4 flex items-center flex-wrap">
        <Link to="/" className="hover:text-[var(--color-notion-accent)] no-underline">首页</Link>
        <span className="mx-2">/</span>
        <Link to={`/domains/${domain}`} className="hover:text-[var(--color-notion-accent)] no-underline flex items-center gap-1">
          <DomainIcon className="w-3.5 h-3.5" /> {DOMAIN_LABELS[domainKey]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-notion-text)]">{question.title}</span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <TypeBadge type={question.type} />
        <DifficultyBadge level={question.difficulty} />
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[var(--color-notion-bg-secondary)] text-[var(--color-notion-text-secondary)] px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-5 leading-tight tracking-tight">
        {question.title}
      </h1>

      {/* Two-column layout: content left, quiz right on xl+ */}
      <div className="flex flex-col xl:flex-row xl:gap-6">
        {/* Left column: question content + answer */}
        <div className="flex-1 min-w-0 xl:max-w-[60%]">
          {/* Content */}
          <div className="p-3 sm:p-5 rounded-lg border border-[var(--color-notion-border)] mb-5">
            <MarkdownRenderer content={question.content} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 mb-5">
            <button
              onClick={handleToggleAnswer}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium rounded border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)] transition-colors text-[var(--color-notion-text)]"
            >
              {showAnswer ? <><ChevronUp className="w-4 h-4" /> 收起答案</> : <><Lightbulb className="w-4 h-4" /> 显示答案</>}
            </button>
            <button
              onClick={() => questionId && toggleBookmark(questionId)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium rounded border transition-colors ${
                bookmarked
                  ? 'border-[var(--color-notion-warning)] bg-[var(--color-notion-warning-light)] text-[var(--color-notion-warning)]'
                  : 'border-[var(--color-notion-border)] text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-warning)]'
              }`}
            >
              <Star className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? '已收藏' : '收藏'}
            </button>
          </div>

          {/* Answer */}
          {showAnswer && (
            <div className="mb-5 p-3 sm:p-5 rounded-lg border border-[var(--color-notion-correct)] bg-[var(--color-notion-correct-light)] animate-slide-up">
              <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-3">
                参考答案
              </h3>

              {/* Key points */}
              {question.keyPoints.length > 0 && (
                <div className="mb-4 p-3 bg-[var(--color-notion-bg)] rounded border border-[var(--color-notion-border)]">
                  <h4 className="text-sm font-medium text-[var(--color-notion-text)] mb-2">核心要点</h4>
                  <ul className="text-sm text-[var(--color-notion-text-secondary)] space-y-1 pl-4 list-disc">
                    {question.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <MarkdownRenderer content={question.answer} />

              {/* References */}
              {question.references && question.references.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--color-notion-border)]">
                  <h4 className="text-xs font-medium text-[var(--color-notion-text-secondary)] mb-1">参考资料</h4>
                  <ul className="text-xs text-[var(--color-notion-accent)] space-y-0.5">
                    {question.references.map((ref, i) => (
                      <li key={i}>
                        <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Quiz panel (sticky on xl+) */}
        {question.quiz.length > 0 && (
          <div className="xl:w-[40%] xl:flex-shrink-0 mb-5">
            <div className="xl:sticky xl:top-16">
              <QuizPanel
                quizzes={question.quiz}
                existingAttempts={progress?.quizAttempts ?? []}
                onAttempt={handleQuizAttempt}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-notion-border)]">
        <button
          onClick={() => handleNav(-1)}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)] disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> 上一题
        </button>
        <span className="text-xs text-[var(--color-notion-text-secondary)]">
          {currentIndex + 1} / {allQuestions.length}
        </span>
        <button
          onClick={() => handleNav(1)}
          disabled={currentIndex >= allQuestions.length - 1}
          className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)] disabled:opacity-30 transition-colors"
        >
          下一题 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
