import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // Aufgaben und Ergebnisse direkt im Code definieren
  const taskPairs = [
    { task: '8 x 6', result: 48 },
    { task: '6 x 7', result: 42 },
    { task: '9 x 6', result: 54 },
    { task: '7 x 8', result: 56 },
    { task: '9 x 4', result: 36 },
    { task: '4 x 7', result: 28 },
    { task: '7 x 9', result: 63 },
    { task: '9 x 3', result: 27 },
    { task: '3 x 7', result: 21 },
    { task: '6 x 4', result: 24 }
  ];


  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const taskRefs = useRef([]);
  const resultRefs = useRef([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const shuffleResults = (resultsArray) => {
    for (let i = resultsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultsArray[i], resultsArray[j]] = [resultsArray[j], resultsArray[i]]; // Elemente vertauschen
    }
    return resultsArray;
  };

  const startNewGame = () => {
    const shuffledResults = shuffleResults(taskPairs.map(pair => pair.result));
    setTasks(taskPairs);
    setResults(shuffledResults);
    setMatchedPairs([]);
    setSelectedTask(null);
    setSelectedResult(null);
    setGameOver(false);
  };

  const handleTaskClick = (task) => {
    if (matchedPairs.find(pair => pair.task === task)) return;

    // Aufgabe markieren
    setSelectedTask(task);
  };

  const handleResultClick = (result) => {
    if (matchedPairs.find(pair => pair.result === result)) return;

    // Ergebnis markieren
    setSelectedResult(result);
  };

  useEffect(() => {
    if (selectedTask && selectedResult) {
      const correctPair = tasks.find(t => t.result === selectedResult && t.task === selectedTask.task);
      if (correctPair) {
        setMatchedPairs(prevPairs => [...prevPairs, { task: selectedTask, result: selectedResult }]);
      }

      // Überprüfen, ob das Spiel zu Ende ist
      if (matchedPairs.length + 1 === tasks.length) {
        setGameOver(true);
      }

      // Zurücksetzen der Auswahl
      setSelectedTask(null);
      setSelectedResult(null);
    }
  }, [selectedTask, selectedResult, tasks, matchedPairs]);

  return (
    <div className="memory-game">
      <h1>1x1</h1>
      <div className="game-board">
        <div className="tasks">
          <h2>Aufgaben</h2>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`task ${selectedTask === task ? 'selected' : ''} ${
                matchedPairs.find(pair => pair.task === task) ? 'matched' : ''
              }`}
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

      {gameOver && (
        <div className="restart-container">
          <button onClick={startNewGame}>Nochmal spielen?</button>
        </div>
      )}
    </div>
  );
};

export default App;
