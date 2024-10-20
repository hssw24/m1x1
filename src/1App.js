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
    const newTasks = [];
    const newResults = new Set(); // Set für eindeutige Ergebnisse

    // 10 eindeutige 1x1 Aufgaben generieren
    while (newTasks.length < 10) {
      const a = Math.floor(Math.random() * 9) + 1; // Zahlen zwischen 1 und 9
      const b = Math.floor(Math.random() * 9) + 1; // Zahlen zwischen 1 und 9
      const result = a * b;

      // Falls das Ergebnis schon existiert, eine neue Aufgabe generieren
      if (!newResults.has(result)) {
        newTasks.push({ task: `${a} x ${b}`, result });
        newResults.add(result); // Ergebnis zu Set hinzufügen
      }
    }

    // Ergebnisse zufällig mischen
    setResults([...newResults].sort(() => Math.random() - 0.5));
    setTasks(newTasks);
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
