import React, { useState, useEffect } from 'react';
import './plans.css';

function Plans(props) {

  return (
    <div className={`plans-main${props.index}`}>
      {props.plan.map((item, index2) => (
        <div key={index2} className='plans-childs' >
          <div className='show-plan'>
            <p className='plan-days'>{props.cities[index2][0]}</p>
          </div>
          <div className='show-city' >
            {item} Days
          </div>
          <div className='show-cost' >
            {props.cities[index2][1] * item} USD
          </div>
        </div>
      ))}
      <div className='total-cost' >
        Total : {props.total} USD
      </div>
    </div>
  );
}

export default Plans;
