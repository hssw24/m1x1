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
    // 10 zufällige 1x1 Aufgaben generieren
    const newTasks = [];
    const newResults = [];
    for (let i = 1; i <= 10; i++) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      newTasks.push({ task: `${a} x ${b}`, result: a * b });
      newResults.push(a * b);
    }

    // Ergebnisse zufällig mischen
    setResults(newResults.sort(() => Math.random() - 0.5));
    setTasks(newTasks);
  }, []);

  const handleTaskClick = (task) => {
    // Verhindere Mehrfachauswahl derselben Aufgabe
    if (selectedTask === task || matchedPairs.find(pair => pair.task === task)) return;
    setSelectedTask(task);
  };

  const handleResultClick = (result) => {
    // Verhindere Mehrfachauswahl desselben Ergebnisses
    if (selectedResult === result || matchedPairs.find(pair => pair.result === result && pair.task === selectedTask)) return;
    setSelectedResult(result);
  };

  useEffect(() => {
    // Wenn beide Karten (Aufgabe und Ergebnis) ausgewählt wurden
    if (selectedTask && selectedResult) {
      if (selectedTask.result === selectedResult) {
        // Einzigartige Aufgabe-Ergebnis-Paare speichern
        setMatchedPairs((prevPairs) => [...prevPairs, { task: selectedTask, result: selectedResult }]);
      }

      // Beide Auswahlen zurücksetzen
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
            // Berechnung der Y-Positionen der Kartenmitte + leichter Offset
            const taskRect = taskRefs.current[taskIndex].getBoundingClientRect();
            const resultRect = resultRefs.current[resultIndex].getBoundingClientRect();
            const taskY = taskRect.top + taskRect.height * 0.35; // Etwas höher als die Mitte
            const resultY = resultRect.top + resultRect.height * 0.35; // Etwas höher als die Mitte

            return (
              <line
                key={`${task.task}-${result}`}
                x1="40%" // Rechter Rand der Aufgaben
                y1={`${taskY}px`} // Leicht über der Mitte der Aufgabe
                x2="60%" // Linker Rand der Ergebnisse
                y2={`${resultY}px`} // Leicht über der Mitte des Ergebnisses
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
