import React from 'react';
import './plans.css';

function Plans(props) {

  return (
    <div className={`plans-main${props.index}`}>
      {props.plan.map((item,index2) => (
        <div >

          <div className='show-plan'>
            {item}Days
          </div>
          <div className='show-city' >
            {props.cities[index2][0]}
          </div>
        </div>

      ))}


    </div>
  );
}

export default Plans;
