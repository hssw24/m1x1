import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const taskRefs = useRef([]);
  const resultRefs = useRef([]);

  useEffect(() => {
    // Erstelle alle möglichen 1x1-Paare mit eindeutigen Ergebnissen
    const allPairs = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        allPairs.push({ task: `${a} x ${b}`, result: a * b });
      }
    }

    // Mische die Paare und wähle die ersten 10 aus
    const shuffledPairs = allPairs.sort(() => Math.random() - 0.5).slice(0, 10);
    const newResults = shuffledPairs.map(pair => pair.result);

    // Ergebnisse zufällig mischen
    setResults(newResults.sort(() => Math.random() - 0.5));
    setTasks(shuffledPairs);
  }, []);

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
      if (selectedTask.result === selectedResult) {
        setMatchedPairs((prevPairs) => [...prevPairs, { task: selectedTask, result: selectedResult }]);
      }
      setSelectedTask(null);
      setSelectedResult(null);
    }
  }, [selectedTask, selectedResult]);

  const isMatched = (task, result) => matchedPairs.some(pair => pair.task === task && pair.result === result);

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
