import { supabase } from './supabaseClient';
import { Question, Option, QuestionType } from '../types';

// 题目相关的数据库操作
export const questionService = {
  // 获取某分类的所有题目
  async getQuestionsByCategory(category: string): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 转换数据库格式为应用格式
      return (data || []).map(q => ({
        id: q.id,
        category: q.category,
        type: q.type,
        text: q.text,
        options: q.options || [],
        correctOptionIds: q.correct_option_ids || [],
        explanation: q.explanation,
        createdAt: new Date(q.created_at).getTime()
      }));
    } catch (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
  },

  // 获取所有题目
  async getAllQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(q => ({
        id: q.id,
        category: q.category,
        type: q.type,
        text: q.text,
        options: q.options || [],
        correctOptionIds: q.correct_option_ids || [],
        explanation: q.explanation,
        createdAt: new Date(q.created_at).getTime()
      }));
    } catch (error) {
      console.error('获取所有题目失败:', error);
      throw error;
    }
  },

  // 创建新题目
  async createQuestion(question: Question): Promise<Question> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            id: question.id,
            category: question.category,
            type: question.type,
            text: question.text,
            options: question.options,
            correct_option_ids: question.correctOptionIds,
            explanation: question.explanation,
            created_at: new Date(question.createdAt).toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        category: data.category,
        type: data.type,
        text: data.text,
        options: data.options || [],
        correctOptionIds: data.correct_option_ids || [],
        explanation: data.explanation,
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('创建题目失败:', error);
      throw error;
    }
  },

  // 删除题目
  async deleteQuestion(questionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    } catch (error) {
      console.error('删除题目失败:', error);
      throw error;
    }
  },

  // 更新题目
  async updateQuestion(question: Question): Promise<Question> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          category: question.category,
          type: question.type,
          text: question.text,
          options: question.options,
          correct_option_ids: question.correctOptionIds,
          explanation: question.explanation
        })
        .eq('id', question.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        category: data.category,
        type: data.type,
        text: data.text,
        options: data.options || [],
        correctOptionIds: data.correct_option_ids || [],
        explanation: data.explanation,
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('更新题目失败:', error);
      throw error;
    }
  }
};
