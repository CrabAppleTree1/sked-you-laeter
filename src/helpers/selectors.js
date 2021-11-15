function selectUserByName(state, name) {
  const parsedUserName = state.users === undefined ? null : state.users.filter(user => user.name === name);
  return parsedUserName;
}

function getAppointmentsForDay(state, day) {
  const availableDays = state.days.length === 0 ? [] : state.days.filter(elem => elem.name === day);
  const appointmentsByDay = availableDays.length === 0 ? [] : availableDays[0].appointments
  const availableAppointments = appointmentsByDay.map(appointment => state.appointments[appointment]);
  return availableAppointments;
}

function getInterview(state, interview) {
  return interview === null ? null : { ...interview, interviewer: state.interviewers[interview.interviewer]};
}

function getInterviewersForDay(state, day) {
  const availableDays = state.days.length === 0 ? [] : state.days.filter(elem => elem.name === day);
  const interviewersByDay = availableDays.length === 0 ? [] : availableDays[0].interviewers === undefined ? [] : availableDays[0].interviewers;
  const availableInterviewers = interviewersByDay.map(interviewer => state.interviewers[interviewer]);
  return availableInterviewers;
}

export {selectUserByName, getAppointmentsForDay, getInterview, getInterviewersForDay};