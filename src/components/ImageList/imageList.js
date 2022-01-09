import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import './imageList.css';

function Images(props) {

  return (
    <div className='imagelist-main'>

      <ImageList sx={{ width: 500, height: 250 }} cols={3} >
        {props.photos.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={item.src.medium}
              srcSet={item.src.medium}
              alt={item.alt}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

export default Images;
