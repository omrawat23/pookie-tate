
import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const Ellipsis = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
)

export default function Component() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    const cleanedMessage = userMessage.replace(/[^\w\s]/gi, '').toLowerCase()
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setInputMessage('')
    setIsLoading(true)
    setError(null)
    
    setMessages(prev => [...prev, { content: <Ellipsis />, isUser: false, isLoading: true }])
    
    try {
      const response = await fetch('https://pookie-tate1.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: cleanedMessage }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setMessages(prev => prev.slice(0, -1).concat({ text: data.botMessage, isUser: false }))
      
      if (data.audio) {
        const blob = await fetch(`data:audio/wav;base64,${data.audio}`).then(r => r.blob())
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
          setIsPlaying(true)
        }
      }
    } catch (err) {
      setError(err.message)
      setMessages(prev => prev.slice(0, -1).concat({ 
        text: "I apologize but i can't reply to that. Could you try asking something appropriate?", 
        isUser: false,
        isError: true 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
        <div className="flex flex-col items-center p-6 border-b border-gray-800">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Andrew_Tate_on_%27Anything_Goes_With_James_English%27_in_2021.jpg/220px-Andrew_Tate_on_%27Anything_Goes_With_James_English%27_in_2021.jpg"
            alt="Taylor Swift"
            className="w-24 h-24 rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">Chat with Andrew Tate</h1>
        </div>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            {messages.map((message, index) => (
              <div key={index} 
                   className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {message.content || message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-gray-800 hover:bg-gray-700">
              <Send className="w-4 h-4" />
            </Button>
            {audioUrl && (
              <Button
                type="button"
                onClick={toggleAudio}
                className="bg-gray-800 hover:bg-gray-700"
              >
               {isPlaying ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
                ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Listen
                </>
                )}
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  )
}