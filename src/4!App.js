import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // Aufgaben und Ergebnisse direkt im Code definieren
  const taskPairs = [
    { task: '1 x 1', result: 1 },
    { task: '1 x 2', result: 2 },
    { task: '1 x 3', result: 3 },
    { task: '1 x 4', result: 4 },
    { task: '1 x 5', result: 5 },
    { task: '1 x 6', result: 6 },
    { task: '1 x 7', result: 7 },
    { task: '1 x 8', result: 8 },
    { task: '1 x 9', result: 9 },
    { task: '1 x 10', result: 10 },
  ];

  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const taskRefs = useRef([]);
  const resultRefs = useRef([]);

  useEffect(() => {
    // Aufgaben und Ergebnisse festlegen
    const shuffledResults = shuffleResults(taskPairs.map(pair => pair.result));
    setTasks(taskPairs);
    setResults(shuffledResults);
  }, []);

  const shuffleResults = (resultsArray) => {
    for (let i = resultsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultsArray[i], resultsArray[j]] = [resultsArray[j], resultsArray[i]]; // Swap elements
    }
    return resultsArray;
  };

  const handleTaskClick = (task) => {
    if (selectedTask === task || matchedPairs.find(pair => pair.task === task)) return;
    setSelectedTask(task);
  };

  const handleResultClick = (result) => {
    if (selectedResult === result || matchedPairs.find(pair => pair.result === result && pair.task === selectedTask)) return;
    setSelectedResult(result);
  };

  useEffect(() => {
    if (selectedTask && selectedResult) {
      const correctPair = tasks.find(t => t.result === selectedResult && t.task === selectedTask.task);
      if (correctPair) {
        setMatchedPairs(prevPairs => [...prevPairs, { task: selectedTask, result: selectedResult }]);
      }
      setSelectedTask(null);
      setSelectedResult(null);
    }
  }, [selectedTask, selectedResult, tasks]);

  return (
    <div className="memory-game">
      <h1>1x1 Memory Spiel</h1>
      <div className="game-board">
        <div className="tasks">
          <h2>Aufgaben</h2>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`task ${selectedTask === task ? 'selected' : ''}`}
              onClick={() => handleTaskClick(task)}
              style={{
                backgroundColor: matchedPairs.find(pair => pair.task === task) ? '#d4edda' : '#f0f0f0',
              }}
              ref={(el) => (taskRefs.current[index] = el)}
            >
              {task.task}
            </div>
          ))}
        </div>
        <div className="results">
          <h2>Ergebnisse</h2>
          {results.map((result, index) => (
            <div
              key={index}
              className={`result ${selectedResult === result ? 'selected' : ''} ${
                matchedPairs.find(pair => pair.result === result) ? 'matched' : ''
              }`}
              onClick={() => handleResultClick(result)}
              ref={(el) => (resultRefs.current[index] = el)}
            >
              {result}
            </div>
          ))}
        </div>
      </div>

      {/* Linienverbindung bei passenden Paaren */}
      <svg className="lines">
        {matchedPairs.map(({ task, result }) => {
          const taskIndex = tasks.findIndex((t) => t === task);
          const resultIndex = results.findIndex((res) => res === result);

          if (taskRefs.current[taskIndex] && resultRefs.current[resultIndex]) {
            const taskRect = taskRefs.current[taskIndex].getBoundingClientRect();
            const resultRect = resultRefs.current[resultIndex].getBoundingClientRect();
            const taskY = taskRect.top + taskRect.height * 0.35;
            const resultY = resultRect.top + resultRect.height * 0.35;

            return (
              <line
                key={`${task.task}-${result}`}
                x1="40%"
                y1={`${taskY}px`}
                x2="60%"
                y2={`${resultY}px`}
                stroke="black"
                strokeWidth="2"
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default App;
