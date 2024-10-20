import React, { useState, useRef, useEffect } from "react";

import "./ChatBot.css";

const ChatBot = () => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const apiKey = "API_KEY";

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const prompt = [
      { text: "input: Como se llama la empresa?" },
      { text: "output: CleanMe" },
      { text: "input: Quienes lo desarrollaron?" },
      {
        text: "output: Sánchez Tolentino Gerardo Julian, Hernandez Vasquez Cristian, Gallardo Dueñas Eduardo y Guitierrez Martinez Ana Cristina",
      },
      { text: "input: De que trata cleanme?" },
      {
        text: "output: Este proyecto es un servicio de lavandería que se centra en que el cliente que carece de tiempo para poder lavar su ropa, sea capaz de acceder fácilmente a un servicio básico, sin que esto interfiera en sus actividades cotidianas",
      },
      { text: "input: Cual es la misión de la empresa?" },
      {
        text: "output: Desarrollar, actualizar e innovar nuestro servicio con basta constancia, ofreciendo al cliente los mejores servicios, proporcionándoles el software necesario para poder realizar sus pedidos a nivel local de la manera más fácil y entendible posible.",
      },
      { text: "input: Cual es la visión de la empresa?" },
      {
        text: "output: Llegar a ser un servicio a nivel nacional, extendernos a diversas áreas donde sea más requerido, convertirnos en un equipo profesional en todo ámbito, experimentado y aprobado en desarrollo, actualización e innovación de otros proyectos que podamos desarrollar a futuro, extendernos por toda internet.",
      },
      { text: "input: Cual es la justificación de esta empresa?" },
      {
        text: "output: Haciendo hincapié en la experiencia de usuario, puesto que tiene debe ser superior que el de la competencia, y teniendo en cuenta que la queja más común de los usuarios es que la interfaz principal y el servicio al cliente es mala; y partiendo de estos puntos, se puede hacer un servicio mejorando estos aspectos para atraer a la mayor cantidad de personas.",
      },
      { text: "input: Este servicio se encuentra disponible solo en Tijuana?" },
      {
        text: "output: Por el momento, la cobertura acabar toda la ciudad de Tijuana.",
      },
      { text: "input: Qué métodos de pago hay?" },
      {
        text: "output: Se puede pagar el servicio con la tarjeta de crédito o debito.",
      },
      { text: "input: Cuanto demora la entrega?" },
      {
        text: "output: Por lo regular, desde que el usuario entrega sus prendas hasta que le son devueltas, hay un aproximado de entre 24 horas y 48 horas, aunque hay factores que pueda provocar su retraso.",
      },
      { text: "input: Que puedes hacer?" },
      {
        text: "output: Soy un asistente virtual, estoy aquí para guiarte en la navegación de ésta página, puedes preguntarme lo que gustes.",
      },
      { text: "input: Que eres?" },
      {
        text: "output: Soy un asistente virtual, estoy aquí para guiarte en la navegación de ésta página, puedes preguntarme lo que gustes.",
      },
      { text: "input: que nombre tiene este proyecto?" },
      { text: "output: " },
      { text: `input: ${messageInput}` },
      { text: "output: " },
    ];

    const messageObject = {
      contents: [
        {
          parts: prompt,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(messageObject),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const botResponse = {
        text: data.candidates[0].content.parts[0].text,
        sender: "bot",
      };

      setMessages([
        ...messages,
        { text: messageInput, sender: "user" },
        botResponse,
      ]);
    } catch (error) {
      console.error("Error fetching response from API:", error);
      const errorMessage = {
        text: "Lo siento, algo salió mal. Intenta nuevamente más tarde.",
        sender: "bot",
      };
      setMessages([
        ...messages,
        { text: messageInput, sender: "user" },
        errorMessage,
      ]);
    } finally {
      setMessageInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default Enter key behavior
      sendMessage();
    }
  };

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-bot-container">
      <div className="chat-title">ChatBot</div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div key={index} className={`message-bubble ${message.sender}`}>
              {message.text}
            </div>
          ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={messageInput}
          onChange={handleMessageInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
