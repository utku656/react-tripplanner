import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import './checkboxes.css';

function Checkboxes(props) {
  
  return (
    <div className='checkboxes-main'>

    <FormControlLabel
          value={props.name}
          control={<Checkbox className='checkbox' id={`${props.index}`} />}
          label={props.name}
          labelPlacement="end"
          onChange={(event)=>props.handleOnChangeCities(event.target.checked , props.index,props.name)}
        />
    </div>
  );
}

export default Checkboxes;
