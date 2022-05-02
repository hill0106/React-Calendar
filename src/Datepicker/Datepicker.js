import React, { Component } from "react";
import "./Datepickerstyle.css";

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;
let a = +new Date();
let Month = new Date().getMonth();
let inputRef = React.createRef();

class MyDatePicker extends Component {
  state = {
    getDetails: [],
  };

  constructor() {
    super();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let data = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    this.state = {
      year,
      month,
      selectedDay: todayTimestamp,
      selectedMonth: Month,
      selectedYear: year,
      Details: this.getDetails(year, month), //array
      showMonthPicker: false,
      onClickMonth: false,
      showDatePicker: true,
      monthDetails: data,
    };
  }

  componentDidMount() {
    this.setDateToInput(this.state.selectedDay);
    this.setMonthToInput(this.state.selectedMonth);
  }

  /**
   *  Calendar
   */
  daysMap = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  CurrentMonthToNum = (day) => {
    let arr = -1;
    if (day === "Jan") arr = 0;
    else if (day === "Feb") arr = 1;
    else if (day === "Mar") arr = 2;
    else if (day === "Apr") arr = 3;
    else if (day === "May") arr = 4;
    else if (day === "Jun") arr = 5;
    else if (day === "Jul") arr = 6;
    else if (day === "Aug") arr = 7;
    else if (day === "Sep") arr = 8;
    else if (day === "Oct") arr = 9;
    else if (day === "Nov") arr = 10;
    else if (day === "Dec") arr = 11;

    return arr;
  };

  getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.daysMap[day],
    };
  };

  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  };

  getDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = this.getNumberOfDays(year, month);
    let monthArray = [];
    let currentDay = null;
    let index = 0;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  getYearDetails = (year) => {
    let yearArray = [];
    if (this.state.year >= 1997 && this.state.year <= 2008) {
      let i = 1997;
      yearArray.push(i);
    } else if (this.state.year >= 2009 && this.state.year <= 2020) {
      let i = 2009;
      yearArray.push(i);
      i++;
    } else if (this.state.year >= 2021 && this.state.year <= 2032) {
      let i = 2021;
      yearArray.push(i);
      i++;
    }
    console.log(yearArray);
    return yearArray;
  };

  isCurrentDay = (day) => {
    return day.timestamp === todayTimestamp;
  };

  isCurrentMonth = (m) => {
    m = this.CurrentMonthToNum(m);
    return m === Month;
  };

  isSelectedDay = (day) => {
    return day.timestamp === this.state.selectedDay;
  };

  isSelectedMonth = (m) => {
    m = this.CurrentMonthToNum(m);
    return m === this.state.selectedMonth;
  };

  getDateFromDateString = (dateValue) => {
    let dateData = dateValue.split("-").map((d) => parseInt(d, 10));
    if (dateData.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date };
  };

  getMonthStr = (month) =>
    this.monthMap[Math.max(Math.min(11, month), 0)] || "Month";

  getDateStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return (
      dateObject.getFullYear() +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (date < 10 ? "0" + date : date)
    );
  };

  setDate = (dateData) => {
    let selectedDay = new Date(
      dateData.year,
      dateData.month - 1,
      dateData.date
    ).getTime();
    this.setState({ selectedDay });
    if (this.props.onChange) {
      this.props.onChange(selectedDay);
    }
  };

  setMonthDate = (m) => {
    let selectedMonth = new Date(m.month).getTime();
    this.setState({ selectedMonth });
    if (this.props.onChange) {
      this.props.onChange(selectedMonth);
    }
  };

  updateDateFromInput = () => {
    let dateValue = inputRef.current.value;
    let dateData = this.getDateFromDateString(dateValue);
    if (dateData !== null) {
      this.setDate(dateData);
      this.setState({
        year: dateData.year,
        month: dateData.month - 1,
        Details: this.getDetails(dateData.year, dateData.month - 1),
      });
    }
  };

  setDateToInput = (timestamp) => {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  };

  setMonthToInput = (m) => {
    let dateString = this.CurrentMonthToNum(m) + 1;

    inputRef.current.value = dateString;
  };

  onDateClick = (day) => {
    this.setState({ selectedDay: day.timestamp }, () =>
      this.setDateToInput(day.timestamp)
    );
    if (this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  };

  onMonthClick = (m) => {
    m = this.CurrentMonthToNum(m);
    this.setState({ selectedMonth: m }, () => this.setMonthToInput(m));
    if (this.props.onChange) {
      this.props.onChange(m);
    }
  };

  onTitleClick = () => {
    this.setState({ showMonthPicker: true });
    this.setState({ showDatePicker: false });
  };

  onTitleYearClick = () => {
    this.setState({ showMonthPicker: false });
  };

  handleOnClickMonth = (year, month) => {
    this.setState({ onClickMonth: true });
    this.setState({ showDatePicker: true });
    month = this.CurrentMonthToNum(month);
    this.setState({ year: year });
    this.setState({ month: month });
    this.setState({
      Details: this.getDetails(year, month),
    });
    console.log(year, month);
  };

  handleOnClickYear = (year) => {
    this.setState({ onClickMonth: true });
    this.setState({ showDatePicker: true });
    this.setState({ year: year });
    this.setState({
      Details: this.getDetails(year),
    });
    console.log(year);
  };

  setYear = (offset) => {
    let year = this.state.year + offset;
    let month = this.state.month;
    this.setState({
      year,
      Details: this.getDetails(year, month), //array
    });
  };

  setMonth = (offset) => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.setState({
      year,
      month,
      Details: this.getDetails(year, month),
    });
  };

  /**
   *  Renderers
   */

  renderCalendar() {
    let days = this.state.Details.map((day, index) => {
      return (
        <div
          className={
            "c-day-container " +
            (day.month !== 0 ? " disabled" : "") +
            (this.isCurrentDay(day) && day.month === 0 ? " highlight" : "") +
            (this.isSelectedDay(day) && day.month === 0 ? " highlighted" : "")
          }
          key={index}
        >
          <div className="cdc-day">
            <span
              onClick={() => [
                this.onDateClick(day),
                console.log(this.isSelectedDay(day)),
              ]}
            >
              {day.date}
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className="c-container">
        <div className="cc-head">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  }

  renderMonthPicker() {
    let monthData = this.state.monthDetails.map((m, index) => {
      return (
        <div className="MonthContainer">
          <div className={"month-name-container"}>
            <div
              className={
                this.isSelectedMonth(m)
                  ? "month-name-highlighted"
                  : "month-name-nohighlight"
              }
              key={index}
            >
              <div className="monthClick">
                <span
                  onClick={() => [
                    this.onMonthClick(m),
                    this.handleOnClickMonth(this.state.year, m),
                  ]}
                >
                  {m}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="DatePicker-container">
        <div className="header">
          <div className="mdpch-button">
            <div className="mdpchb-inner" onClick={() => this.setYear(-1)}>
              <span className="mdpchbi-left-arrow"></span>
            </div>
          </div>
          <div className="title-container" onClick={this.onTitleYearClick}>
            <div className="title">{this.state.year}</div>
          </div>
          <div className="mdpch-button">
            <div className="mdpchb-inner" onClick={() => this.setYear(1)}>
              <span className="mdpchbi-right-arrow"></span>
            </div>
          </div>
        </div>
        <div>{monthData}</div>
      </div>
    );
  }

  renderYearPicker() {
    let yearData = this.state.monthDetails.map((m, index) => {
      return (
        <div className="MonthContainer">
          <div className={"month-name-container"}>
            <div
              className={
                this.isSelectedMonth(m)
                  ? "month-name-highlighted"
                  : "month-name-nohighlight"
              }
              key={index}
            >
              <div className="monthClick">
                <span
                  onClick={() => [
                    this.onMonthClick(m),
                    this.handleOnClickMonth(this.state.year, m),
                  ]}
                >
                  {m}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="DatePicker-container">
        <div className="header">
          <div className="mdpch-button">
            <div className="mdpchb-inner" onClick={() => this.setYear(-10)}>
              <span className="mdpchbi-left-arrow"></span>
            </div>
          </div>
          <div className="title-container">
            <div className="title">
              {[this.state.year - 10, "-", this.state.year]}
            </div>
          </div>
          <div className="mdpch-button">
            <div className="mdpchb-inner" onClick={() => this.setYear(10)}>
              <span className="mdpchbi-right-arrow"></span>
            </div>
          </div>
        </div>
        <div className="c-container">
          <div className="cc-head">
            {[].map((d, i) => (
              <div key={i} className="month-name">
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div
          className="MyDatePicker"
          onChange={this.updateDateFromInput}
          ref={inputRef}
        >
          {/*
          <div className="mdp-input">
            <input
              type="date"
              onChange={this.updateDateFromInput}
              ref={inputRef}
            />
    </div>*/}
          {this.state.showDatePicker ? (
            <div className="mdp-container">
              <div className="header">
                <div className="mdpch-button">
                  <div
                    className="mdpchb-inner"
                    onClick={() => this.setMonth(-1)}
                  >
                    <span className="mdpchbi-left-arrow"></span>
                  </div>
                </div>
                <div className="title-container" onClick={this.onTitleClick}>
                  <div className="title">
                    {this.getMonthStr(this.state.month)}
                  </div>
                  <div className="title">{this.state.year}</div>
                </div>
                <div className="mdpch-button">
                  <div
                    className="mdpchb-inner"
                    onClick={() => this.setMonth(1)}
                  >
                    <span className="mdpchbi-right-arrow"></span>
                  </div>
                </div>
              </div>
              <div>{this.renderCalendar()}</div>
            </div>
          ) : this.state.showMonthPicker ? (
            <div>{this.renderMonthPicker()}</div>
          ) : (
            <div>{this.renderYearPicker()}</div>
          )}
        </div>
      </div>
    );
  }
}

export default MyDatePicker;
