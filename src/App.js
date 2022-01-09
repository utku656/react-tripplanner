import React, { useState, useEffect } from 'react';
import {FormGroup,FormControl,FormLabel,Alert} from '@mui/material';
import Checkboxes from './components/checkboxes/checkboxes';
import ImageList from './components/ImageList/imageList';
import Plans from './components/plans/plans';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import { getImageBySearch } from './api'
const cities = [
  ['Paris', 500],
  ['London', 450],
  ['Barselona', 400],
  ['Madrid', 350],
  ['Rome', 300],
  ['Amsterdam', 250],
  ['Prague', 200],
  ['Brussels', 150],
  ['Budapest', 100],
  ['Istanbul', 50]
];
const BUDGET = 3000;
const selected = [];
const selectedCost = [];

function App() {

  const [isMoreThanThree, setIsMoreThanThree] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityPhotos, setCityPhotos] = useState([]);
  const [plans, setPlans] = useState([]);

  const handleOnChangeCities = (checked, index, name) => {
    if (checked) {
      selected.push(cities[index]);
      selectedCost.push(cities[index][1]);
    } else {
      selected.forEach((city, index) => {
        if (city.includes(name)) {
          selected.splice(index, 1);
          selectedCost.splice(index, 1);
        }
      })
    }
    setSelectedCities(selected);
    setCosts(selectedCost);
  }
  const handleFirstPlan = (cost, plan, min) => {
    while (min <= BUDGET - cost) {
      costs.forEach((element, index) => {
        if (cost + element > BUDGET) {
          return;
        } else {
          cost = cost + element;
          plan[index] = plan[index] + 1;

        }
      });
    }
    return plan;

  }
  const handleSecondPlan = (cost, plan, min) => {

    while (min <= BUDGET - cost) {
      costs.forEach((element, index) => {
        if (cost + element > BUDGET) {
          return;
        } else if( index % 2 === 0 ){
          if (cost + 2*element > BUDGET) {
            cost = cost + element;
          plan[index] = plan[index] + 1;
          }else{
            cost = cost + 2*element;
            plan[index] = plan[index] + 2;
          }
          

        } else{
          cost = cost + element;
          plan[index] = plan[index] + 1;
        }

      });
    }
    return plan;

  }
  const handleThirdPlan = (cost, plan, min) => {

    while (min <= BUDGET - cost) {
      costs.forEach((element, index) => {
        if (cost + element > BUDGET) {
          return;
        }else if( index % 2 === 1 ){
          if (cost + 2*element > BUDGET) {
            cost = cost + element;
          plan[index] = plan[index] + 1;
          }else{
            cost = cost + 2*element;
            plan[index] = plan[index] + 2;
          }
          

        } else{
          cost = cost + element;
          plan[index] = plan[index] + 1;
        }

      });
    }
    return plan;

  }
  const handlePlanArrengement = () => {
    let cost = 0;
    let plansArray = [];
    let plan = Array(costs.length).fill(0);
    let secondPlan = Array(costs.length).fill(0);
    let thirdPlan = Array(costs.length).fill(0);
    const min = Math.min(...costs)

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
            {cities.map((city, index) => (
              <Checkboxes
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
          photos={item.data.photos} />
        ))}
      </div>
      <div className='plans-scope'>
        {plans.map((item, index) => (
          <div>
            <div className={`plans-header${index}`}> Plan {index+1}</div>
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
