import { Knowhow,} from '@prisma/client'
import React from 'react'
import { getKnowHows } from './services/knowhowService'
import KnowHowItem from './components/knowHowItem'


const PlaceHomePage = async () => {
  const knowHows = (await getKnowHows() as Array<Knowhow>);
  // const knowHows = (await getKnowHows() as Array<knowhow>).slice(0,1);

  return (
    <>
      <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowHows?.map(knowhow => (
          <KnowHowItem key={knowhow.id} knowhow={knowhow}  />
        ))}
      </div>
    </>
  )
}

export default PlaceHomePage