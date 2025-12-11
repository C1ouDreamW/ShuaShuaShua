import React, { useState, useContext } from 'react';
import { QuizContext } from '../App';
import { Question, QuestionType, Option, Category } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Save, AlertCircle, Loader, X, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function AdminDashboard() {
  const { adminQuestions, addAdminQuestion, deleteAdminQuestion, loadingAdminQuestions, categories, addCategory, deleteCategory, loadingCategories } = useContext(QuizContext);
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'category'>('create');

  // 题目表格
  const [questionText, setQuestionText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories.length > 0 ? categories[0].name : '');
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
  const [options, setOptions] = useState<Option[]>([{ id: generateId(), text: '' }, { id: generateId(), text: '' }]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctIndices, setCorrectIndices] = useState<number[]>([0]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 种类表格
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Cpu');
  const [categoryColor, setCategoryColor] = useState('bg-purple-100 text-purple-600');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [deletePasswordModal, setDeletePasswordModal] = useState<{ visible: boolean; categoryId?: string; categoryName?: string }>({ visible: false });
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState<string | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const ICON_OPTIONS = [
    { name: 'Cpu', label: '芯片' },
    { name: 'Code', label: '代码' },
    { name: 'Earth', label: '地球' },
    { name: 'Beaker', label: '烧杯' },
    { name: 'BookOpen', label: '书籍' },
    { name: 'Lightbulb', label: '灯泡' },
    { name: 'Rocket', label: '火箭' },
    { name: 'NotepadText', label: '笔记' },
  ];

  const COLOR_OPTIONS = [
    { value: 'bg-purple-100 text-purple-600', label: '紫色' },
    { value: 'bg-blue-100 text-blue-600', label: '蓝色' },
    { value: 'bg-amber-100 text-amber-600', label: '琥珀色' },
    { value: 'bg-green-100 text-green-600', label: '绿色' },
    { value: 'bg-red-100 text-red-600', label: '红色' },
    { value: 'bg-pink-100 text-pink-600', label: '粉色' },
    { value: 'bg-cyan-100 text-cyan-600', label: '青色' },
    { value: 'bg-indigo-100 text-indigo-600', label: '靛蓝色' },
  ];

  // 问题
  const handleAddOption = () => {
    setOptions([...options, { id: generateId(), text: '' }]);
  };

  const handleOptionChange = (idx: number, text: string) => {
    const newOptions = [...options];
    newOptions[idx].text = text;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    if (!questionText || options.some(o => !o.text) || !selectedCategory) {
      setSaveError("请填写所有字段");
      return;
    }

    const selectedCorrectIds = questionType === QuestionType.SINGLE_CHOICE
      ? [options[correctIndex].id]
      : correctIndices.map(idx => options[idx].id);

    if (selectedCorrectIds.length === 0) {
      setSaveError("请至少选择一个正确答案");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const newQuestion: Question = {
        id: generateId(),
        category: selectedCategory,
        type: questionType,
        text: questionText,
        options: options,
        correctOptionIds: selectedCorrectIds,
        explanation: "手动添加的题目",
        createdAt: Date.now()
      };

      await addAdminQuestion(newQuestion);

      // 表单复位
      setQuestionText('');
      setQuestionType(QuestionType.SINGLE_CHOICE);
      setOptions([{ id: generateId(), text: '' }, { id: generateId(), text: '' }]);
      setCorrectIndex(0);
      setCorrectIndices([0]);
      alert("题目添加成功！");
    } catch (error) {
      console.error('保存失败:', error);
      setSaveError("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm("确定要删除这道题目吗？")) return;

    setDeletingId(questionId);
    try {
      await deleteAdminQuestion(questionId);
      alert("删除成功！");
    } catch (error) {
      console.error('删除失败:', error);
      alert("删除失败，请重试");
    } finally {
      setDeletingId(null);
    }
  };

  // 种类
  const handleSaveCategory = async () => {
    if (!categoryName || !categoryIcon || !categoryColor) {
      setCategoryError("请填写所有字段");
      return;
    }

    setIsSavingCategory(true);
    setCategoryError(null);

    try {
      const newCategory: Category = {
        id: generateId(),
        name: categoryName,
        icon: categoryIcon,
        color: categoryColor,
        description: categoryDescription,
        createdAt: Date.now()
      };

      await addCategory(newCategory);

      // 表单复位
      setCategoryName('');
      setCategoryIcon('Cpu');
      setCategoryColor('bg-purple-100 text-purple-600');
      setCategoryDescription('');
      alert("类别添加成功！");
    } catch (error) {
      console.error('保存失败:', error);
      setCategoryError("保存失败，请重试");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategoryClick = async (categoryId: string, categoryName: string) => {
    // 检查该类别下有多少题目
    const count = adminQuestions.filter(q => q.category === categoryName).length;

    if (count > 0) {
      setDeletePasswordModal({
        visible: true,
        categoryId,
        categoryName: `${categoryName} (${count} 道题目)`
      });
    } else {
      if (window.confirm(`确定要删除类别 "${categoryName}" 吗？`)) {
        await performDeleteCategory(categoryId);
      }
    }
  };

  const performDeleteCategory = async (categoryId: string) => {
    setIsDeletingCategory(true);
    try {
      await deleteCategory(categoryId);
      alert("类别删除成功！");
    } catch (error) {
      console.error('删除失败:', error);
      alert("删除失败，请重试");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    const adminPassword = process.env.VITE_ADMIN_PASSWORD || '';

    if (deletePassword !== adminPassword) {
      setDeletePasswordError("密码错误，请重试");
      return;
    }

    setDeletePasswordError(null);
    await performDeleteCategory(deletePasswordModal.categoryId!);
    setDeletePasswordModal({ visible: false });
    setDeletePassword('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 导航栏 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-700">管理员面板</h3>
          </div>
          <nav className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'create' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              增加新题目
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              题库 ({adminQuestions.length})
              {loadingAdminQuestions && <Loader className="w-4 h-4 inline ml-2 animate-spin" />}
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'category' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              新增类别 ({categories.length})
              {loadingCategories && <Loader className="w-4 h-4 inline ml-2 animate-spin" />}
            </button>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="lg:col-span-3">
        {activeTab === 'create' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              创建题目
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  disabled={categories.length === 0}
                >
                  {categories.length === 0 ? (
                    <option disabled>请先创建类别</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">题目类型</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="questionType"
                      checked={questionType === QuestionType.SINGLE_CHOICE}
                      onChange={() => {
                        setQuestionType(QuestionType.SINGLE_CHOICE);
                        setCorrectIndex(0);
                        setCorrectIndices([0]);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">单选</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="questionType"
                      checked={questionType === QuestionType.MULTIPLE_CHOICE}
                      onChange={() => {
                        setQuestionType(QuestionType.MULTIPLE_CHOICE);
                        setCorrectIndices([0]);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">多选</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">题目文本</label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  placeholder="在这里输入题目 . . ."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选项</label>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      {questionType === QuestionType.SINGLE_CHOICE ? (
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctIndex === idx}
                          onChange={() => setCorrectIndex(idx)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={correctIndices.includes(idx)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCorrectIndices([...correctIndices, idx]);
                            } else {
                              setCorrectIndices(correctIndices.filter(i => i !== idx));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                      )}
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`选项 ${idx + 1}`}
                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddOption}
                  className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800"
                >
                  + 新增选项
                </button>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveQuestion}
                  disabled={isSaving || categories.length === 0}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-indigo-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      保存题目
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loadingAdminQuestions ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600">加载中...</span>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                        尚未创建任何题目
                      </td>
                    </tr>
                  ) : (
                    adminQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{q.text}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.type === 'SINGLE_CHOICE' ? '单选' : '多选'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            disabled={deletingId === q.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === q.id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 新增类别 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                新增类别
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类别名称</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="如：毛概、马原、英语. . ."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
                  <input
                    type="text"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="类别描述"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">选择图标</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map(icon => {
                      // @ts-ignore
                      const IconComponent = Icons[icon.name] || Icons.HelpCircle;
                      return (
                        <button
                          key={icon.name}
                          onClick={() => setCategoryIcon(icon.name)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${categoryIcon === icon.name
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                          title={icon.label}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-xs text-gray-600">{icon.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">选择颜色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setCategoryColor(color.value)}
                        className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center ${color.value} ${categoryColor === color.value
                          ? 'border-indigo-200 ring-2 ring-indigo-300'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        title={color.label}
                      >
                        <span className="text-xs font-medium">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {categoryError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{categoryError}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveCategory}
                    disabled={isSavingCategory}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-indigo-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingCategory ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        保存类别
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 类别列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-700">类别列表</h3>
              </div>

              {loadingCategories ? (
                <div className="flex items-center justify-center p-12">
                  <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                  <span className="ml-3 text-gray-600">加载中...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>暂无类别，请先创建</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* @ts-ignore */}
                        {React.createElement(Icons[cat.icon] || Icons.HelpCircle, {
                          className: `w-8 h-8 ${cat.color}`
                        })}
                        <div>
                          <p className="font-medium text-gray-900">{cat.name}</p>
                          <p className="text-sm text-gray-500">{cat.description || '无描述'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategoryClick(cat.id, cat.name)}
                        disabled={isDeletingCategory}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeletingCategory ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 输入密码弹窗 */}
      {deletePasswordModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-600" />
                需要管理员密码
              </h3>
              <button
                onClick={() => {
                  setDeletePasswordModal({ visible: false });
                  setDeletePassword('');
                  setDeletePasswordError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                该类别下有 <span className="font-bold">{deletePasswordModal.categoryName}</span>
              </p>
              <p className="text-xs text-yellow-600 mt-1">删除类别将同时删除其下的所有题目，请谨慎操作</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">管理员密码</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleConfirmDeleteCategory()}
                placeholder="请输入管理员密码"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 border p-2"
                autoFocus
              />
            </div>

            {deletePasswordError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4">
                {deletePasswordError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeletePasswordModal({ visible: false });
                  setDeletePassword('');
                  setDeletePasswordError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
                disabled={!deletePassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
