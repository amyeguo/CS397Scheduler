import React, { useState } from "react";
import Course from "./Course.js";
import { getCourseTerm } from "../utilities/times.js";
import {
  useUserState,
  signInWithGoogle,
  signOut,
} from "../utilities/firebase.js";

const terms = { F: "Fall", W: "Winter", S: "Spring" };

const TermButton = ({ term, setTerm, checked }) => (
  <>
    <input
      type="radio"
      id={term}
      className="btn-check"
      autoComplete="off"
      checked={checked}
      onChange={() => setTerm(term)}
    />
    <label class="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);
const SignInButton = () => (
  <button
    className="btn btn-secondary btn-sm"
    onClick={() => signInWithGoogle()}
  >
    Sign In
  </button>
);
const SignOuButton = () => (
  <button className="btn btn-secondary btn-sm" onClick={() => signOut()}>
    Sign Out
  </button>
);

const TermSelector = ({ term, setTerm }) => {
  const [user] = useUserState();
  return (
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
        {Object.values(terms).map((value) => (
          <TermButton
            key={value}
            term={value}
            setTerm={setTerm}
            checked={value === term}
          />
        ))}
      </div>
      {user ? <SignOuButton /> : <SignInButton />}
    </div>
  );
};

//Course List Component
const CourseList = ({ courses }) => {
  const [term, setTerm] = useState("Fall");
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(
    (course) => term === getCourseTerm(course)
  );

  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map((course) => (
          <Course
            key={course.id}
            course={course}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </>
  );
};

export default CourseList;
