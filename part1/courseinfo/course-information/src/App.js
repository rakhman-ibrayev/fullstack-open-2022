import React from 'react'

const Header = (header) => {
  return (
    <h1>{header.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>Test {props.partName} {props.numExercises}</p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      <Part partName={parts[0].partName} numExercises={parts[0].numExercises} />
      <Part partName={parts[1].partName} numExercises={parts[1].numExercises} />
      <Part partName={parts[2].partName} numExercises={parts[2].numExercises} />
    </>
  );
}

const Total = ({ parts }) => {
  let totalNumExercises = 0

  totalNumExercises += parts[0].numExercises + parts[1].numExercises + parts[2].numExercises

  return (
    <p>Number of exercises {totalNumExercises}</p>
  )
}

const App = () => {
  const course = {
    title: 'Half Stack application development',
    arrParts: [
      {
        partName: 'Fundamentals of React',
        numExercises: 10
      },
      {
        partName: 'Using props to pass data',
        numExercises: 7
      },
      {
        partName: 'State of a component',
        numExercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.title} />
      <Content parts={course.arrParts} />
      <Total parts={course.arrParts} />
    </div>
  )
}

export default App