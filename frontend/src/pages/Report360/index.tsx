import { useParams } from 'react-router';
import FetchingReport from './FetchingReport';

export default function Report() {
  const { id } = useParams<{ id: string }>();

  return <FetchingReport id={id ?? ''} />;
}
