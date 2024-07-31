import './App.css'
import axios from 'axios';
import {useState} from 'react';
import {motion} from 'framer-motion';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { TailSpin } from 'react-loader-spinner';

function App() {
  const [mode, setMode] = useState('light');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const text = 'AI Chat App'.split(' ');

  const toggleDarkMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.body.classList.toggle('dark-mode', newMode === 'dark');
    console.log('Dark mode applied');
  };

  async function getAnswer(query = question) {
    setLoading(true);
    setAnswer('');
    const conversationText = conversation.concat(query).join(' ');
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: 'post',
        data: {
          contents:[
            { parts:[{text: conversationText}]},
          ],
        },
      });
      const newAnswer = response['data']['candidates'][0]['content']['parts'][0]['text'];
      setAnswer(newAnswer);
      setConversation([...conversation, query, newAnswer]);
    } catch(error) {
      setAnswer('An error occurred');
    }
    setLoading(false);
    
  }

  const quickReply = (reply) => {
    setQuestion(reply);
    getAnswer(reply);
  }

  

  return (
    <>

      <motion.button className= 'button' whileTap={{ scale: 0.85 }} onClick={toggleDarkMode}><DarkModeIcon/></motion.button>

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
      <motion.button className = 'button' whileTap = {{scale: 0.85}} onClick = {() => getAnswer(question)}>Get an answer</motion.button>
      {loading ? (
        <div className = 'loader'>
          <TailSpin color = '#de8e8e'/>
        </div>
      ) : (<p className = 'answer-text'>{answer}</p>
      )}
      <motion.button className = 'button' whileTap = {{scale: 0.85}} onClick = {() => quickReply('Tell me more')}>Tell me more</motion.button>
    </>
  )
  
}

export default App
