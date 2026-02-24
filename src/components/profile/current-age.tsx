import React from "react";

const BIRTH_YEAR = 1988;
const BIRTH_MONTH_INDEX = 10; // November (0-based)
const BIRTH_DAY = 1;

const getCurrentAge = () => {
  const now = new Date();
  let age = now.getFullYear() - BIRTH_YEAR;

  const hasHadBirthdayThisYear =
    now.getMonth() > BIRTH_MONTH_INDEX ||
    (now.getMonth() === BIRTH_MONTH_INDEX && now.getDate() >= BIRTH_DAY);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
};

const CurrentAge = () => <>{getCurrentAge()}</>;

export default CurrentAge;
