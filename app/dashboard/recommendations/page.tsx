import { getCurrentUser } from "@/lib/session";
import { RecommendationWorkspace } from "@/components/recommendations/recommendation-workspace";

export const metadata = { title: "Rekomendasi AI" };

export default async function RecommendationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let skills: string[] = [];
  try {
    skills = JSON.parse(user.profile?.skills ?? "[]");
  } catch {
    skills = [];
  }

  return (
    <RecommendationWorkspace
      initialSkills={skills}
    />
  );
}
