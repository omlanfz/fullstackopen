const CourseHeader = ({ title }) => <h2>{title}</h2>;

const CoursePart = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const CourseContent = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <CoursePart key={part.id} part={part} />
    ))}
  </div>
);

const CourseTotal = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>
      <strong>total of {total} exercises</strong>
    </p>
  );
};

const Course = ({ course }) => (
  <div>
    <CourseHeader title={course.name} />
    <CourseContent parts={course.parts} />
    <CourseTotal parts={course.parts} />
  </div>
);

export default Course;
