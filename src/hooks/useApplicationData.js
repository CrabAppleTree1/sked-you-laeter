import { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState( {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect( () => {
    const promises = [axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')];
    Promise.all(promises).then( (res) => {
      setState(prev => ({ ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data}));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayID = state.days.find( day => day.name === state.day ).id - 1;
    const days = [...state.days];

    let spots = 0;

    for(const appointment of days[dayID].appointments) {
      if(appointments[appointment].interview === null) {
        spots++;
      }
    }
    
    days[dayID] = {
      ...days[dayID],
      spots
    }

    return axios.put(`/api/appointments/${id}`, { interview }).then( () => {
      setState({
        ...state,
        days,
        appointments
      });
    });
  };

  function cancelInterview(id) {
    const appointments = {
      ...state.appointments
    };
    appointments[id].interview = null;

    const dayID = state.days.find( day => day.name === state.day ).id - 1;
    const days = [...state.days];

    let spots = 0;

    for(const appointment of days[dayID].appointments) {
      if(appointments[appointment].interview === null) {
        spots++;
      }
    }

    days[dayID] = {
      ...days[dayID],
      spots
    }

    return axios.delete(`/api/appointments/${id}`).then( () => {
      setState({
        ...state,
        days,
        appointments
      });
    });
  }

  return {state, setDay: day => setState({...state, day}), bookInterview, cancelInterview};
};