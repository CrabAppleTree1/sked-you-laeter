import React from "react";
import classNames from 'classnames'

import "components/DayListItem.scss";

export default function DayListItem(props) {

  const DayListItemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });
  
  return (
      <li className={DayListItemClass} onClick={props.setDay && (() => props.setDay(props.name))} data-testid="day">
        <h2 className="text--regular">{props.name}</h2> 
        <h3 className="text--light">
          {(props.spots === 0) ? 'no spots' : (props.spots === 1) ? `${props.spots} spot` : `${props.spots} spots`} remaining</h3>
      </li>
  );
}
