import { getKnowhow } from '@/app/services/knowhowService';
import { Knowhow } from '@prisma/client';
import KnowhowDetails from './components/knowhowDetails';

const KnowhowDetailPage = async ({ params }: { params: { id: string; }; }) => {

    const knowhow = (await getKnowhow(params.id) as Knowhow);

    return (<>
        <KnowhowDetails knowhow={knowhow} />
    </>);
};

export default KnowhowDetailPage