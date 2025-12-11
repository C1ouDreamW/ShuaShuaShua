import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizMode, QuestionType } from '../types';
import { prepareQuiz } from '../utils';
import { QuizContext } from '../App';
import { Shuffle, ListOrdered, Play, AlertCircle } from 'lucide-react';

export default function QuizSetup() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { setQuizQuestions, adminQuestions, categories } = useContext(QuizContext);

  const [mode, setMode] = useState<QuizMode>(QuizMode.SEQUENTIAL);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionTypeFilter, setQuestionTypeFilter] = useState<'ALL' | 'SINGLE' | 'MULTIPLE'>('ALL');
  const [error, setError] = useState<string | null>(null);

  const category = categories.find(c => c.id === topicId);

  if (!category) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-8 text-center">
        <p className="text-gray-600 text-lg">未找到该类别</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          返回首页
        </button>
      </div>
    );
  }

  // 获取该分类的题目，并按类型过滤
  const categoryQuestions = adminQuestions.filter(q => q.category === category.name);
  const filteredQuestions = categoryQuestions.filter(q => {
    if (questionTypeFilter === 'ALL') return true;
    if (questionTypeFilter === 'SINGLE') return q.type === QuestionType.SINGLE_CHOICE;
    if (questionTypeFilter === 'MULTIPLE') return q.type === QuestionType.MULTIPLE_CHOICE;
    return true;
  });
  const availableCount = filteredQuestions.length;
  const maxQuestions = Math.min(questionCount, availableCount);

  const handleStartQuiz = () => {
    setError(null);

    // 检查是否有题目
    if (availableCount === 0) {
      setError(`还没有创建 "${category.name}" 的题目，请先前往后台创建题目`);
      return;
    }

    if (maxQuestions === 0) {
      setError(`该分类可用题目不足 ${questionCount} 道，请减少题目数量`);
      return;
    }

    // 应用刷题模式逻辑
    const isRandom = mode === QuizMode.RANDOM;
    const finalQuestions = prepareQuiz(filteredQuestions, isRandom, maxQuestions);

    setQuizQuestions(finalQuestions);
    navigate('/quiz');
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-8 text-white text-center">
        <h2 className="text-2xl font-bold">{category.name} 练习题</h2>
        <p className="text-indigo-100 mt-2">配置您的题目</p>
      </div>

      <div className="p-8 space-y-8">

        {/* 可用题目提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">该分类已有 {availableCount} 道题目</p>
            <p className="text-xs text-blue-600 mt-1">您可以在后台继续添加更多题目</p>
          </div>
        </div>

        {/* 模式选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">刷题模式</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode(QuizMode.SEQUENTIAL)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === QuizMode.SEQUENTIAL
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              <ListOrdered className="w-8 h-8 mb-2" />
              <span className="font-semibold">顺序模式</span>
              <span className="text-xs text-gray-500 mt-1">按题目保存顺序</span>
            </button>

            <button
              onClick={() => setMode(QuizMode.RANDOM)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === QuizMode.RANDOM
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              <Shuffle className="w-8 h-8 mb-2" />
              <span className="font-semibold">随机模式</span>
              <span className="text-xs text-gray-500 mt-1">随机抽取题目</span>
            </button>
          </div>
        </div>

        {/* 题目类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">题目类型</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setQuestionTypeFilter('ALL')}
              className={`p-3 rounded-lg border-2 transition-all font-medium ${questionTypeFilter === 'ALL'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              全部题目
            </button>
            <button
              onClick={() => setQuestionTypeFilter('SINGLE')}
              className={`p-3 rounded-lg border-2 transition-all font-medium ${questionTypeFilter === 'SINGLE'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              只有单选
            </button>
            <button
              onClick={() => setQuestionTypeFilter('MULTIPLE')}
              className={`p-3 rounded-lg border-2 transition-all font-medium ${questionTypeFilter === 'MULTIPLE'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              只有多选
            </button>
          </div>
          {availableCount > 0 && availableCount !== categoryQuestions.length && (
            <p className="text-xs text-gray-500 mt-2">
              已筛选到 {availableCount} 道题目（总共 {categoryQuestions.length} 道）
            </p>
          )}
        </div>

        {/* 计算各类型题目数量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            题目数量： <span className="font-bold text-indigo-600">{questionCount}</span>
            {availableCount > 0 && <span className="text-gray-500 text-sm font-normal ml-2">(最多 {availableCount} 道)</span>}
          </label>
          <input
            type="range"
            min="1"
            max={availableCount || 10}
            step="1"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            disabled={availableCount === 0}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>{availableCount || 10}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleStartQuiz}
          disabled={availableCount === 0}
          className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          开始练习
          <Play className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}