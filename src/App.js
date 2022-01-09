import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, FormLabel, Alert } from '@mui/material';
import Checkboxes from './components/checkboxes/checkboxes';
import ImageList from './components/ImageList/imageList';
import Plans from './components/plans/plans';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import { getImageBySearch } from './api'
import { CITY_LIST, BUDGET } from './constants'

const selected = [];
const selectedCost = [];

function App() {

  const [isMoreThanThree, setIsMoreThanThree] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityCosts, setCityCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityPhotos, setCityPhotos] = useState([]);
  const [plans, setPlans] = useState([]);

  const handleOnChangeCities = (checked, index, name) => {
    if (checked) {
      selected.push(CITY_LIST[index]);
      selectedCost.push(CITY_LIST[index][1]);
    } else {
      selected.forEach((city, index) => {
        if (city.includes(name)) {
          selected.splice(index, 1);
          selectedCost.splice(index, 1);
        }
      })
    }
    setSelectedCities(selected);
    setCityCosts(selectedCost);
  }
  const handleFirstPlan = (cost, plan, min) => {
    while (min <= BUDGET - cost) {
      for (let index = 0; index < cityCosts.length; index++) {
        if (cost + cityCosts[index] > BUDGET) {
          continue;
        } else {
          cost = cost + cityCosts[index];
          plan[index] = plan[index] + 1;
        }
      }
    }
    return plan;
  }
  const handleSecondPlan = (cost, plan, min) => {
    while (min <= BUDGET - cost) {
      for (let index = 0; index < cityCosts.length; index++) {
        if (cost + cityCosts[index] > BUDGET) {
          continue;
        } else if (index % 2 === 0) {
          if (cost + 2 * cityCosts[index] > BUDGET) {
            cost = cost + cityCosts[index];
            plan[index] = plan[index] + 1;
          } else {
            cost = cost + 2 * cityCosts[index];
            plan[index] = plan[index] + 2;
          }
        } else {
          cost = cost + cityCosts[index];
          plan[index] = plan[index] + 1;
        }
      }
    }
    return plan;
  }
  const handleThirdPlan = (cost, plan, min) => {
    while (min <= BUDGET - cost) {
      for (let index = 0; index < cityCosts.length; index++) {
        if (cost + cityCosts[index] > BUDGET) {
          continue;
        } else if (index % 2 === 1) {
          if (cost + 2 * cityCosts[index] > BUDGET) {
            cost = cost + cityCosts[index];
            plan[index] = plan[index] + 1;
          } else {
            cost = cost + 2 * cityCosts[index];
            plan[index] = plan[index] + 2;
          }
        } else {
          cost = cost + cityCosts[index];
          plan[index] = plan[index] + 1;
        }
      }
    }
    return plan;
  }
  const handlePlanArrengement = () => {
    let cost = 0;
    let plansArray = [];
    let plan = Array(cityCosts.length).fill(0);
    let secondPlan = Array(cityCosts.length).fill(0);
    let thirdPlan = Array(cityCosts.length).fill(0);
    const min = Math.min(...cityCosts)

    plansArray.push(handleFirstPlan(cost, plan, min));
    plansArray.push(handleSecondPlan(cost, secondPlan, min));
    plansArray.push(handleThirdPlan(cost, thirdPlan, min));
    setPlans(plansArray);
  }
  const handleSaveCities = () => {
    let promises = [];

    if (selectedCities.length < 3) {
      setIsMoreThanThree(true);
      setCityPhotos([]);
      setPlans([]);

    } else {
      setLoading(true);
      handlePlanArrengement();
      selectedCities.forEach((element, index) => {
        const promise = getImageBySearch(element[0]);
        promises.push(promise);
      });
      Promise.all(promises).then((res) => {
        setCityPhotos(res);
        setLoading(false);

      })
    }
  }
  useEffect(() => {
    if (isMoreThanThree) {
      const alarmTimer = setTimeout(() => {
        setIsMoreThanThree(false)
      }, 5000)

      return () => {
        clearTimeout(alarmTimer)
      }
    }
  }, [isMoreThanThree]);

  return (
    <div className='all-page'>
      {isMoreThanThree ?
        <Alert severity="info"
          className='alarm-info'>
          Please select at least 3 city!
        </Alert> : (null)
      }
      <div className='trip-main'>
        <FormControl
          component="fieldset">
          <FormLabel
            component="legend"
            className='label'>
            Choose locations that you want to travel
          </FormLabel>
          <FormGroup
            aria-label="position"
            row
            className='checkbox-form-group'>
            {CITY_LIST.map((city, index) => (
              <Checkboxes
                key={index}
                name={city[0]}
                cost={city[1]}
                index={index}
                handleOnChangeCities={handleOnChangeCities} />
            ))}
          </FormGroup>
          <LoadingButton
            onClick={handleSaveCities}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            className='loading-button'
          >
            Let's have a plan!
          </LoadingButton>
        </FormControl>
      </div>
      <div className='images-main'>
        {cityPhotos.map((item, index) => (
          <ImageList
            key={index}
            photos={item.data.photos} />
        ))}
      </div>
      <div className='plans-scope'>
        {plans.map((item, index) => (
          <div key={index}>
            <div className={`plans-header${index}`}> Plan {index + 1}</div>
            <Plans
              plan={item}
              cities={selectedCities}
              index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
