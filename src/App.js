import React, { useState, useEffect } from "react";
import "./App.css";
import CourseList from "./components/CourseList";

//check the meeting times
const meetsPat =
  /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = (meets) => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match
    ? {}
    : {
        days,
        hours: {
          start: hh1 * 60 + mm1 * 1,
          end: hh2 * 60 + mm2 * 1,
        },
      };
};

const mapValues = (fn, obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );

const addCourseTimes = (course) => ({
  ...course,
  ...timeParts(course.meets),
});

const addScheduleTimes = (schedule) => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses),
});

//Banner Component (takes in schedule title object and destructres)
const Banner = ({ title }) => <h1>{title}</h1>;

//App
const App = () => {
  //setting the schedule uses state
  const [schedule, setSchedule] = useState();
  const url = "https://courses.cs.northwestern.edu/394/data/cs-courses.php";

  //fetches the schedule asynchronously with the Effect hook
  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(addScheduleTimes(json));
    };
    fetchSchedule();
  }, []);

  //while schedule is loading...
  if (!schedule) return <h1>Loading schedule...</h1>;

  //returns a banner with the ti
  return (
    <div className="container">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
};

export default App;
