import React from 'react';
import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVE = "SAVE";
const ERROR_SAVE = "ERROR_SAVE";
const DELETE = "DELETE";
const ERROR_DELETE = "ERROR_DELETE";
const CONFIRM = "CONFIRM";

export default function Appointment (props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer: interviewer
    };

    transition(SAVE);

    props.book(props.id, interview).then( () => {
      transition(SHOW);
    }).catch( () => {
      transition(ERROR_SAVE, true);
    });
  };

  function onDelete() {
    transition(DELETE);
    props.cancel(props.id).then( () => {
      transition(EMPTY);
    }).catch( () => {
      transition(ERROR_DELETE, true);
    });
  }
  
  return  <article className="appointment" data-testid="appointment" >
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && <Form onSave={save} onCancel={back} interviewers={props.interviewers}/>}
    {mode === EDIT && <Form onSave={save} onCancel={back} interviewers={props.interviewers} default={{ student: props.interview.student, interviewer: props.interview.interviewer.id }}/>}
    {mode === SAVE && <Status message='Saving...'/>}
    {mode === DELETE && <Status message='Deleting...'/>}
    {mode === CONFIRM && <Confirm message='Are you sure you would like to delete?' onCancel={() => transition(SHOW)} onConfirm={onDelete}/>}
    {mode === ERROR_SAVE && <Error message='Could not save to database.' onClose={back}/>}
    {mode === ERROR_DELETE && <Error message='Could not delete from database.' onClose={back}/>}
  </article>;
}

