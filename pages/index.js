import SubmissionForm from '../components/SubmissionForm';
import ContributionList from '../components/ContributionList';

export default function Home() {
  return (
    <div>
      <h1>Gemini Reply Index</h1>
      <SubmissionForm />
      <ContributionList />
    </div>
  );
}
