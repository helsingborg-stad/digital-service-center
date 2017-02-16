import React, { Component } from 'react';
import { MonthView, TransitionView } from 'react-date-picker';
import 'react-date-picker/index.css';
import './Calendar.css';

export default class Calendar extends Component {
  render() {
    const getDayOfMonth = () => {
      return new Date().getDate();
    };
    const getWorkDay = () => {
      const date = new Date();
      const weekdays = new Array(7);

      weekdays[0] = 'Sun';
      weekdays[1] = 'Mon';
      weekdays[2] = 'Tue';
      weekdays[3] = 'Wed';
      weekdays[4] = 'Thu';
      weekdays[5] = 'Fri';
      weekdays[6] = 'Sat';

      return weekdays[date.getDay()];
    };

    return (
      <div>
        <div className='Calendar-header'>
          <span className='Calendar-header-workday'>{getWorkDay()}</span>
          <span className='Calendar-header-day'>{getDayOfMonth()}</span>
        </div>
        <TransitionView>
          <MonthView
            navigation={true}
            locale='en'
            forceValidDate={false}
            highlightWeekends={false}
            highlightToday={true}
            weekNumbers={false}
            weekStartDay={0}
            footer={false}
          />
        </TransitionView>
      </div>
    );
  }
}
