import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: "Hello! How was your day?", user: 'bot' }
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [displayedMessage, setDisplayedMessage] = useState(null);
    const questions = [
        "Is there something that's been bothering you or making you feel down?",
        "How are you feeling right now, in this moment?",
        "Is there anything in particular you'd like to talk about?",
    ];

    useEffect(() => {
        if (messages.length > 0) {
            setDisplayedMessage(messages[messages.length - 1]);
        }
    }, [messages]);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleBotResponse = (responseText) => {
        const newBotMessage = {
            text1: responseText,
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

            // Handle the user's answer to the current question
            handleBotResponse(`You answered: ${message}`);

            if (currentQuestionIndex <= questions.length + 1) {
                // If there are more questions, set the next question index
                setCurrentQuestionIndex(currentQuestionIndex + 1);

                // Display the next question after a delay
                setTimeout(() => {
                    handleBotResponse(questions[currentQuestionIndex]);
                }, 1000); // Delay next question
            } 
            // else {
            //     // End the conversation or provide a completion message
            //     setTimeout(() => {
            //         handleBotResponse("Thank you for the conversation. Feel free to ask more questions.");
            //     }, 1000);
            // }

            // If needed, you can send the user's response to the server here
            try {
                await axios.post('http://your-flask-server-url/save_messages', {
                    messages: [...messages, newUserMessage],
                });
            } catch (error) {
                console.error('Error sending messages to the server:', error);
            }
        }
    };

    return (
        <div>
            <div>
                <div className='input-container'>
                    {displayedMessage && (
                        <div className={displayedMessage.user === 'user' ? 'user-message' : 'bot-message'}>
                        {displayedMessage.text}
                        {displayedMessage.text1 && (
                            <div>{displayedMessage.text1}</div>
                        )}
                    </div>
                    )}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={message} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>

        </div>
    );
};

export default Chatbot;
