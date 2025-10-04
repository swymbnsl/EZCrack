export const branches = [
  "AIDS",
  "AIML",
  "Civil",
  "CSE",
  "CST",
  "ECE",
  "EEE",
  "IT",
  "Mech",
];
export const semesters = Array.from(
  { length: 8 },
  (_, i) => `Semester ${i + 1}`
);

const firstYearCommonSubjects = [
  "Applied Chemistry",
  "Communication Skills",
  "Engineering Graphics",
  "Engineering Mechanics",
  "Electrical Science",
  "Environmental Science",
  "Human Values and Professional Ethics",
  "Indian Constitution",
  "Manufacturing Processes",
  "Programming in C",
  "Workshop Practice",
];

const firstSemSubjects = [
  "Applied Mathematics I",
  "Applied Physics I",
  ...firstYearCommonSubjects,
];

const secondSemSubjects = [
  "Applied Mathematics II",
  "Applied Physics II",
  ...firstYearCommonSubjects,
];

export const subjects = {
  aids: {
    1: firstSemSubjects,
    2: secondSemSubjects,
    3: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
    4: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
    5: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
    6: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
    7: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
    8: ["AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS", "AIDS"],
  },
};
