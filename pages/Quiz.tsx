import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionType } from '../types';
import { QuizContext } from '../App';
import { Check, X, ArrowRight, RefreshCcw } from 'lucide-react';

export default function QuizPage() {
  const { quizQuestions } = useContext(QuizContext);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Set<string>>(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!quizQuestions || quizQuestions.length === 0) {
      navigate('/');
    }
  }, [quizQuestions, navigate]);

  if (!quizQuestions || quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;
  const isSingleChoice = currentQuestion.type === QuestionType.SINGLE_CHOICE;

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;

    if (isSingleChoice) {
      setSelectedOptionIds(new Set([optionId]));
    } else {
      const newSelected = new Set(selectedOptionIds);
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
      setSelectedOptionIds(newSelected);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIds.size === 0) {
      alert('请选择至少一个答案');
      return;
    }

    setIsAnswered(true);

    // 判断对错
    const selectedArray = Array.from(selectedOptionIds);
    const correctArray = currentQuestion.correctOptionIds;
    const isCorrect =
      selectedArray.length === correctArray.length &&
      selectedArray.every(id => correctArray.includes(id));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIds(new Set());
      setIsAnswered(false);
    }
  };

  if (finished) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12">
        <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">练习完成！</h2>
        <p className="text-gray-500 mb-8">你的分数是</p>
        <div className="text-6xl font-black text-indigo-600 mb-8">
          {Math.round((score / quizQuestions.length) * 100)}%
        </div>
        <div className="text-gray-600 mb-8">
          {score} / {quizQuestions.length} 答对
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors inline-flex items-center"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          继续练习
        </button>
      </div>
    );
  }

  // 计算进度
  const progress = ((currentIndex) / quizQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
              {currentQuestion.category}
              {isSingleChoice ? ' - 单选' : ' - 多选'}
            </span>
            <span className="text-gray-400 text-sm font-medium">
              {currentIndex + 1}/{quizQuestions.length}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              // 根据选择状态确定样式
              let buttonStyle = "border-gray-200 hover:bg-gray-50 text-gray-700";
              let icon = null;

              if (isAnswered) {
                const isSelected = selectedOptionIds.has(option.id);
                const isCorrect = currentQuestion.correctOptionIds.includes(option.id);

                if (isCorrect) {
                  buttonStyle = "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500";
                  icon = <Check className="w-5 h-5 text-green-600" />;
                } else if (isSelected && !isCorrect) {
                  buttonStyle = "bg-red-50 border-red-300 text-red-700";
                  icon = <X className="w-5 h-5 text-red-600" />;
                } else {
                  buttonStyle = "opacity-50 border-gray-100";
                }
              } else if (selectedOptionIds.has(option.id)) {
                buttonStyle = "border-indigo-600 bg-indigo-50 text-indigo-700";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
                >
                  <span className="font-medium">{option.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* 选择后反馈 */}
          {isAnswered && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <span className="font-bold block mb-1">解答：</span>
                  {currentQuestion.explanation || "没有提供题目解答"}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transition-all"
                >
                  {isLastQuestion ? "完成练习" : "下一题"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 多选提交按钮 */}
          {!isAnswered && !isSingleChoice && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOptionIds.size === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {/* 单选自动提交 */}
          {selectedOptionIds.size > 0 && !isAnswered && isSingleChoice && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transition-all"
              >
                提交答案
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}