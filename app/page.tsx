import { Knowhow, } from '@prisma/client';
import React from 'react';
import { getKnowhows } from './services/knowhowService';
import KnowhowItem from './components/knowhowItem';


const PlaceHomePage = async () => {

  const knowHows = (await getKnowhows() as Array<Knowhow>);

  return (
    <>
      <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowHows?.map(knowhow => (
          <KnowhowItem key={knowhow.id} knowhow={knowhow} />
        ))}
      </div>
    </>
  );
};

export default PlaceHomePage;