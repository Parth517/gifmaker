import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const ffmpeg = createFFmpeg({ log: true});

function App() {
  const[ready,setReady]=useState(false);
  const[video,setVideo]=useState();
  const [gif, setGif] = useState();

  const load=async()=>{
    await ffmpeg.load();
    setReady(true);
  }
  useEffect(()=>{
    load();
  },[])

const convertToGif=async()=>{
  ffmpeg.FS('writeFile','test.mp4',await fetchFile(video));

  await ffmpeg.run('-i','test.mp4','-t','3.0','-ss','2.0','-f','gif','out.gif')
  //-i insert -t=length of video to be -ss=starting seconds to offset -f=encode to gif file          
  //Read the file
  const data= ffmpeg.FS('readFile','out.gif');

  //Create url for new file
  const url=URL.createObjectURL(new Blob([data.buffer],{type:'image/gif'}));
  setGif(url);
}

const downloadGif=(gif)=>{
  if(gif){
  const fileName=gif.split('/').pop()
  const aTag=document.createElement('a')
  aTag.href=gif;
  aTag.setAttribute('download',fileName)
  document.body.appendChild(aTag)
  aTag.click();
  aTag.remove();
  }
}


  return ready ?(
    <div className="App">
      
      {video &&<video controls width="250"
        src={URL.createObjectURL(video)}>
        </video>}
        <br />
      <input type='file' onChange={(e)=>setVideo(e.target.files?.item(0))} />
      <h3>Result</h3>
          <button onClick={convertToGif}>Convert</button>
          <br />

      {gif && <img src={gif} width={250}/>}
      <br />
      
      {gif && <button onClick={()=>downloadGif(gif)}>Download</button>}

      </div>
  ):
  (<p>Loading...</p>)
}

export default App;

//{gif && <button onClick={()=>downloadGif(gif)}>Download</button>}
//in the above line dont forget to pass the(gif argument)
