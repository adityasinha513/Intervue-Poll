import React, { useEffect, useState } from 'react';
import PollResults from './PollResults';
import io from 'socket.io-client';

const socket = io.connect('/');

const PollResultsContainer = ({ options = [], results = {} }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('new_poll', (pollData) => {
      setQuestion(pollData.question);
      setOptions(pollData.options || []);
      setSubmitted(false);
      setSelected('');
      setShowResults(false);
      setTimer(60);
      setResults({});
    });
    return () => socket.off('new_poll');
  }, []);

  return (
    <div>
      <h3>Poll Results</h3>
      <PollResults options={options} results={results} />
    </div>
  );
};

export default PollResultsContainer;

io.on('connection', (socket) => {
  socket.on('create_poll', (pollData) => {
    // Broadcast to all clients (students)
    io.emit('new_poll', pollData);
  });
});