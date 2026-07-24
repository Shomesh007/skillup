import posthog from 'posthog-js';

export function initializeAnalytics() {
  if (import.meta.env.VITE_POSTHOG_API_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_API_HOST || 'https://us.posthog.com',
      loaded: () => {
        console.log('PostHog initialized');
      },
    });
  }
}

async function track(eventName: string, properties: Record<string, unknown>) {
  posthog?.capture(eventName, properties);
}

export async function trackUserSignup(userId: string, email: string, careerLevel?: string) {
  await track('user_signup', { userId, email, careerLevel });
}

export async function trackRoleSelected(userId: string, roleId: string, roleName: string) {
  await track('role_selected', { userId, roleId, roleName });
}

export async function trackCompanyViewed(userId: string, companyId: string, companyName: string) {
  await track('company_viewed', { userId, companyId, companyName });
}

export async function trackInterviewQuestionViewed(
  userId: string,
  questionId: string,
  difficulty: string,
  category: string
) {
  await track('interview_question_viewed', { userId, questionId, difficulty, category });
}

export async function trackSuccessStoryViewed(userId: string, storyId: string, companyName: string) {
  await track('success_story_viewed', { userId, storyId, companyName });
}

export async function trackLearningResourceAccessed(
  userId: string,
  resourceId: string,
  resourceType: string,
  platform: string
) {
  await track('learning_resource_accessed', { userId, resourceId, resourceType, platform });
}

export async function trackLearningPathCompleted(userId: string, roleId: string, roleName: string) {
  await track('learning_path_completed', { userId, roleId, roleName });
}

export async function trackSuccessStorySubmitted(userId: string, companyId: string, roleId: string) {
  await track('success_story_submitted', { userId, companyId, roleId });
}

export async function trackSalaryDataSubmitted(userId: string, companyId: string) {
  await track('salary_data_submitted', { userId, companyId });
}

export async function trackMatchScoreCalculated(
  userId: string,
  roleId: string,
  companyId: string,
  matchPercentage: number
) {
  await track('match_score_calculated', { userId, roleId, companyId, matchPercentage });
}

export async function trackChatInteraction(userId: string, topic: string) {
  await track('chat_interaction', { userId, topic });
}

export async function trackDataExportRequested(userId: string) {
  await track('data_export_requested', { userId });
}

export async function trackConsentGiven(userId: string, consentType: string) {
  await track('consent_given', { userId, consentType });
}
