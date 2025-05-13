// app/page.tsx
import SubmissionForm from '../components/SubmissionForm';
import ContributionList from '../components/ContributionList';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gemini Reply Index</h1>
      <SubmissionForm />
      <hr className="my-8" />
      <ContributionList />
    </main>
  );
}
