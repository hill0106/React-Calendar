import React, { Component } from "react";
import { If, Then, ElseIf, Else } from "react-if-elseif-else-render";
import "./Datepickerstyle.css";

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;
let a = +new Date();
let Month = new Date().getMonth();
let inputRef = React.createRef();

export default class MyDatePicker extends Component {
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
      yearDetails: this.getYearDetails(year), //array
      showMonthPicker: 1,
      onClickMonth: false,
      showDatePicker: true,
      showPicker: 0,
      monthDetails: data,
      showSubYearButton: true,
      showAddYearButton: true,
    };
  }

  componentDidMount() {
    this.setDateToInput(this.state.selectedDay);
    this.setMonthToInput(this.state.selectedMonth);
    this.setYearToInput(this.state.selectedYear);
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
    if (year >= 1997 && year <= 2008) {
      for (let i = 1997; i <= 2008; i++) yearArray.push(i);
    } else if (year >= 2009 && year <= 2020) {
      for (let i = 2009; i <= 2020; i++) yearArray.push(i);
    } else if (year >= 2021 && year <= 2032) {
      for (let i = 2021; i <= 2032; i++) yearArray.push(i);
    }
    return yearArray;
  };

  getYearOutput = (year) => {
    let output = [];
    let yearFirstOutput = 0,
      yearLastOutput = 0;
    if (year >= 1997 && year <= 2008) {
      yearFirstOutput = 1998;
      yearLastOutput = 2007;
      //this.setState({ showSubYearButton: false });
    } else if (year >= 2009 && year <= 2020) {
      yearFirstOutput = 2010;
      yearLastOutput = 2019;
    } else if (year >= 2021 && year <= 2032) {
      yearFirstOutput = 2022;
      yearLastOutput = 2031;
      //this.setState({ showAddYearButton: false });
    }
    output.push(yearFirstOutput.toString() + "-" + yearLastOutput.toString());

    return output;
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

  isSelectedYear = (y) => {
    return y === this.state.selectedYear;
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

  setYearDate = (y) => {
    let selectedYear = new Date(y.year).getTime();
    this.setState({ selectedYear });
    if (this.props.onChange) {
      this.props.onChange(selectedYear);
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

  setYearToInput = (y) => {
    inputRef.current.value = y;
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

  onYearClick = (y) => {
    this.setState({ showPicker: 0 });
    this.setState({ selectedYear: y }, () => this.setYearToInput(y));
    if (this.props.onChange) {
      this.props.onChange(y);
    }
  };

  onTitleClick = () => {
    this.setState({ showPicker: 1 });
  };

  onTitleYearClick = () => {
    this.setState({ showPicker: 2 });
    this.setState({ showMonthPicker: false });
    // console.log("titleYear Clicked");
  };

  handleOnClickMonth = (year, month) => {
    this.setState({ onClickMonth: true });
    this.setState({ showPicker: 0 });
    month = this.CurrentMonthToNum(month);
    this.setState({ year: year });
    this.setState({ month: month });
    this.setState({
      Details: this.getDetails(year, month),
    });
    //console.log(year, month);
  };

  handleOnClickYear = (year, month) => {
    this.setState({ year: year });
    this.setState({ month: month });
    this.setState({ showPicker: 0 });
    this.setState({
      Details: this.getDetails(year, month),
    });
  };

  setYear = (offset) => {
    let year = this.state.year + offset;
    this.setState({
      year,
      yearDetails: this.getYearDetails(year), //array
    });

    console.log(this.state.year);
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
            <span onClick={() => [this.onDateClick(day)]}>{day.date}</span>
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
    let yearData = this.state.yearDetails.map((y, index) => {
      return (
        <div className="MonthContainer">
          <div className={"month-name-container"}>
            <div
              className={
                index === 0 || index === 11
                  ? "disabled"
                  : "" +
                    (this.isSelectedYear(y)
                      ? "month-name-highlighted"
                      : "month-name-nohighlight")
              }
              key={index}
            >
              <div className="monthClick">
                <span
                  onClick={() => [
                    this.onYearClick(y),
                    this.handleOnClickYear(y, this.state.month),
                  ]}
                >
                  {y}
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
            <div
              className={
                (this.state.year <= 2032 && this.state.year >= 2021) ||
                (this.state.year <= 2020 && this.state.year >= 2009)
                  ? "mdpchb-inner"
                  : "NoShow-mdpchb-inner"
              }
              onClick={() => this.setYear(-10)}
            >
              <span className="mdpchbi-left-arrow"></span>
            </div>
          </div>
          <div className="year-title-container">
            <div className="title">{this.getYearOutput(this.state.year)}</div>
          </div>
          <div className="mdpch-button">
            <div
              className={
                (this.state.year >= 1997 && this.state.year <= 2008) ||
                (this.state.year <= 2020 && this.state.year >= 2009)
                  ? "mdpchb-inner"
                  : "NoShow-mdpchb-inner"
              }
              onClick={() => this.setYear(10)}
            >
              <span className="mdpchbi-right-arrow"></span>
            </div>
          </div>
        </div>
        <div>{yearData}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="Background">
        <div
          className="MyDatePicker"
          onChange={this.updateDateFromInput}
          ref={inputRef}
        >
          <If condition={this.state.showPicker === 0}>
            <Then>
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
            </Then>
            <ElseIf condition={this.state.showPicker === 1}>
              <div>{this.renderMonthPicker()}</div>
            </ElseIf>
            <ElseIf condition={this.state.showPicker === 2}>
              <Then>
                <div>{this.renderYearPicker()}</div>
              </Then>
            </ElseIf>
          </If>
        </div>
      </div>
    );
  }
}
