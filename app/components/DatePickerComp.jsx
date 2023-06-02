"use client";
import { useState } from "react";
// https://swr.vercel.app/
import useSWR from "swr";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";

// classes for datepickers
const classes = "px-6 py-4 rounded-full ";

export default function DatePickerComp() {
  // set defualt date as today and tomorrow
  let defaultDate = new Date();
  // set defualt date as today
  const today = new Date();
  // set default date + 1 as tomorrow
  const tomorrow = defaultDate.setDate(defaultDate.getDate() + 1);
  // set default state for calendar
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  // fetch data from backend
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/hello",
    fetcher
  );
  if (error) return <div className="text-5xl">failed to load</div>;
  if (isLoading) return <div className="text-5xl">loading...</div>;

  // alter the response data
  let dates = Object.entries(data);
  dates = dates[0][1];
  dates = Object.entries(dates);
  dates = Object.entries(dates);

  // make and array of dates
  let datesArray = [];
  dates.forEach(([key, value]) => {
    if (value[1].start === undefined) {
      return;
    }
    let startDate = value[1].start;
    let endDate = value[1].end;
    // change string values to date
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    // make a new array
    datesArray.push([startDate, endDate]);
  });
  // format array for date-picker
  let datesArrayNew = [];
  datesArray.map(function (item, i) {
    return datesArrayNew.push([
      { start: subDays(item[0], 0), end: addDays(item[1], -1) },
    ]);
  });
  // make the best array of dates for date-picker ranges to work
  let datesArrayBEST = [];
  const finalArray = () => {
    datesArrayNew.map(function (item, i) {
      return datesArrayBEST.push(item[0]);
    });
  };
  datesArrayBEST.push({
    start: subDays(new Date(), 5000),
    end: addDays(new Date(), -1),
  });
  finalArray();
  return (
    <div className="flex gap-4 text-xl font-medium text-black">
      <DatePicker
        className={classes}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        excludeDateIntervals={datesArrayBEST}
        endDate={endDate}
        monthsShown={2}
        // inline
      />
      <DatePicker
        className={classes}
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        excludeDateIntervals={datesArrayBEST}
        minDate={startDate}
        // inline
      />
    </div>
  );
}
