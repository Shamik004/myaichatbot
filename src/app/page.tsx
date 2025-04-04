"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, Upload } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

declare const pdfjsLib: any;

const API_KEY = "AIzaSyDpWRu-JUU8SpsDZ8Tj68Dp1bXTaa3ouFE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedPDFText, setParsedPDFText] = useState<string>("");
  const latestMessagesRef = useRef<Message[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    };
    document.body.appendChild(script);
  }, []);

  const sendMessage = () => {
    if (!input.trim() && !parsedPDFText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      latestMessagesRef.current = updatedMessages;
      return updatedMessages;
    });

    setInput("");
    setIsTyping(true);
  };

  useEffect(() => {
    const fetchResponse = async () => {
      if (!isTyping) return;

      try {
        const requestBody = {
          contents: latestMessagesRef.current.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
        };

        if (parsedPDFText) {
          requestBody.contents.push({
            role: "user",
            parts: [{ text: parsedPDFText }],
          });
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

        const aiMessage: Message = {
          id: Date.now() + 1,
          text: aiResponseText,
          sender: "ai",
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, aiMessage];
          latestMessagesRef.current = updatedMessages;
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setIsTyping(false);
      }
    };

    fetchResponse();
  }, [isTyping]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      parsePDF(file);
    }
  };

  const parsePDF = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setParsedPDFText(text);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Chatbot</h1>
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white">
        <CardContent className="p-4 flex flex-col space-y-4">
          <ScrollArea className="h-80 overflow-y-auto p-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} mb-2`}
              >
                <span className="text-xs text-gray-500 mb-1">
                  {msg.sender === "user" ? "User" : "AI"}
                </span>
                <div
                  className={`p-3 rounded-lg max-w-[75%] text-sm shadow-md ${
                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {uploadedFile && (
              <div className="text-sm text-gray-500 mt-2">📄 {uploadedFile.name} uploaded</div>
            )}
            {isTyping && (
              <div className="flex items-start mb-2">
                <span className="text-xs text-gray-500 mb-1">AI</span>
                <div className="p-3 rounded-lg bg-gray-200 text-gray-800 text-sm shadow-md animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Input type="file" accept="application/pdf" onChange={handleFileUpload} className="flex-1 border-gray-300" />
            <Button className="p-2 bg-blue-500 hover:bg-blue-600">
              <Upload size={20} />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 border-gray-300" onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
            <Button onClick={sendMessage} className="p-2 bg-blue-500 hover:bg-blue-600">
              <SendHorizontal size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
