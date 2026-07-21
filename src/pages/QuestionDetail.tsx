import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import { useHighlightStore } from '../stores/highlightStore';
import { HighlightableMarkdown } from '../components/question/HighlightableMarkdown';
import { DifficultyBadge } from '../components/filter/DifficultyBadge';
import { TypeBadge } from '../components/filter/TypeBadge';
import { QuizPanel } from '../components/question/QuizPanel';
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain, type QuizAttempt } from '../types';
import { Lightbulb, Star, ChevronUp, ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, Highlighter } from 'lucide-react';

type DetailTab = 'content' | 'quiz';

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
    settings,
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

  const [activeTab, setActiveTab] = useState<DetailTab>('content');
  const [answerVisibility, setAnswerVisibility] = useState({
    key: '',
    visible: false,
  });
  const [questionJumpState, setQuestionJumpState] = useState({
    questionId: '',
    value: '1',
  });

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
  const answerStateKey = `${questionId ?? ''}:${settings.autoExpandAnswer}`;
  const showAnswer = answerVisibility.key === answerStateKey
    ? answerVisibility.visible
    : settings.autoExpandAnswer;
  const questionJump = questionJumpState.questionId === questionId
    ? questionJumpState.value
    : String(Math.max(1, currentIndex + 1));

  useEffect(() => {
    if (settings.autoExpandAnswer && questionId) {
      markAnswerViewed(questionId);
    }
  }, [questionId, settings.autoExpandAnswer, markAnswerViewed]);

  const handleToggleAnswer = useCallback(() => {
    if (!showAnswer && questionId) {
      markAnswerViewed(questionId);
    }
    setAnswerVisibility({
      key: answerStateKey,
      visible: !showAnswer,
    });
  }, [answerStateKey, markAnswerViewed, questionId, showAnswer]);

  const handleQuizAttempt = (attempt: QuizAttempt) => {
    if (questionId) {
      recordQuizAttempt(questionId, attempt);
    }
  };

  const handleNav = useCallback((direction: -1 | 1) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < allQuestions.length) {
      navigate(`/domains/${domain}/${allQuestions[newIndex].id}`);
    }
  }, [allQuestions, currentIndex, domain, navigate]);

  const handleQuestionJump = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requested = Number.parseInt(questionJump, 10);
    if (Number.isNaN(requested)) {
      setQuestionJumpState({
        questionId: questionId ?? '',
        value: String(currentIndex + 1),
      });
      return;
    }
    const targetIndex = Math.min(allQuestions.length, Math.max(1, requested)) - 1;
    const target = allQuestions[targetIndex];
    if (target) navigate(`/domains/${domain}/${target.id}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement
      ) return;
      switch (e.key) {
        case 'ArrowLeft':
          if (activeTab === 'content') {
            e.preventDefault();
            handleNav(-1);
          }
          break;
        case 'ArrowRight':
          if (activeTab === 'content') {
            e.preventDefault();
            handleNav(1);
          }
          break;
        case ' ':
          if (activeTab === 'content') {
            e.preventDefault();
            handleToggleAnswer();
          }
          break;
        case 's':
        case 'S':
          if (questionId) toggleBookmark(questionId);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, handleNav, handleToggleAnswer, questionId, toggleBookmark]);

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
          <div className={`grid items-start gap-4 ${
            settings.questionLayout === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
          }`}>
            {/* Question (可划线批注) */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-4 py-3 text-sm font-semibold text-[var(--color-notion-text)]">
                <BookOpen className="h-4 w-4 text-[var(--color-notion-accent)]" /> 问题
              </div>
              <div className="p-4 sm:p-6">
                <HighlightableMarkdown
                  content={question.content}
                  questionId={question.id}
                  section="content"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-[var(--color-notion-border)] px-4 py-3 text-xs text-[var(--color-notion-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Highlighter className="h-3.5 w-3.5 text-[var(--color-notion-accent)]" />
                  {questionHighlightCount > 0 ? (
                    <>已有 <span className="font-semibold text-[var(--color-notion-text)]">{questionHighlightCount}</span> 条批注</>
                  ) : (
                    <>选中文字即可划线批注</>
                  )}
                </span>
                {questionHighlightCount > 0 && (
                  <button
                    onClick={() => {
                      if (!questionId) return;
                      if (window.confirm('确认清除本题全部划线批注？')) clearForQuestion(questionId);
                    }}
                    className="flex-shrink-0 text-[var(--color-notion-text-secondary)] transition-colors hover:text-[var(--color-notion-error)]"
                  >
                    清除全部
                  </button>
                )}
              </div>
            </section>

            {/* Answer */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--color-notion-border)] px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-notion-text)]">
                  <Lightbulb className="h-4 w-4 text-[var(--color-notion-warning)]" /> 参考答案
                </h3>
                <button
                  onClick={handleToggleAnswer}
                  className="compact-control text-xs text-[var(--color-notion-accent)] transition-opacity hover:opacity-70"
                >
                  {showAnswer ? '收起' : '展开'}
                </button>
              </div>

              {showAnswer ? (
                <div className="p-4 animate-slide-up sm:p-6">
                  {question.keyPoints.length > 0 && (
                    <div className="mb-5 rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] p-4">
                      <h4 className="mb-2.5 text-sm font-medium text-[var(--color-notion-text)]">核心要点</h4>
                      <ul className="list-disc space-y-1.5 pl-4 text-sm text-[var(--color-notion-text-secondary)]">
                        {question.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <HighlightableMarkdown
                    content={question.answer}
                    questionId={question.id}
                    section="answer"
                  />

                  {question.references && question.references.length > 0 && (
                    <div className="mt-5 border-t border-[var(--color-notion-border)] pt-4">
                      <h4 className="mb-2 text-xs font-medium text-[var(--color-notion-text-secondary)]">参考资料</h4>
                      <ul className="space-y-1 text-xs text-[var(--color-notion-accent)]">
                        {question.references.map((reference, index) => {
                          const url = typeof reference === 'string' ? reference : reference.url;
                          const label = typeof reference === 'string' ? reference : reference.title;
                          return (
                            <li key={index}>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{label}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-44 flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-notion-warning-light)]">
                    <Lightbulb className="h-5 w-5 text-[var(--color-notion-warning)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-notion-text)]">先独立思考，再查看答案</p>
                    <p className="mt-1 text-xs text-[var(--color-notion-text-secondary)]">也可以按空格键快速展开</p>
                  </div>
                  <button
                    onClick={handleToggleAnswer}
                    className="rounded-lg bg-[var(--color-notion-accent)] px-4 py-2 text-sm font-medium text-[var(--color-notion-on-accent)] transition-opacity hover:opacity-90 active-press"
                  >
                    显示答案
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Action buttons */}
          <div className="mb-5 mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={handleToggleAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-notion-border)] px-4 py-2 text-sm font-medium text-[var(--color-notion-text)] transition-all duration-200 hover:border-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)] sm:w-auto sm:justify-start sm:py-2.5"
            >
              {showAnswer ? <><ChevronUp className="w-4 h-4" /> 收起答案</> : <><Lightbulb className="w-4 h-4 text-[var(--color-notion-warning)]" /> 显示答案</>}
            </button>
            <button
              onClick={() => questionId && toggleBookmark(questionId)}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active-press sm:w-auto sm:justify-start sm:py-2.5 ${
                bookmarked
                  ? 'border-[var(--color-notion-warning)] bg-[var(--color-notion-warning-light)] text-[var(--color-notion-warning)]'
                  : 'border-[var(--color-notion-border)] text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-warning)] hover:bg-[var(--color-notion-warning-light)]'
              }`}
            >
              <Star className={`w-4 h-4 ${bookmarked ? 'fill-current animate-spring-pop' : ''}`} />
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
        </div>
      )}

      {/* Tab: Quiz */}
      {activeTab === 'quiz' && hasQuiz && (
        <div className="animate-fade-in">
          <QuizPanel
            quizzes={question.quiz}
            existingAttempts={progress?.quizAttempts ?? []}
            onAttempt={handleQuizAttempt}
            onBoundaryNavigate={handleNav}
            hasPreviousQuestion={currentIndex > 0}
            hasNextQuestion={currentIndex < allQuestions.length - 1}
          />
        </div>
      )}

      {/* Question navigation — visually distinct from quiz internal nav */}
      <div className="flex items-center justify-between pt-5 mt-6 mb-8 border-t border-[var(--color-notion-border)]">
        <button
          onClick={() => handleNav(-1)}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)] disabled:opacity-30 transition-colors duration-200 active-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">上一知识点</span>
          <span className="sm:hidden">上一个</span>
        </button>
        <form onSubmit={handleQuestionJump} className="flex items-center gap-1.5">
          <label htmlFor="question-jump" className="hidden text-xs text-[var(--color-notion-text-secondary)] sm:inline">
            知识点
          </label>
          <input
            id="question-jump"
            type="number"
            min={1}
            max={allQuestions.length}
            value={questionJump}
            onChange={(event) => setQuestionJumpState({
              questionId: questionId ?? '',
              value: event.target.value,
            })}
            onBlur={() => {
              if (!questionJump) {
                setQuestionJumpState({
                  questionId: questionId ?? '',
                  value: String(currentIndex + 1),
                });
              }
            }}
            className="search-control compact-control h-8 w-14 rounded-md border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-2 text-center text-xs text-[var(--color-notion-text)]"
            aria-label={`跳转知识点，范围 1 到 ${allQuestions.length}`}
          />
          <span className="text-xs font-mono text-[var(--color-notion-text-secondary)]">
            / {allQuestions.length}
          </span>
          <button
            type="submit"
            className="compact-control inline-flex h-8 items-center rounded-md border border-[var(--color-notion-border)] px-2 text-xs text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-accent)] hover:text-[var(--color-notion-accent)]"
          >
            跳转
          </button>
        </form>
        <button
          onClick={() => handleNav(1)}
          disabled={currentIndex >= allQuestions.length - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)] disabled:opacity-30 transition-colors duration-200 active-press"
        >
          <span className="hidden sm:inline">下一知识点</span>
          <span className="sm:hidden">下一个</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
