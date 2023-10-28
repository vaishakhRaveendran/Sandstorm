import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [waitingForAnswer, setWaitingForAnswer] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = [
        "Hello! How was your day?",
        "Is there something that's been bothering you or making you feel down?",
        "How are you feeling right now, in this moment?",
        "Is there anything in particular you'd like to talk about?",
    ];

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleBotResponse = (responseText) => {
        const newBotMessage = {
            text: responseText,
            user: 'bot',
        };
        setMessages([...messages, newBotMessage]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message) {
            const newUserMessage = {
                text: message,
                user: 'user',
            };

            setMessages([...messages, newUserMessage]);
            setMessage('');

            if (waitingForAnswer) {
                // Handle the user's answer to the previous question
                handleBotResponse(`You answered: ${message}`);

                // Now, ask the next question or end the conversation
                setWaitingForAnswer(false);

                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    handleBotResponse(questions[currentQuestionIndex]);
                    setWaitingForAnswer(true);
                } else {
                    // End the conversation
                }

                // If needed, you can also send the user's response to the server here
                try {
                    await axios.post('http://localhost:8000/save_messages', {
                        messages: [...messages, newUserMessage],
                    });
                } catch (error) {
                    console.error('Error sending messages to the server:', error);
                }
            } else {
                // Ask the initial question
                handleBotResponse(questions[currentQuestionIndex]);
                setWaitingForAnswer(true);
            }
        }
    };

    return (
        <div>
            <div>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.user === 'user' ? 'user-message' : 'bot-message'}>
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="bot-message">{questions[currentQuestionIndex]}</div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={message} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
