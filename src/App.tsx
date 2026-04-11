import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const QuestionList = lazy(() => import('./pages/QuestionList').then((m) => ({ default: m.QuestionList })));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail').then((m) => ({ default: m.QuestionDetail })));
const Review = lazy(() => import('./pages/Review').then((m) => ({ default: m.Review })));
const Progress = lazy(() => import('./pages/Progress').then((m) => ({ default: m.Progress })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-[var(--color-notion-text-secondary)]">
        <div className="w-4 h-4 border-2 border-[var(--color-notion-accent)] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">加载中...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/questions">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="domains/:domain" element={<Suspense fallback={<PageLoader />}><QuestionList /></Suspense>} />
          <Route path="domains/:domain/:questionId" element={<Suspense fallback={<PageLoader />}><QuestionDetail /></Suspense>} />
          <Route path="review" element={<Suspense fallback={<PageLoader />}><Review /></Suspense>} />
          <Route path="progress" element={<Suspense fallback={<PageLoader />}><Progress /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
