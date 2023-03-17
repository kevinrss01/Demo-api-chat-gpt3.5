import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import React, { useState, useEffect } from "react";
import { Comment } from "react-loader-spinner";

function App() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState([
    { role: "system", content: "Tu es mon assistant personnel." },
  ]);

  const apiKey = "YOUR_API_KEY";
  const config = new Configuration({ apiKey: apiKey });
  const openai = new OpenAIApi(config);

  const askToChatGPT = async () => {
    setIsLoading(true);
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationState,
        max_tokens: 3500,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      setConversationState((prevState) => [
        ...prevState,
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
        },
      ]);

      setIsLoading(false);
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (
        conversationState.length > 1 &&
        conversationState[conversationState.length - 1].role === "user"
      ) {
        await askToChatGPT();
      }
    }

    fetchData();
    console.log(conversationState);
  }, [conversationState]);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <h1>ChatBot intelligent</h1>
        {isLoading && (
          <Comment
            visible={true}
            height="40"
            width="40"
            arialabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#F4442E"
          />
        )}
        <label>Poser votre question</label>
        <div>
          <input
            type="text"
            name="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              if (question) {
                setConversationState((prevState) => [
                  ...prevState,
                  {
                    role: "user",
                    content: question,
                  },
                ]);
                setQuestion("");
              } else {
                console.error("Question vide");
              }
            }}
          >
            Envoyer
          </button>
        </div>

        <div
          className="answersContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "500px",
          }}
        >
          {conversationState.map((key) => {
            if (conversationState.length > 1) {
              return (
                <>
                  {key.role === "user" && (
                    <>
                      <b key={key}>Question : </b>
                      <p>{key.content}</p>
                    </>
                  )}
                  {key.role === "assistant" && (
                    <>
                      <b key={key}>Réponse : </b>
                      <p>{key.content}</p>
                    </>
                  )}
                </>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
