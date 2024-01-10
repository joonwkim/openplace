import { Category, Knowhow, KnowhowType, Tag } from '@prisma/client';
import { getCategories } from '../services/categoryService';
import { getKnowhow, getKnowHowTypes } from '../services/knowhowService';
import { getTags, getTagsStartsWith } from '../services/tagService';
import dynamic from 'next/dynamic';

const RegContentPage = async ({ searchParams }: { searchParams: { searchBy: string, parentKnowhowId: string; knowhowId: string, editMode: boolean, isProjectType: boolean; }; }) => {
  let knowhow: Knowhow | undefined;

  const { searchBy, parentKnowhowId, knowhowId, editMode, isProjectType } = searchParams;
  if (editMode) {
    knowhow = await getKnowhow(knowhowId) as Knowhow;
  }
  const categories = await getCategories() as Array<Category>;
  const knowHowTypes = await getKnowHowTypes() as Array<KnowhowType>;
  const tags = await getTagsStartsWith(searchBy) as Array<Tag>;
  const Registeration = dynamic(() => import('./components/registeration'), {
    ssr: false,
  });

  return (<>
    <Registeration categories={categories} knowHowTypes={knowHowTypes} tags={tags} parentKnowhowId={parentKnowhowId} knowhow={knowhow} editMode={editMode} projectType={isProjectType} />
  </>
  );
};
export default RegContentPage;