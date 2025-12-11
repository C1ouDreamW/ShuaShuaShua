import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Layout, CheckCircle, BrainCircuit, Loader, SquarePen, Pen } from 'lucide-react';
import Home from './pages/Home';
import QuizSetup from './pages/Setup';
import QuizPage from './pages/Quiz';
import AdminDashboard from './pages/Admin';
import { Question, Category } from './types';
import { questionService } from './services/questionService';
import { categoryService } from './services/categoryService';

// 创建一个简单的Context用于在主界面和后台页面之间传递生成的题目
export const QuizContext = React.createContext<{
  quizQuestions: Question[];
  setQuizQuestions: (q: Question[]) => void;
  adminQuestions: Question[];
  addAdminQuestion: (q: Question) => void;
  deleteAdminQuestion: (id: string) => void;
  loadingAdminQuestions: boolean;
  refreshAdminQuestions: () => Promise<void>;
  categories: Category[];
  addCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  loadingCategories: boolean;
  refreshCategories: () => Promise<void>;
}>({
  quizQuestions: [],
  setQuizQuestions: () => { },
  adminQuestions: [],
  addAdminQuestion: () => { },
  deleteAdminQuestion: () => { },
  loadingAdminQuestions: false,
  refreshAdminQuestions: async () => { },
  categories: [],
  addCategory: () => { },
  deleteCategory: () => { },
  loadingCategories: false,
  refreshCategories: async () => { }
});

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => window.location.hash = '#'}>
            <SquarePen className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">ShuaShuaShua</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Pen className="w-4 h-4 mr-1" />
              练习
            </Link>
            <Link
              to="/admin"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Layout className="w-4 h-4 mr-1" />
              后台
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [adminQuestions, setAdminQuestions] = useState<Question[]>([]);
  const [loadingAdminQuestions, setLoadingAdminQuestions] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 初始化时从 Supabase 加载题目和类别
  useEffect(() => {
    loadAdminQuestions();
    loadCategories();
  }, []);

  const loadAdminQuestions = async () => {
    try {
      setLoadingAdminQuestions(true);
      const questions = await questionService.getAllQuestions();
      setAdminQuestions(questions);
    } catch (error) {
      console.error('加载题目失败:', error);
    } finally {
      setLoadingAdminQuestions(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const cats = await categoryService.getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('加载类别失败:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const addAdminQuestion = async (q: Question) => {
    try {
      const createdQuestion = await questionService.createQuestion(q);
      setAdminQuestions(prev => [createdQuestion, ...prev]);
    } catch (error) {
      console.error('添加题目失败:', error);
      throw error;
    }
  };

  const deleteAdminQuestion = async (questionId: string) => {
    try {
      await questionService.deleteQuestion(questionId);
      setAdminQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (error) {
      console.error('删除题目失败:', error);
      throw error;
    }
  };

  const refreshAdminQuestions = async () => {
    await loadAdminQuestions();
  };

  const addCategory = async (c: Category) => {
    try {
      const createdCategory = await categoryService.createCategory(c);
      setCategories(prev => [createdCategory, ...prev]);
    } catch (error) {
      console.error('添加类别失败:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('删除类别失败:', error);
      throw error;
    }
  };

  const refreshCategories = async () => {
    await loadCategories();
  };

  return (
    <QuizContext.Provider value={{
      quizQuestions,
      setQuizQuestions,
      adminQuestions,
      addAdminQuestion,
      deleteAdminQuestion,
      loadingAdminQuestions,
      refreshAdminQuestions,
      categories,
      addCategory,
      deleteCategory,
      loadingCategories,
      refreshCategories
    }}>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/setup/:topicId" element={<QuizSetup />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QuizContext.Provider>
  );
}