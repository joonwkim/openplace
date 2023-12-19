import { Knowhow, Tag, } from '@prisma/client';
import { getKnowhows, getKnowhowsBy, } from './services/knowhowService';
import KnowhowItem from './components/knowhowItem';
import { compareByName, getTagsFromKnowhows, removeDuplicatedObject } from './lib/arrayLib';
import TagList from './components/controls/tagList';

const PlaceHomePage = async ({ searchParams }: { searchParams: { searchText: string, category: string; myhome: string; id: string, selectedTagList: string }; }) => {
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
  // console.log('tags:', JSON.stringify(tags, null, 2))

  const tagsSortedByName = removeDuplicatedObject(tags).sort(compareByName)
  const ntags = tagsSortedByName.map((tag: any) => {
    Object.assign(tag, { checked: false });
    return tag
  })

  const filterByTags = (selectedTagIds: string[]) => {
    let filteredKnowhow: Knowhow[] = [];
    knowhows.forEach(s => {
      if (s.tagIds?.length > 0) {
        s.tagIds.forEach(t => {
          if (selectedTagIds.includes(t) && !filteredKnowhow.includes(s)) {
            filteredKnowhow.push(s);
          }
        })
      }
    })
    return filteredKnowhow;
  }

  if (searchParams?.selectedTagList?.length > 0) {
    const selectedTagIds = searchParams.selectedTagList.split(',')
    knowhows = filterByTags(selectedTagIds)
  }
  else {
    if (ntags.length > 0) {
      ntags.forEach(s => s.checked = false)
    }
  }

  return (
    <>
      <TagList tags={ntags} searchParams={searchParams} />
      {knowhows?.length > 0 ? (<div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowhows?.map(knowhow => (
          <KnowhowItem key={knowhow.id} knowhow={knowhow} />
        ))}
      </div>) : (<div className='mt-3 text-center'><h2>{`등록된 ${searchParams.category ? (searchParams.category) : (searchParams.searchText)} 데이터가 없습니다.`}</h2></div>)}
    </>
  );
};
export default PlaceHomePage;