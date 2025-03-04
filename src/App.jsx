import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Brain, Lightbulb, CheckCircle, Plus, X, Edit, Save } from 'lucide-react';

// Main App Component
const LearningAssistant = () => {
  // State for topics, chunks, and study sessions
  const [topics, setTopics] = useState([
    { 
      id: 1, 
      name: 'React Fundamentals', 
      chunks: [
        { id: 1, name: 'Core Concepts: JSX, components, props', completed: false, lastStudied: null },
        { id: 2, name: 'Component Lifecycle', completed: false, lastStudied: null },
        { id: 3, name: 'State Management', completed: false, lastStudied: null },
        { id: 4, name: 'Side Effects & useEffect', completed: false, lastStudied: null },
        { id: 5, name: 'React Hooks', completed: false, lastStudied: null },
        { id: 6, name: 'Event Handling', completed: false, lastStudied: null },
        { id: 7, name: 'Forms', completed: false, lastStudied: null },
        { id: 8, name: 'Component Composition', completed: false, lastStudied: null },
      ]
    },
    { 
      id: 2, 
      name: 'React Three Fiber', 
      chunks: [
        { id: 1, name: 'Canvas Setup', completed: false, lastStudied: null },
        { id: 2, name: 'Basic Shapes', completed: false, lastStudied: null },
        { id: 3, name: 'Materials & Textures', completed: false, lastStudied: null },
        { id: 4, name: 'Lighting', completed: false, lastStudied: null },
        { id: 5, name: 'Animations', completed: false, lastStudied: null },
        { id: 6, name: 'Interactions', completed: false, lastStudied: null },
        { id: 7, name: 'Performance Optimization', completed: false, lastStudied: null },
        { id: 8, name: 'Camera Controls', completed: false, lastStudied: null },
      ]
    },
    { 
      id: 3, 
      name: 'System Design', 
      chunks: [
        { id: 1, name: 'Event-Driven Basics', completed: false, lastStudied: null },
        { id: 2, name: 'Message Brokers', completed: false, lastStudied: null },
        { id: 3, name: 'Consistency Models', completed: false, lastStudied: null },
        { id: 4, name: 'Distributed Data', completed: false, lastStudied: null },
        { id: 5, name: 'Fault Tolerance', completed: false, lastStudied: null },
        { id: 6, name: 'Scaling Patterns', completed: false, lastStudied: null },
        { id: 7, name: 'Latency Management', completed: false, lastStudied: null },
        { id: 8, name: 'Communication Patterns', completed: false, lastStudied: null },
      ]
    },
    { 
      id: 4, 
      name: 'Godot & Game Mechanics', 
      chunks: [
        { id: 1, name: 'Godot Basics', completed: false, lastStudied: null },
        { id: 2, name: '2D vs 3D', completed: false, lastStudied: null },
        { id: 3, name: 'Input Handling', completed: false, lastStudied: null },
        { id: 4, name: 'Physics Systems', completed: false, lastStudied: null },
        { id: 5, name: 'Game Loop', completed: false, lastStudied: null },
        { id: 6, name: 'Resource Management', completed: false, lastStudied: null },
        { id: 7, name: 'Core Mechanics Design', completed: false, lastStudied: null },
        { id: 8, name: 'Player Progression', completed: false, lastStudied: null },
      ]
    }
  ]);

  const [studySessions, setStudySessions] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTopic, setActiveTopic] = useState(null);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newChunkName, setNewChunkName] = useState("");
  const [isAddingChunk, setIsAddingChunk] = useState(false);
  const [reviewTopics, setReviewTopics] = useState([]);

  // Generate study sessions based on spaced repetition schedule
  useEffect(() => {
    generateStudySessions();
  }, [topics]);

  useEffect(() => {
    // Calculate topics due for review based on spaced repetition schedule
    const today = new Date();
    const dueForReview = [];

    topics.forEach(topic => {
      topic.chunks.forEach(chunk => {
        if (chunk.lastStudied) {
          const daysSinceStudy = Math.floor((today - new Date(chunk.lastStudied)) / (1000 * 60 * 60 * 24));
          const reviewSchedule = [1, 3, 7, 14, 30];
          
          // Find the closest review interval
          for (let i = 0; i < reviewSchedule.length; i++) {
            if (daysSinceStudy >= reviewSchedule[i] && 
                (i === reviewSchedule.length - 1 || daysSinceStudy < reviewSchedule[i + 1])) {
              dueForReview.push({
                topicId: topic.id, 
                topicName: topic.name,
                chunkId: chunk.id,
                chunkName: chunk.name
              });
              break;
            }
          }
        }
      });
    });

    setReviewTopics(dueForReview);
  }, [topics]);

  const generateStudySessions = () => {
    // Get today's date and reset to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create an array for the next 14 days
    const sessions = [];
    
    // Get all chunks from all topics
    const allChunks = topics.flatMap(topic => 
      topic.chunks.map(chunk => ({
        topicId: topic.id,
        topicName: topic.name,
        chunkId: chunk.id,
        chunkName: chunk.name,
        completed: chunk.completed,
        lastStudied: chunk.lastStudied
      }))
    );

    // First, schedule initial learning for chunks not yet studied
    const notStudied = allChunks.filter(chunk => !chunk.lastStudied);
    
    // Distribute not-yet-studied chunks across the first week (2-3 per day)
    const chunksPerDay = Math.max(1, Math.ceil(notStudied.length / 7));
    
    for (let i = 0; i < notStudied.length; i++) {
      const dayOffset = Math.floor(i / chunksPerDay);
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() + dayOffset);
      
      sessions.push({
        date: new Date(sessionDate),
        chunks: [notStudied[i]],
        type: 'initial'
      });
    }
    
    // Now schedule reviews based on the spaced repetition pattern
    const studied = allChunks.filter(chunk => chunk.lastStudied);
    
    studied.forEach(chunk => {
      const lastStudied = new Date(chunk.lastStudied);
      
      // Schedule according to spaced repetition intervals
      [1, 3, 7, 14, 30].forEach((interval, index) => {
        const reviewDate = new Date(lastStudied);
        reviewDate.setDate(lastStudied.getDate() + interval);
        
        // Only include if the review date is in the future
        if (reviewDate >= today) {
          sessions.push({
            date: new Date(reviewDate),
            chunks: [chunk],
            type: `review-${index + 1}`
          });
        }
      });
    });
    
    // Sort sessions by date
    sessions.sort((a, b) => a.date - b.date);
    
    // Group chunks into the same session if they're on the same day
    const groupedSessions = [];
    let currentDate = null;
    let currentSession = null;
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (!currentDate || sessionDate.getTime() !== currentDate.getTime()) {
        currentDate = sessionDate;
        currentSession = {
          date: new Date(sessionDate),
          chunks: [...session.chunks],
          types: [session.type]
        };
        groupedSessions.push(currentSession);
      } else {
        currentSession.chunks.push(...session.chunks);
        if (!currentSession.types.includes(session.type)) {
          currentSession.types.push(session.type);
        }
      }
    });
    
    setStudySessions(groupedSessions);
  };

  const markChunkAsStudied = (topicId, chunkId) => {
    setTopics(prevTopics => 
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            chunks: topic.chunks.map(chunk => {
              if (chunk.id === chunkId) {
                return {
                  ...chunk,
                  lastStudied: new Date().toISOString(),
                  completed: true
                };
              }
              return chunk;
            })
          };
        }
        return topic;
      })
    );
  };

  const addNewTopic = () => {
    if (newTopicName.trim() === "") return;
    
    const newTopic = {
      id: topics.length + 1,
      name: newTopicName,
      chunks: []
    };
    
    setTopics([...topics, newTopic]);
    setNewTopicName("");
    setIsAddingTopic(false);
  };

  const addNewChunk = (topicId) => {
    if (newChunkName.trim() === "") return;
    
    setTopics(prevTopics => 
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            chunks: [
              ...topic.chunks,
              {
                id: topic.chunks.length + 1,
                name: newChunkName,
                completed: false,
                lastStudied: null
              }
            ]
          };
        }
        return topic;
      })
    );
    
    setNewChunkName("");
    setIsAddingChunk(false);
  };

  const formatDate = (date) => {
    if (!date) return "Not studied yet";
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Interleaved practice suggestion
  const generateInterleavedSession = () => {
    const allTopics = [...topics];
    const session = [];
    
    // Try to pick one chunk from each topic
    allTopics.forEach(topic => {
      const availableChunks = topic.chunks.filter(chunk => chunk.lastStudied);
      if (availableChunks.length > 0) {
        // Pick a random chunk from this topic
        const randomIndex = Math.floor(Math.random() * availableChunks.length);
        session.push({
          topicId: topic.id,
          topicName: topic.name,
          chunkId: availableChunks[randomIndex].id,
          chunkName: availableChunks[randomIndex].name
        });
      }
    });
    
    return session;
  };

  const [interleavedSession, setInterleavedSession] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Views for the app
  const renderDashboard = () => (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Learning Assistant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Progress Overview Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Progress Overview</h2>
          </div>
          <div>
            <p className="mb-2">Topics: {topics.length}</p>
            <p className="mb-2">Total Chunks: {topics.reduce((acc, topic) => acc + topic.chunks.length, 0)}</p>
            <p className="mb-4">Completed: {topics.reduce((acc, topic) => acc + topic.chunks.filter(c => c.completed).length, 0)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.floor((topics.reduce((acc, topic) => acc + topic.chunks.filter(c => c.completed).length, 0) / 
                  topics.reduce((acc, topic) => acc + topic.chunks.length, 0)) * 100) || 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Due for Review Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Due for Review</h2>
          </div>
          {reviewTopics.length > 0 ? (
            <ul className="space-y-2">
              {reviewTopics.slice(0, 5).map((item, index) => (
                <li key={index} className="flex items-center">
                  <button 
                    className="text-sm bg-orange-100 text-orange-800 p-1 rounded hover:bg-orange-200 mr-2"
                    onClick={() => markChunkAsStudied(item.topicId, item.chunkId)}
                  >
                    Review
                  </button>
                  <span>{item.topicName}: {item.chunkName}</span>
                </li>
              ))}
              {reviewTopics.length > 5 && (
                <li className="text-gray-500 text-sm">{reviewTopics.length - 5} more items...</li>
              )}
            </ul>
          ) : (
            <p>No topics currently due for review.</p>
          )}
        </div>
      </div>
      
      {/* Tabs for Sessions/Topics */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          <button 
            className={`py-2 font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Sessions
          </button>
          <button 
            className={`py-2 font-medium ${activeTab === 'topics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('topics')}
          >
            Study Topics
          </button>
          <button 
            className={`py-2 font-medium ${activeTab === 'interleaved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setActiveTab('interleaved');
              setInterleavedSession(generateInterleavedSession());
            }}
          >
            Interleaved Practice
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Study Sessions</h2>
          <div className="space-y-4">
            {studySessions.slice(0, 7).map((session, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{formatDate(session.date)}</h3>
                  <div className="flex space-x-2">
                    {session.types.includes('initial') && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Initial Learning</span>
                    )}
                    {session.types.includes('review-1') && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">1-Day Review</span>
                    )}
                    {session.types.includes('review-2') && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">3-Day Review</span>
                    )}
                    {session.types.includes('review-3') && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">7-Day Review</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-2">
                  {session.chunks.map((chunk, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <button 
                        className="bg-gray-100 hover:bg-gray-200 rounded p-1 mr-2"
                        onClick={() => markChunkAsStudied(chunk.topicId, chunk.chunkId)}
                      >
                        <CheckCircle size={16} className={chunk.completed ? "text-green-500" : "text-gray-400"} />
                      </button>
                      <span>{chunk.topicName}: {chunk.chunkName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'topics' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Study Topics</h2>
            <button 
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => setIsAddingTopic(true)}
            >
              <Plus size={16} className="mr-1" /> Add Topic
            </button>
          </div>
          
          {isAddingTopic && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-medium mb-2">Add New Topic</h3>
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-grow border rounded p-2 mr-2" 
                  placeholder="Topic name"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                />
                <button 
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1"
                  onClick={addNewTopic}
                >
                  <Save size={16} />
                </button>
                <button 
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                  onClick={() => setIsAddingTopic(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
                >
                  <h3 className="font-medium">{topic.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      {topic.chunks.filter(c => c.completed).length}/{topic.chunks.length} completed
                    </span>
                    <button className="text-blue-600">
                      {activeTopic === topic.id ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                {activeTopic === topic.id && (
                  <div className="p-4">
                    <ul className="space-y-2 mb-3">
                      {topic.chunks.map((chunk) => (
                        <li key={chunk.id} className="flex items-start">
                          <button 
                            className="bg-gray-100 hover:bg-gray-200 rounded p-1 mr-2 mt-1"
                            onClick={() => markChunkAsStudied(topic.id, chunk.id)}
                          >
                            <CheckCircle size={16} className={chunk.completed ? "text-green-500" : "text-gray-400"} />
                          </button>
                          <div className="flex-grow">
                            <p>{chunk.name}</p>
                            <p className="text-xs text-gray-500">
                              {chunk.lastStudied ? `Last studied: ${formatDate(chunk.lastStudied)}` : 'Not studied yet'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {isAddingChunk && activeTopic === topic.id ? (
                      <div className="mt-3">
                        <div className="flex">
                          <input 
                            type="text" 
                            className="flex-grow border rounded p-2 mr-2" 
                            placeholder="Chunk name"
                            value={newChunkName}
                            onChange={(e) => setNewChunkName(e.target.value)}
                          />
                          <button 
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1"
                            onClick={() => addNewChunk(topic.id)}
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                            onClick={() => setIsAddingChunk(false)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="text-sm flex items-center text-blue-600 mt-2"
                        onClick={() => setIsAddingChunk(true)}
                      >
                        <Plus size={14} className="mr-1" /> Add Micro-Learning Chunk
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'interleaved' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Interleaved Practice Session</h2>
            <button 
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              onClick={() => setInterleavedSession(generateInterleavedSession())}
            >
              Generate New Session
            </button>
          </div>
          
          {interleavedSession.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium mb-4">Today's Mixed Practice (25-30 min)</h3>
              <ol className="space-y-6">
                {interleavedSession.map((item, index) => (
                  <li key={index} className="border-l-2 border-purple-500 pl-4">
                    <div className="font-medium mb-1">{index + 1}. {item.topicName}: {item.chunkName} (5 min)</div>
                    <div className="text-sm text-gray-600 mb-2">
                      Practice this concept through active recall or application.
                    </div>
                    <button 
                      className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                      onClick={() => markChunkAsStudied(item.topicId, item.chunkId)}
                    >
                      Mark as Practiced
                    </button>
                    
                    {index < interleavedSession.length - 1 && (
                      <div className="text-sm italic text-gray-500 mt-3">
                        Try connecting this concept to {interleavedSession[index + 1].chunkName.toLowerCase()} 
                        before moving to the next topic.
                      </div>
                    )}
                  </li>
                ))}
                
                <li className="border-l-2 border-purple-500 pl-4">
                  <div className="font-medium mb-1">{interleavedSession.length + 1}. Synthesis (5 min)</div>
                  <div className="text-sm text-gray-600">
                    Connect all concepts studied today. Try to explain how they relate to each other.
                  </div>
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <div className="flex items-start">
                  <Lightbulb className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Why This Works</p>
                    <p className="text-sm">
                      Interleaving improves long-term retention by forcing your brain to continuously retrieve 
                      different kinds of information. This strengthens neural connections and helps you 
                      identify similarities and differences between concepts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p>You need to study more topics first before generating an interleaved session.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Main component return
  return (
    <div className="min-h-screen bg-gray-100">
      {renderDashboard()}
    </div>
  );
};

export default LearningAssistant;