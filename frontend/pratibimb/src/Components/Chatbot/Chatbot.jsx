import React, {useState, useEffect, useRef} from 'react'
import { medChat } from './chatbot.js'
import { SendHorizonal } from 'lucide-react';


const Chatbot = () => {
    const[prompt, setPrompt] = useState("");
    const[conversation, setConversation] = useState([]);
    const chatDisplayRef = useRef(null);

    const handleChat = async ()=>{
        if (!prompt.trim()) return; 

        const response = await medChat(prompt);
        const exchange = {"Q": prompt, "A": response};
        setConversation(prevConversation => [...prevConversation, exchange]);
        setPrompt(""); 
    }

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [conversation]);

  return (
    <>
    <div className="max-w-4xl p-4 mx-auto bg-white flex flex-col items-center rounded-lg shadow-lg mt-10">
        <h1 className='text-4xl mb-4'>MedChat</h1>

        <div ref={chatDisplayRef} className="max-h-96 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
            {conversation.map((item, index) => (
                <div key={index} className="mb-2">
                    <p className="font-semibold text-blue-700">You: {item.Q}</p>
                    <p className="text-gray-800"><span className=' font-semibold text-teal-700'>PratiBot:</span>  {item.A}</p>
                </div>
            ))}
        </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex justify-center mb-16 py-4 shadow-inner">
            <div className="w-full max-w-4xl px-4 flex gap-2 items-center">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type Here"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors shadow-md"
            />
            <SendHorizonal className='cursor-pointer text-teal-500' onClick={handleChat}/>
            </div>
        </div>
    </>
  )
}

export default Chatbot