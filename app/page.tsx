import { Knowhow, } from '@prisma/client';
import { getKnowhows, getKnowhowsBy, } from './services/knowhowService';
import KnowhowItem from './components/knowhowItem';
import { getTagsFromKnowhows } from './lib/arrayLib';

const PlaceHomePage = async ({ searchParams }: { searchParams: { searchText: string, category: string; myhome: string; id: string }; }) => {

  let knowhows: Knowhow[] = [];
  if (searchParams?.searchText) {
    knowhows = (await getKnowhows(searchParams.searchText) as Array<Knowhow>);
  } else if (searchParams?.category) {
    knowhows = (await getKnowhows(searchParams.category) as Array<Knowhow>);
  } else if (searchParams?.myhome) {
    knowhows = (await getKnowhowsBy(searchParams.myhome, searchParams.id) as Array<Knowhow>);
  }
  else {
    knowhows = (await getKnowhows(null) as Array<Knowhow>);
  }
  const tags = getTagsFromKnowhows(knowhows);
  const names = ([...new Set(tags.map((s: any) => s.name))].sort())
  console.log('names:', JSON.stringify(names, null, 2))

  return (
    <>
      {knowhows?.length > 0 ? (<div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowhows?.map(knowhow => (
          <KnowhowItem key={knowhow.id} knowhow={knowhow} />
        ))}
      </div>) : (<div className='mt-3 text-center'><h2>{`등록된 ${searchParams.category ? (searchParams.category) : (searchParams.searchText)} 데이터가 없습니다.`}</h2></div>)}
    </>
  );
};

export default PlaceHomePage;