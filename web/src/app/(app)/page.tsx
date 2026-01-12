import { paths } from '@/config/paths';
import { redirect } from 'next/navigation';

const IndexPage = () => {
  return redirect(paths.app.home);
};

export default IndexPage;
