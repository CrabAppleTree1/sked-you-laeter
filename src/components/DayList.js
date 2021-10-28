import React from "react";
import DayListItem from "./DayListItem";


export default function DayList(props) {
  const parsedDayListItems = props.days.map(day =>
    <DayListItem 
      key={day.id}
      {...day}
      selected={day.name === props.day}
      setDay={props.setDay}
    />
  );

  return (
    <ul>
      {parsedDayListItems}
    </ul>
  );
} 