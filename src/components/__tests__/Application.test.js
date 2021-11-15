import React from 'react'

import {render, cleanup, waitForElement, fireEvent, prettyDOM, queryByText, queryByAltText, getAllByTestId, getByAltText, getByText, getByPlaceholderText } from '@testing-library/react'
import { act } from "@testing-library/react-hooks";

import Application from 'components/Application';
import axios from 'axios';


afterEach(()=>{
  jest.clearAllMocks()
  axios.get.mockClear()
  console.log("cleared")
})

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />)

    await waitForElement(() => getByText('Monday'))

    fireEvent.click(getByText('Tuesday'))
    expect(getByText('Leopold Silvers')).toBeInTheDocument()
  })

  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />)

    await waitForElement(() => getByText(container, 'Archie Cohen'))

    const appointments = getAllByTestId(container, 'appointment')
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, 'Add'))

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    })

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'))
    fireEvent.click(getByText(appointment, 'Save'))

    expect(getByText(appointment, 'Saving...')).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'))

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    )

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument()
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />)

    await waitForElement(() => getByText(container, 'Archie Cohen'))

    const appointments = getAllByTestId(container, 'appointment')
    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'));
    // const appointments = getAllByTestId(container, 'appointment')
    // const appointment = appointments[1]
      fireEvent.click(queryByAltText(appointment, "Edit"));

      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones"}
      });

      fireEvent.click(getByText(appointment, "Save"));
    
      expect(getByText(appointment, "Saving...")).toBeInTheDocument();
      
      await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    console.log("container" ,prettyDOM(container));
    const appointment = getAllByTestId(container, "appointment")[0];
    //const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Could not save to database."));

    fireEvent.click(getByAltText(appointment, "Close"));
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application
    const { container } = render(<Application />)

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'))

    // 3. Click the "Delete" button on the second appointment
    const appointments = getAllByTestId(container, 'appointment')
    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'))

    fireEvent.click(getByAltText(appointment, 'Delete'))

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument()

    // 5. Click the "Confrim" button on the confirmation
    fireEvent.click(getByText(appointment, 'Confirm'))

    // 6. Check that the element with the text "DELETING" is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument()

    // 7. Wait until the element with alt text "Add" is displayed
    await waitForElement(() => getByAltText(appointment, 'Add'))

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining"
    const Monday = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'))
    expect(getByText(Monday, '2 spots remaining')).toBeInTheDocument()
  })


  xit("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const {container} = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'))
    const appointments = getAllByTestId(container, 'appointment')
    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'))

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?"));

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Could not delete from database."));

    fireEvent.click(getByAltText(appointment, "Close"));
  });
});