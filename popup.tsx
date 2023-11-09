// import { useState } from "react"

// import "./style.css"

// function IndexPopup() {
//   const [data, setData] = useState("")

//   return (
//     <div
//        className="h-300 w-300 p-10">
//       <h2>
//         Welcome to your
//         <a href="https://www.plasmo.com" target="_blank">
//           {" "}
//           browser extension by Faizan!
//         </a>{" "}
//       </h2>
//       <input onChange={(e) => setData(e.target.value)} value={data} />
//       <a href="https://docs.plasmo.com" target="_blank">
//         View Docs
//       </a>
//     </div>
//   )
// }

// export default IndexPopup


import { useState } from "react"
import "./style.css"
import axios from "axios";

function IndexPopup() {
  const [data, setData] = useState("")
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCommand(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add the user's command as a message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: command,
      },
    ]);
    try {
      // Call the backend API to generate the response
      const url = "https://ai-assist-backend.vercel.app/api/generate";
      const data = { command };
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        },
      };
      const res = await axios.post(url, data, config);
      console.log(res);
      // Use the axios.get method to fetch the response from the stream URL
      // const response = await axios.get(res.data.stream_url);
      // Add the AI's response as a message
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.stream_url,
        },
      ]);
      setLoading(false);
      setCommand("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setCommand("");
    }
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setResponse("");
  //   try {
  //     // Call the backend API to generate the response
  //     const url = "https://ai-assist-backend.vercel.app/api/generate";
  //     const data = { command };
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "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"
  //       }
  //     };
  //     const res = await axios.post(url, data, config);

  //     // // Use the axios.get method to fetch the response from the stream URL
  //     // const response = await axios.get(res.data.stream_url);
  //     setResponse(res.data.stream_url);
  //     console.log(res);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="w-500 h-500 bg-white p-20 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center">Chat with AI</h1>
      <div className="w-400 h-400 bg-gray-100 p-2 overflow-y-auto mt-4 mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-auto max-w-300 bg-${
                message.sender === "user" ? "blue-500" : "green-500"
              } text-white font-medium p-2 rounded-md m-2`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-4">
        <input
          type="text"
          value={command}
          onChange={handleChange}
          className="w-400 h-10 border border-gray-300 p-2 rounded-md"
          placeholder="Enter your command here"
        />
        <button
          type="submit"
          className="w-100 h-10 bg-blue-500 text-white font-medium p-2 rounded-md ml-4"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}

export default IndexPopup
