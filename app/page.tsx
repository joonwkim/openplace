import { Knowhow, Tag, } from '@prisma/client';
import { getKnowhows, getKnowhowsBy, } from './services/knowhowService';
import KnowhowItem from './components/knowhowItem';
import { compareByName, getTagsFromKnowhows, removeDuplicatedObject } from './lib/arrayLib';
import { compare } from 'bcrypt';
import TagItem from './components/controls/tagList';
import TagItems from './components/controls/tagList';

const PlaceHomePage = async ({ searchParams }: { searchParams: { searchText: string, category: string; myhome: string; id: string, selectedTagList: string }; }) => {

  console.log('rendering:')
  let knowhows: Knowhow[] = [];
  if (searchParams?.searchText) {
    knowhows = (await getKnowhows(searchParams.searchText) as Array<Knowhow>);
    console.log('searchText selected Tag List:', searchParams.selectedTagList)

  } else if (searchParams?.category) {
    knowhows = (await getKnowhows(searchParams.category) as Array<Knowhow>);
    console.log('category selected Tag List:', searchParams.selectedTagList)

  } else if (searchParams?.myhome) {
    knowhows = (await getKnowhowsBy(searchParams.myhome, searchParams.id) as Array<Knowhow>);
    console.log('myhome selected Tag List:', searchParams.selectedTagList)

  }
  else {
    knowhows = (await getKnowhows(null) as Array<Knowhow>);

    console.log('home selected Tag List:', searchParams.selectedTagList)

  }

  const tags = getTagsFromKnowhows(knowhows);
  const tagsSortedByName = removeDuplicatedObject(tags).sort(compareByName)
  const ntags = tagsSortedByName.map((tag: any) => {
    Object.assign(tag, { checked: false });
    return tag
  })
  // console.log('ntags:', JSON.stringify(ntags, null, 2))

  // const handleChecked = (tag: any, e: any) => {
  //   console.log('handle', tag, e)
  // }

  return (
    <>
      <TagItems tags={ntags} searchParams={searchParams} />
      {knowhows?.length > 0 ? (<div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowhows?.map(knowhow => (
          <KnowhowItem key={knowhow.id} knowhow={knowhow} />
        ))}
      </div>) : (<div className='mt-3 text-center'><h2>{`등록된 ${searchParams.category ? (searchParams.category) : (searchParams.searchText)} 데이터가 없습니다.`}</h2></div>)}
    </>
  );
};

export default PlaceHomePage;