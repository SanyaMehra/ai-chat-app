import './App.css'
import axios from 'axios';
import {useState} from 'react';
import {motion} from 'framer-motion';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const text = 'AI Chat  App'.split(' ');

  async function getAnswer() {
    setAnswer('loading');
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
        import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
      }`,
      method: 'post',
      data: {
        contents:[
          { parts:[{text: question}]},
        ],
      },
    });
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }

  return (
    <>
      <h1>
        {text.map((el, i) => (
          <motion.span
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
            transition = {{
              duration: 3,
              delay: i / 10,
            }}
            key = {i}
          >
            {el}{' '}
          </motion.span>
        ))}
      </h1>
      
      <textarea 
        className = 'border rounded w-full'
        value = {question} 
        onChange = {(e) => setQuestion(e.target.value)} 
        placeholder = 'Enter a question' 
        cols = '70' 
        rows = '20'>
      </textarea>
      <motion.button className = 'button' whileTap = {{scale: 0.85}} onClick = {getAnswer}>Get an answer</motion.button>
      <p>{answer}</p>
    </>
  )
  
}

export default App
