import { Category, KnowhowType, Tag } from '@prisma/client';
import { getCategories } from '../services/categoryService';
import { getKnowHowTypes } from '../services/knowhowService';
import { getTags, getTagsStartsWith } from '../services/tagService';
import dynamic from 'next/dynamic';

const RegContentPage = async ({ searchParams }: { searchParams: { searchBy: string, parentKnowhowId: string; }; }) => {

  const categories = await getCategories() as Array<Category>;
  const knowHowTypes = await getKnowHowTypes() as Array<KnowhowType>;
  const tags = await getTagsStartsWith(searchParams.searchBy) as Array<Tag>;

  const Registeration = dynamic(() => import('./components/registeration'), {
    ssr: false,
  });

  return (<>
    <Registeration categories={categories} knowHowTypes={knowHowTypes} tags={tags} parentKnowhowId={searchParams.parentKnowhowId} />
  </>

  );
};

export default RegContentPage;