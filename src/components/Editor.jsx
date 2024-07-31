import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror';
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror"
import "codemirror/theme/solarized.css"
import "codemirror/theme/dracula.css"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/mode/clike/clike"
import "codemirror/mode/python/python"
import "../App.css"
import ACTIONS from '../assets/Actions';
import toast from 'react-hot-toast';
const Editor = ({socketRef,roomId, onCodeChange, lang, username}) => {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async ()=>{
   editorRef.current =  CodeMirror.fromTextArea(document.getElementById("code-text"),{
    mode: "text/x-c++src",
    theme: "dracula",
    autoCloseBrackets: true,
    autoCloseTags: true,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,   
    styleActiveLine: true,  
    extraKeys: {           
      "Ctrl-Space": "autocomplete",
      "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }
    },
    foldGutter: true,       
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    highlightSelectionMatches: true,
    tabSize: 2,            
    indentUnit: 2,          
    indentWithTabs: false   
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

        if(origin ==="paste"){
         socketRef.current.emit("paste",{
          username,
          roomId
         })
         
        }

        if(origin ==="cut"){
          socketRef.current.emit("cut",{
            username,
            roomId
           })
        }


      })

     if(lang === "Java") {
      editorRef.current.setOption("mode","text/x-java")
     }else if(lang === "Python"){
      editorRef.current.setOption("mode","text/x-python")
     }else{
      
      editorRef.current.setOption("mode","text/x-c++src")
     }

     editorRef.current.on("copy",()=>{
      socketRef.current.emit("copy",{
        username,roomId
      })
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
    <div className='h-full w-full'>
    
    <textarea name="" id="code-text" defaultValue="// Your C++ code here"  /> 
    </div>
  )
}

export default Editor
