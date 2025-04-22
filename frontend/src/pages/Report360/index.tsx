import { useParams } from 'react-router';
import FetchingReport from './FetchingReport';

export default function Report() {
  const { id } = useParams<{ id: string }>();
  // const location = useLocation();
  // const state = location.state as { rate: Rate };

  // if (state?.rate && state?.rate.id === parseInt(id ?? '')) {
  //     return <Report360 rate={state.rate} isLoading={false} />;
  // }

  return <FetchingReport id={id ?? ''} />;
}
