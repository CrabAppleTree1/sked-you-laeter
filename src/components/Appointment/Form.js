import React, { useEffect, useState } from 'react';
import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';

export default function Form (props) {

  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterViewer] = useState(props.interviewer || null);

  const reset = () => {
    setName("");
    setInterViewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  const save = () => {
    validate()
  }

  useEffect( () => {
    if(props.default) {
      setName(props.default.student);
      setInterViewer(props.default.interviewer);
    }
  }, [props.default]);

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewer === null) {
      setError("Interviewer must be selected");
      return;
    }
  
    setError("");
    props.onSave(name, interviewer);
  }  

  return <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          value={name}
          type="text"
          placeholder="Enter Student Name"
          onChange={(event) => setName(event.target.value)}
          data-testid="student-name-input"
        />
        <section className="appointment__validation">{error}</section>
      </form>
      <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={(event) => setInterViewer(event)} />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={cancel}>Cancel</Button>
        <Button confirm onClick={save}>Save</Button>
      </section>
    </section>
  </main>;
}
