import { supabase } from './supabaseClient';
import { Category } from '../types';

export const categoryService = {
  // 获取所有类别
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        color: c.color,
        description: c.description,
        createdAt: new Date(c.created_at).getTime()
      }));
    } catch (error) {
      console.error('获取类别失败:', error);
      throw error;
    }
  },

  // 创建新类别
  async createCategory(category: Omit<Category, 'createdAt'>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            description: category.description || '',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        description: data.description,
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('创建类别失败:', error);
      throw error;
    }
  },

  // 删除类别
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
    } catch (error) {
      console.error('删除类别失败:', error);
      throw error;
    }
  },

  // 获取某类别下的题目数量
  async getCategoryQuestionCount(categoryName: string): Promise<number> {
    try {
      const { data, error, count } = await supabase
        .from('questions')
        .select('id', { count: 'exact' })
        .eq('category', categoryName);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('获取类别题目数量失败:', error);
      return 0;
    }
  }
};
