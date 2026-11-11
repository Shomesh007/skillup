import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';



export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Supabase helper functions
export async function getInterviewQuestions(
  roleId?: string,
  difficulty?: string,
  companyId?: string,
  limit = 50,
  offset = 0
) {
  let query = supabase
    .from('interview_questions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (roleId) {
    query = query.eq('role_id', roleId);
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  return query;
}

export async function getCompanies(
  category?: string,
  hiringStatus?: string,
  limit = 50,
  offset = 0
) {
  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  if (hiringStatus) {
    query = query.eq('hiring_status', hiringStatus);
  }

  return query;
}

export async function getSalaryBenchmarks(
  companyId: string,
  roleId?: string,
  level?: string
) {
  let query = supabase
    .from('salary_benchmarks')
    .select('*')
    .eq('company_id', companyId);

  if (roleId) {
    query = query.eq('role_id', roleId);
  }

  if (level) {
    query = query.eq('level', level);
  }

  return query;
}

export async function getAllRoles(limit = 100, offset = 0) {
  return supabase
    .from('roles')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);
}

export async function getAllCompanies(limit = 200, offset = 0) {
  return supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);
}

export async function getCompanyInterviewRounds(companyId: string) {
  return supabase
    .from('company_interview_rounds')
    .select('*')
    .eq('company_id', companyId)
    .order('round_number', { ascending: true });
}

export async function getSuccessStories(
  companyId?: string,
  isPublished = true,
  limit = 20,
  offset = 0
) {
  let query = supabase
    .from('success_stories')
    .select('*', { count: 'exact' })
    .eq('is_published', isPublished)
    .order('upvotes', { ascending: false })
    .range(offset, offset + limit - 1);

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  return query;
}

export async function getLearningResources(
  roleId: string,
  resourceType?: string,
  limit = 20
) {
  let query = supabase
    .from('learning_resources')
    .select('*')
    .eq('role_id', roleId)
    .order('rating', { ascending: false })
    .limit(limit);

  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }

  return query;
}

export async function getUserProfile(userId: string) {
  return supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateUserProfile(userId: string, updates: any) {
  return supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select();
}

export async function getUserLearningProgress(userId: string) {
  return supabase
    .from('user_learning_progress')
    .select('*, learning_resources(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

export async function getMatchScores(userId: string) {
  return supabase
    .from('match_scores')
    .select('*, roles(*), companies(*)')
    .eq('user_id', userId)
    .order('overall_match_percentage', { ascending: false });
}

export async function submitSuccessStory(storyData: any) {
  return supabase
    .from('success_stories')
    .insert([storyData])
    .select();
}

export async function submitSalaryData(salaryData: any) {
  return supabase
    .from('user_salary_submissions')
    .insert([salaryData])
    .select();
}

export async function bookmarkResource(
  userId: string,
  bookmarkableType: string,
  bookmarkableId: string
) {
  return supabase
    .from('user_bookmarks')
    .insert([
      {
        user_id: userId,
        bookmarkable_type: bookmarkableType,
        bookmarkable_id: bookmarkableId,
      },
    ]);
}

export async function getUserBookmarks(userId: string) {
  return supabase
    .from('user_bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function submitUserDataRequest(
  userId: string,
  requestType: string,
  details?: any
) {
  return supabase
    .from('user_data_requests')
    .insert([
      {
        user_id: userId,
        request_type: requestType,
        request_details: details,
        status: 'pending',
      },
    ])
    .select();
}

export async function trackEvent(
  userId: string,
  eventName: string,
  eventProperties?: any
) {
  return supabase
    .from('analytics_events')
    .insert([
      {
        user_id: userId,
        event_name: eventName,
        event_properties: eventProperties || {},
      },
    ]);
}
