import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'moment';
import './Calendar.css';

function triggerSelectedDates(calendar, selectedDates) {
  if (calendar.props.handleSelectedDates) {
    calendar.props.handleSelectedDates(selectedDates);
  }
}

const CalendarHeader = ({text}) => (
  <div className="CalendarHeader">{text}</div>
);

CalendarHeader.propTypes = {
  text: PropTypes.string.isRequired
};

const CalendarButton = ({onClick, text}) => (
  <button className="CalendarButton" onClick={onClick}>{text}</button>
);

CalendarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: 'startDate',
      selectedMonth: Moment()
    };
  }

  presetSelectedDate(selectedTimeSpan) {
    switch (selectedTimeSpan) {
    case 'today':
      this.handleSetDateToday();
      break;
    case 'tomorrow':
      this.handleSetDateTomorrow();
      break;
    case 'weekend':
      this.handleSetDateWeekend();
      break;
    case 'all':
    default:
      this.handleResetDate();
      break;
    }
  }

  componentWillReceiveProps(props) {
    if (props.resetDates && this.state.startDate !== null) {
      this.handleResetDate();
    }
  }

  componentDidMount() {
    this.presetSelectedDate(this.props.selectedTimeSpan);
  }

  handleSetDateToday() {
    const today = Moment();
    this.setState({startDate: today, endDate: today });
    triggerSelectedDates(this, {startDate: today, endDate: today});
  }
  handleSetDateTomorrow() {
    const tomorrow = Moment().add(1, 'days');
    this.setState({startDate: tomorrow, endDate: tomorrow });
    triggerSelectedDates(this, {startDate: tomorrow, endDate: tomorrow});
  }
  handleSetDateWeekend() {
    const day = Moment().day();
    const maxDaysToDelete = 5;
    const isMonToFri = (day > 0 && day <= maxDaysToDelete);
    let daysToAdd = 0;
    let startDate = Moment();
    let endDate = Moment();

    if (isMonToFri) {
      // mon = 4, tus = 3, wed = 2, thu = 1, fri = 0
      daysToAdd = maxDaysToDelete - day;

      startDate = startDate.add(daysToAdd, 'days');
      endDate = endDate.add(daysToAdd + 2, 'days');
    } else {
      // sunday = 0, saturday = 1
      daysToAdd = day === 0 ? day : 1;
      endDate = endDate.add(daysToAdd, 'days');
    }

    this.setState({ startDate, endDate });
    triggerSelectedDates(this, {startDate, endDate});
  }
  handleResetDate() {
    this.setState({startDate: null, endDate: null, focusedInput: 'startDate'});
    triggerSelectedDates(this, null);
  }
  onDatesChange({ startDate, endDate }) {
    let changedEndDate = endDate;
    if (this.state.focusedInput === 'startDate' && endDate === null) {
      changedEndDate = startDate;
    }

    const newDate = { startDate: startDate, endDate: changedEndDate };
    this.setState({ startDate: newDate.startDate, endDate: newDate.endDate });
    triggerSelectedDates(this, newDate);
  }
  onFocusChange(focusedInput) {
    this.setState({
      focusedInput: !focusedInput ? 'startDate' : focusedInput
    });
  }
  onMonthClick(onNextClick) {
    const selectedMonth = onNextClick
      ? this.state.selectedMonth.add(1, 'months')
      : this.state.selectedMonth.add(-1, 'months');
    this.setState({ selectedMonth });
  }
  navMonth(goNext, selectedMonth) {
    const newSelectedMonth = goNext
      ? Moment(selectedMonth).add(1, 'months')
      : Moment(selectedMonth).subtract(1, 'months');
    return newSelectedMonth.locale('sv').format('MMM');
  }
  isPassedDay(day) {
    return day.isBefore(Moment()) && !day.isSame(Moment(), 'days');
  }
  render() {
    return (
      <div className={`Calendar Calendar--${this.props.themeCssClass}`}>
        <CalendarHeader
          text={this.props.translatables.selectDates}
        />
        <DayPickerRangeController
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={this.onDatesChange.bind(this)}
          focusedInput={this.state.focusedInput}
          onFocusChange={this.onFocusChange.bind(this)}
          navNext={<div>{this.navMonth(true, this.state.selectedMonth)}</div>}
          navPrev={<div>{this.navMonth(false, this.state.selectedMonth)}</div>}
          onNextMonthClick={this.onMonthClick.bind(this, true)}
          onPrevMonthClick={this.onMonthClick.bind(this, false)}
          isDayBlocked={this.isPassedDay.bind(this)}
        />
        <div className="Calendar-button-wrapper">
          <CalendarButton
            onClick={this.handleSetDateToday.bind(this)}
            text={this.props.translatables.today}
          />
          <CalendarButton
            onClick={this.handleSetDateTomorrow.bind(this)}
            text={this.props.translatables.tomorrow}
          />
          <CalendarButton
            onClick={this.handleSetDateWeekend.bind(this)}
            text={this.props.translatables.weekend}
          />
          <CalendarButton
            onClick={this.handleResetDate.bind(this)}
            text={this.props.translatables.all}
          />
        </div>
      </div>
    );
  }
}

Calendar.defaultProps = {
  themeCssClass: 'events'
};

Calendar.propTypes = {
  themeCssClass: PropTypes.string,
  handleSelectedDates: PropTypes.func,
  selectedTimeSpan: PropTypes.string,
  translatables: PropTypes.shape({
    selectDates: PropTypes.string.isRequired,
    today: PropTypes.string.isRequired,
    tomorrow: PropTypes.string.isRequired,
    weekend: PropTypes.string.isRequired,
    all: PropTypes.string.isRequired
  }).isRequired,
  resetDates: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

export default connect(mapStateToProps, null)(Calendar);
