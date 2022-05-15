import React, { useEffect } from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

const HEX_DIGITS = '0123456789ABCDEF';
const DEC_DIGITS = '0123456789';
const OCT_DIGITS = '01234567';
const BIN_DIGITS = '01';

const BASE_TO_DIGITS = {
  2: BIN_DIGITS,
  8: OCT_DIGITS,
  10: DEC_DIGITS,
  16: HEX_DIGITS
}

const BASE_TO_BASENAME = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal'
}

const generateNumber = (length, digits) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  if (result[0] === '0') {
    result = '1' + result.substring(1);
  }
  return result;
}

const convertToBase = (number, digits) => {
    if (number === 0) {
      return digits[0];
    }
    let result = '';
    while (number > 0) {
        result = digits[number % digits.length] + result;
        number = Math.floor(number / digits.length);
    }
    return result;
}

const generateQuestion = (difficulty, type, base) => {
  const problem = {
    question: '',
    answer: '',
    explanation: ''
  }
  if (base === 2) {
    difficulty *= 2;
  }
  let digits = BASE_TO_DIGITS[base];

  let num1 = generateNumber(difficulty, digits);
  let num2 = generateNumber(difficulty, digits);

  switch (type) {
    // Addition
    case 1:
      problem.question = `${num1} + ${num2}`;
      problem.answer = convertToBase(parseInt(num1, base) + parseInt(num2, base), digits);
      problem.explanation = `${num1} + ${num2} = ${problem.answer}`;
      break;
    // Subtraction
    case 2:
      let num3 = convertToBase(parseInt(num1, base) + parseInt(num2, base), digits);
      problem.question = `${num3} - ${num2}`;
      problem.answer = num1;
      problem.explanation = `${num3} - ${num2} = ${problem.answer}`;
      break;
    // Multiplication
    case 3:
      problem.question = `${num1} * ${num2}`;
      problem.answer = convertToBase(parseInt(num1, base) * parseInt(num2, base), digits);
      problem.explanation = `${num1} * ${num2} = ${problem.answer}`;
      break;
    // Division
    case 4:
      let num4 = convertToBase(parseInt(num1, base) * parseInt(num2, base), digits);
      problem.question = `${num4} / ${num2}`;
      problem.answer = num1;
      problem.explanation = `${num4} / ${num2} = ${problem.answer}`;
      break;
  }

  problem.question = `(${BASE_TO_BASENAME[base]})\n${problem.question}`;

  return problem;
}

const NewQuestionForm = (props) => {
  const [difficulty, setDifficulty] = useState(1);
  const [type, setType] = useState(1);
  const [base, setBase] = useState(2);


  const handleSubmit = e => {
    e.preventDefault();
    props.setStates(generateQuestion(difficulty, type, base));
  };

  return (
    <form className='row g-2 justify-content-center mb-5' onSubmit={handleSubmit}>
      <div className='col-auto'>
        <select className='form-select' value={difficulty} onChange={e => setDifficulty(parseInt(e.target.value))}>
          <option value='1'>Easy</option>
          <option value='2'>Medium</option>
          <option value='3'>Hard</option>
        </select>
      </div>
      <div className='col-auto'>
        <select className='form-select' value={type} onChange={e => setType(parseInt(e.target.value))}>
          <option value='1'>Addition</option>
          <option value='2'>Subtraction</option>
          <option value='3'>Multiplication</option>
          <option value='4'>Division</option>
        </select>
      </div>
      <div className='col-auto'>
        <select className='form-select' value={base} onChange={e => setBase(parseInt(e.target.value))}>
          <option value='2'>Binary</option>
          <option value='8'>Octal</option>
          <option value='10'>Decimal</option>
          <option value='16'>Hexadecimal</option>
        </select>
      </div>
      <div className='col-auto'>
        <button type='submit' className='btn btn-primary'>New Question</button>
      </div>
    </form>
  );
};

function App() {

  let [input, setInput] = useState('');
  let [question, setQuestion] = useState('');
  let [answer, setAnswer] = useState('');
  let [explanation, setExplanation] = useState('');
  let [answerVisible, setAnswerVisible] = useState(false);
  let [explanationVisible, setExplanationVisible] = useState(false);
  let [feedback, setFeedback] = useState('');

  let setStates = (newQuestion) => {
    setQuestion(newQuestion.question);
    setAnswer(newQuestion.answer);
    setExplanation(newQuestion.explanation);
    setAnswerVisible(false);
    setExplanationVisible(false);
    setFeedback('');
    setInput('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (input.toUpperCase() === answer) {
      setFeedback('is-valid');
    } else {
      setFeedback('is-invalid');
    }
  }

  useEffect(() => {
    const newQuestion = generateQuestion(1, 1, 2);
    setStates(newQuestion);
  }, []);

  return (
    <main className='container'>
      <h1 className='display-1 mt-2 mb-4'>Latihan Soal Sistem Bilangan</h1>

      <NewQuestionForm setStates={setStates} />

      <p className='fs-4 mb-5'>{question}</p>

      <form className='' onSubmit={handleSubmit}>
        <div className='row g-2 justify-content-center mb-2'>
          <div className='col-sm-auto'>
            <input type='text' className={feedback + ' form-control'} placeholder='Answer' value={input} onChange={e => setInput(e.target.value)} />
          </div>
          <div className='col-sm-auto'>
            <button type='submit' className="btn btn-primary">Check Answer</button>
          </div>
        </div>

        <div className='row g-2 justify-content-center mb-2'>
          <div className='col-sm-auto'>
            <button type='button' className="btn btn-primary" onClick={() => setAnswerVisible(!answerVisible)}>{answerVisible ? 'Hide' : 'Show'} Answer</button>
          </div>
          <div className='col-sm-auto'>
            <button type='button' className="btn btn-primary" onClick={() => setExplanationVisible(!explanationVisible)}>{explanationVisible ? 'Hide' : 'Show'} Explanation</button>
          </div>
        </div>
      </form>


      { answerVisible && <p className='fs-5'>Answer: {answer}</p> }
      { explanationVisible && <p className='fs-5'>Explanation: (Coming soon!)</p> }
    </main>
  );
}

export default App;