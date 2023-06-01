import "./App.css"
import {useState,useEffect,useRef} from 'react'
import ranWords from 'random-words';
import Header from "./Header";
import UIfx from 'uifx';
import click from './assets/click.mp3';
//import failed from './assets/failed.mp3';

const keytap = new UIfx(click,
  {
    volume: 0.3, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
)

const wordCount=100;
const seconds=60;
// const minutes=0;

function App(){
  const[word,setWord]=useState([]);

  const[secTime,setSecTime]=useState(seconds);
  // const[minTime,setMinTime]=useState(minutes);
  const[currInput,setCurrInput]=useState("");
  const[currIndex,setCurrIndex]=useState(0);
  const[correctWords,setCorrWords]=useState(0);
  const[incorrectWords,setIncorrectWords]=useState(0);
  const[wpm,setWPM]=useState(0);
  const[accuracy,setAccuracy]=useState(0);
  const[status,setStatus]=useState("waiting");
  const[startOrReset,setStartOrReset]=useState("Start!!")
  const[currCharIndex,setCurrCharIndex]=useState(-1); //represents the input based index
  const[currChar,setCurrChar]=useState(''); // represents input based character
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme')) || "medium");
  const inputText=useRef(null);

  useEffect(()=>setWord(generateWords()),[]);

  function generateWords(){
    const arr = new Array(wordCount).fill(null).map(()=>ranWords()); //don't know why breaking this into 2 statements is not working
    return arr;
  }

  useEffect(()=>{if(status=="started") inputText.current.focus()},[status]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);


  function start(){
    if(startOrReset==="Start!!"){
      setStatus(()=>"started");
      setStartOrReset(()=>"Reset!!");
      setSecTime(seconds);
      setCurrInput("");
      setCurrIndex(0);
      setCorrWords(0);
      setIncorrectWords(0);
      setWPM(0);
      setAccuracy(0);

      const interval=setInterval(()=>{
          setSecTime((secTime)=>
          {
            if(secTime>0){
              setSecTime(()=>secTime-1);
            }
            else{
              setStatus(()=>"finshed");
              clearInterval(interval);
            }
          })
        },1000);
    }
    else{
      window.location.reload(true)
    }
    
  }

  const handleKey=({keyCode,key})=>{
    keytap.play();
    if(keyCode===32){
      matchWord();
      setCurrInput("");
      setCurrIndex((currIndex)=>currIndex+1);
      setAccuracy(()=>Math.round(correctWords/(incorrectWords+correctWords)*100));
      setWPM(()=>(Math.round(correctWords/(seconds-secTime)*60)));

      // if(currIndex===0){
      //   setCurrIndex((currIndex)=>currIndex+1);
      //   console.log(word[currIndex]);
      // }
      setCurrCharIndex(-1);

      console.log(currIndex);
    }
    else if(keyCode===8){
      setCurrCharIndex(currCharIndex-1);
      setCurrChar('');
    }
    else{
      setCurrCharIndex(currCharIndex+1);
      setCurrChar(key);
    }
  }
 
  function matchWord(){
    let currWord=word[currIndex];
    if(currWord.trim()===currInput.trim()){
      console.log("yo");
      setCorrWords(correctWords+1);
    }
    else{
      setIncorrectWords(incorrectWords+1);
    }
  }

  function findCharClass(wordIndex,charIndex,charItself){
    
    if(currChar&&wordIndex==currIndex&&charIndex==currCharIndex){
      if(charItself===currChar)
        return 'has-background-success';
      else
        return 'has-background-danger';
    }
    else if(currIndex==wordIndex&&currCharIndex >= word[currIndex].length)
      return 'has-background-danger';
    else
      return '';
      
  }
  
  return(

    <div className={"App"+" "+theme}>
      <Header setTheme={setTheme} theme={theme}>
          Touch Typing Test 
      </Header>
      
      <div className=" has-text-centered"><span className="is-size-2">Time left: </span><span className="is-size-1 has-text-primary">{secTime}</span></div>
      
      <div className="control isExpanded section">
        <input ref={inputText} disabled={status!=="started"} type="text" className="input" onKeyDown={handleKey} value={currInput} onChange={(e)=>setCurrInput(e.target.value)} />
      </div>
      
      <button className="button is-info isExpanded" onClick={start}>{startOrReset}</button>
      
      {status!=="finshed"&&(  //note that we are using this AS if statement but not using actual if statement. W?;
        <div className="section">
        <div className="card">
          <div className="card-content">
            <div className="content">
              { word.map((wor,i) => (
                  <span key={i}>
                  <span>{wor.split("").map((w,idx)=>
                    (<span className={findCharClass(i,idx,w)} key={idx}>{w}</span>))}
                  </span><span> </span>
                  </span>
                )
              )
              }
            </div>
          </div>
        </div>
        </div>
      )}
      {status!=="waiting"&&(
        
        <div className="columns">
          <div className="column">
            <p className="is-size-5">Words per minute:</p>  
            <p className="has-text-primary is-size-1">{wpm}</p>
          </div>
          <div className="column">
            <p className="is-size-5">Accuracy:</p>  
            <p className="has-text-primary is-size-1">{accuracy}</p>
          </div>
        </div>
      
      )}
      
    </div>
  )
}

export default App;