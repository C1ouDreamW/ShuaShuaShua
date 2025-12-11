import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../App';
import * as Icons from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { categories, loadingCategories } = useContext(QuizContext);

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载类别中...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            在这里练习任何科目
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            选择一个类别以开始练习
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <p className="text-yellow-800 text-lg font-medium">暂无题目类别</p>
          <p className="text-yellow-600 mt-2">请前往后台管理员面板创建类别</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          在这里练习任何科目
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          选择一个类别以开始练习
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {categories.map((category) => {
          // 图标动态渲染
          const IconComponent = Icons[category.icon] || Icons.HelpCircle;

          return (
            <div
              key={category.id}
              onClick={() => navigate(`/setup/${category.id}`)}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer flex items-center space-x-6"
            >
              <div className={`p-4 rounded-xl ${category.color}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {category.description || '单击以进入测验设置'}
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-indigo-500 transition-colors">
                <Icons.ArrowRight className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}