import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror';
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror"
import "codemirror/theme/solarized.css"
import "codemirror/theme/cobalt.css"
import "codemirror/mode/javascript/javascript"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "../App.css"
import ACTIONS from '../assets/Actions';
const Editor = ({socketRef,roomId, onCodeChange}) => {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async ()=>{
   editorRef.current =  CodeMirror.fromTextArea(document.getElementById("code-text"),{
        mode: {name:"javascript", json:true},
        theme:"cobalt",
        autoCloseBrackets:true,
        autoCloseTags: true,
        lineNumbers:true,
        lineWrapping:true
      });


      editorRef.current.on('change',(instance,chnages)=>{
        const {origin} = chnages;
        const code = instance.getValue();
        onCodeChange(code)
        if(origin !== "setValue"){
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                roomId,
                code

            })
        }
      })

      

    }



   init();
  }, [])
  useEffect(() => {
    if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            editorRef.current.setValue(code)
        })
    }
  
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
  }, [socketRef.current])
  

  return (
    <div className='h-screen w-full'>
    
    <textarea name="" id="code-text"> </textarea>
    </div>
  )
}

export default Editor
