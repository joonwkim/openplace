import { getKnowHow } from '../services/knowhowService';
import { Knowhow } from '@prisma/client';
import KnowhowDetails from './components/knowhowDetails';

const Page = async ({ params }: { params: { id: string; }; }) => {

  const knowhow = (await getKnowHow(params.id) as Knowhow);

  return (<>
    <KnowhowDetails knowhow={knowhow} />
  </>
  );
};

export default Page

