import React, { useEffect, useState } from 'react';
import './App.css';

// Main App Component
const LearningAssistant = () => {


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(projectData);

        const quizzesData = await quizService.getQuizzes();
        setQuizzes(quizzesData);

        const reflectionsData = await reflectionService.getReflections();
        setReflections(reflectionsData);

        const elaborationsData = await elaborationService.getElaborations();
        setElaborations(elaborationsData);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  });

  // State for projects and learning components
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Game Analytics Platform',
      description: 'Game mechanics data analytics platform with multiple Kafka sources',
      components: [
        { id: 1, name: 'Setting up Kafka consumers in Node.js', completed: false, lastStudied: null, time: 5 },
        { id: 2, name: 'Building real-time data pipelines', completed: false, lastStudied: null, time: 10 },
        { id: 3, name: 'React dashboard component architecture', completed: false, lastStudied: null, time: 5 },
        { id: 4, name: 'Data visualization with D3 integration', completed: false, lastStudied: null, time: 15 },
      ]
    },
    {
      id: 2,
      name: 'Productivity RPG',
      description: 'React Three Fiber project with event-sourced backend that gamifies productivity',
      components: [
        { id: 1, name: 'R3F scene setup & character models', completed: false, lastStudied: null, time: 10 },
        { id: 2, name: 'Event sourcing architecture fundamentals', completed: false, lastStudied: null, time: 15 },
        { id: 3, name: 'RPG stat system & progression logic', completed: false, lastStudied: null, time: 10 },
        { id: 4, name: 'Task completion & reward mechanics', completed: false, lastStudied: null, time: 5 },
      ]
    },
    {
      id: 3,
      name: 'Spaceship Portfolio',
      description: 'Interactive personal website in React Three Fiber featuring a spaceship experience',
      components: [
        { id: 1, name: 'Spaceship interior modeling', completed: false, lastStudied: null, time: 15 },
        { id: 2, name: 'First-person camera controls', completed: false, lastStudied: null, time: 10 },
        { id: 3, name: 'Portal effects & shader basics', completed: false, lastStudied: null, time: 15 },
        { id: 4, name: 'Interactive objects & highlighting', completed: false, lastStudied: null, time: 5 },
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState(null);
  const [newComponentName, setNewComponentName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [addingProject, setAddingProject] = useState(false);
  const [addingComponent, setAddingComponent] = useState(false);
  const [activeLearningTechnique, setActiveLearningTechnique] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizAnswer, setNewQuizAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [elaborations, setElaborations] = useState([]);
  const [newElaboration, setNewElaboration] = useState('');

  // Get all components with time less than or equal to specified minutes
  const getQuickComponents = (maxTime) => {
    const quickComponents = [];

    projects.forEach(project => {
      project.components.forEach(component => {
        if (!component.completed && component.time <= maxTime) {
          quickComponents.push({
            projectId: project.id,
            projectName: project.name,
            componentId: component.id,
            componentName: component.name,
            time: component.time
          });
        }
      });
    });

    return quickComponents.sort((a, b) => a.time - b.time);
  };

  // Mark a component as completed
  const completeComponent = async (projectId, componentId) => {
    try {
      await projectService.updateComponent(projectId, componentId, {
        completed: true,
        lastStudied: new Date().toISOString()
      });

      setProjects(
        projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              components: project.components.map(component => {
                if (component.id === componentId) {
                  return {
                    ...component,
                    completed: true,
                    lastStudied: new Date().toISOString()
                  };
                }
                return component;
              })
            };
          }
          return project;
        })
      );
    } catch (error) {
      console.error('Error completing component:', error);
    }
  };


  projects.map(project => {
    if (project.id === projectId) {
      return {
        ...project,
        components: project.components.map(component => {
          if (component.id === componentId) {
            return {
              ...component,
              completed: true,
              lastStudied: new Date().toISOString()
            };
          }
          return component;
        })
      };
    }
    return project;
  })
};

// Add a new project
const addProject = () => {
  if (newProjectName.trim() === '') return;

  const newProject = {
    id: projects.length + 1,
    name: newProjectName,
    description: 'New project',
    components: []
  };

  setProjects([...projects, newProject]);
  setNewProjectName('');
  setAddingProject(false);
};

// Add a new component to a project
const addComponent = (projectId) => {
  if (newComponentName.trim() === '') return;

  setProjects(
    projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          components: [
            ...project.components,
            {
              id: project.components.length + 1,
              name: newComponentName,
              completed: false,
              lastStudied: null,
              time: 5
            }
          ]
        };
      }
      return project;
    })
  );

  setNewComponentName('');
  setAddingComponent(false);
};

// Format date to readable string
const formatDate = (dateString) => {
  if (!dateString) return 'Not started yet';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate progress percentage
const calculateProgress = () => {
  let totalComponents = 0;
  let completedComponents = 0;

  projects.forEach(project => {
    totalComponents += project.components.length;
    completedComponents += project.components.filter(c => c.completed).length;
  });

  return totalComponents === 0 ? 0 : Math.round((completedComponents / totalComponents) * 100);
};

// Create a mixed-project study session
const generateMixedSession = () => {
  const session = [];
  const projectsWithContent = projects.filter(p => p.components.length > 0);

  projectsWithContent.forEach(project => {
    const incomplete = project.components.filter(c => !c.completed);
    if (incomplete.length > 0) {
      const randomIndex = Math.floor(Math.random() * incomplete.length);
      session.push({
        projectId: project.id,
        projectName: project.name,
        componentId: incomplete[randomIndex].id,
        componentName: incomplete[randomIndex].name,
        time: incomplete[randomIndex].time
      });
    }
  });

  return session;
};

// Get components that need review based on spaced repetition
const getReviewItems = () => {
  const today = new Date();
  const reviewItems = [];
  const reviewSchedule = [1, 3, 7, 14, 30]; // days

  projects.forEach(project => {
    project.components.forEach(component => {
      if (component.lastStudied) {
        const lastStudied = new Date(component.lastStudied);
        const daysSince = Math.floor((today - lastStudied) / (1000 * 60 * 60 * 24));

        for (let i = 0; i < reviewSchedule.length; i++) {
          if (daysSince >= reviewSchedule[i] &&
            (i === reviewSchedule.length - 1 || daysSince < reviewSchedule[i + 1])) {
            reviewItems.push({
              projectId: project.id,
              projectName: project.name,
              componentId: component.id,
              componentName: component.name
            });
            break;
          }
        }
      }
    });
  });

  return reviewItems;
};

const microComponents = getQuickComponents(5);
const shortComponents = getQuickComponents(15);
const mixedSession = generateMixedSession();
const reviewItems = getReviewItems();

// Dashboard view
const renderDashboard = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-2">Project-Based Learning Assistant</h1>
    <p className="text-gray-600 mb-6">Build your skills while developing portfolio projects</p>

    {/* Progress cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Project progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Progress</h2>
        <div>
          <p className="mb-2">Projects: {projects.length}</p>
          <p className="mb-2">Components: {projects.reduce((sum, p) => sum + p.components.length, 0)}</p>
          <p className="mb-4">Completed: {projects.reduce((sum, p) => sum + p.components.filter(c => c.completed).length, 0)}</p>

          {/* Overall progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>

          {/* Individual project progress */}
          <div className="space-y-2 mt-4">
            {projects.map(project => (
              <div key={project.id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>{project.name}</span>
                  <span>
                    {project.components.filter(c => c.completed).length}/{project.components.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{
                      width: project.components.length === 0 ? '0%' :
                        `${Math.round((project.components.filter(c => c.completed).length /
                          project.components.length) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick learning options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Learning Options</h2>

        {/* 5-minute components */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">5-Minute Micro Sessions</h3>
          {microComponents.length > 0 ? (
            <ul className="space-y-2">
              {microComponents.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center">
                  <button
                    className="text-sm bg-green-100 text-green-800 p-1 rounded hover:bg-green-200 mr-2"
                    onClick={() => completeComponent(item.projectId, item.componentId)}
                  >
                    Complete
                  </button>
                  <span>{item.projectName}: {item.componentName}</span>
                  <span className="ml-auto text-gray-500 text-xs">{item.time}m</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No micro-session options available.</p>
          )}
        </div>

        {/* 15-minute components */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">15-Minute Short Sessions</h3>
          {shortComponents.length > 0 ? (
            <ul className="space-y-2">
              {shortComponents.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center">
                  <button
                    className="text-sm bg-blue-100 text-blue-800 p-1 rounded hover:bg-blue-200 mr-2"
                    onClick={() => completeComponent(item.projectId, item.componentId)}
                  >
                    Complete
                  </button>
                  <span>{item.projectName}: {item.componentName}</span>
                  <span className="ml-auto text-gray-500 text-xs">{item.time}m</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No short-session options available.</p>
          )}
        </div>
      </div>
    </div>

    {/* Navigation tabs */}
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-6">
        <button
          className={`py-2 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`py-2 font-medium ${activeTab === 'projects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`py-2 font-medium ${activeTab === 'mixed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('mixed')}
        >
          Mixed Study
        </button>
        <button
          className={`py-2 font-medium ${activeTab === 'techniques' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('techniques')}
        >
          Learning Tools
        </button>
      </div>
    </div>

    {/* Learning techniques and methods */}
    {activeTab === 'techniques' && (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Learning Techniques</h2>
          <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Based on Make it Stick</div>
        </div>

        {/* Techniques tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b">
            {['Retrieval', 'Elaboration', 'Reflection', 'Interleaving'].map(technique => (
              <button
                key={technique}
                className={`py-3 px-2 text-sm font-medium ${activeLearningTechnique === technique ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveLearningTechnique(technique)}
              >
                {technique}
              </button>
            ))}
          </div>

          {/* Technique content */}
          <div className="p-4">
            {activeLearningTechnique === 'Retrieval' && (
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Self-Quizzing</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create questions about the material you're learning. Testing yourself strengthens neural pathways and interrupts forgetting.
                  </p>

                  <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                    <h4 className="text-sm font-medium mb-2">Create New Quiz Question</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Question</label>
                        <input
                          type="text"
                          className="w-full border rounded p-2 text-sm"
                          placeholder="What is event sourcing?"
                          value={newQuizQuestion}
                          onChange={e => setNewQuizQuestion(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Answer</label>
                        <textarea
                          className="w-full border rounded p-2 text-sm"
                          placeholder="Event sourcing is a pattern where..."
                          rows="2"
                          value={newQuizAnswer}
                          onChange={e => setNewQuizAnswer(e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Related Project Component</label>
                        <select className="w-full border rounded p-2 text-sm">
                          <option value="">-- Select component --</option>
                          {projects.map(project => (
                            project.components.map(component => (
                              <option key={`${project.id}-${component.id}`} value={`${project.id}-${component.id}`}>
                                {project.name}: {component.name}
                              </option>
                            ))
                          ))}
                        </select>
                      </div>
                      <button
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        onClick={() => {
                          if (newQuizQuestion && newQuizAnswer) {
                            setQuizzes([
                              ...quizzes,
                              {
                                id: quizzes.length + 1,
                                question: newQuizQuestion,
                                answer: newQuizAnswer,
                                lastPracticed: null,
                                timesCorrect: 0,
                                timesAttempted: 0
                              }
                            ]);
                            setNewQuizQuestion('');
                            setNewQuizAnswer('');
                          }
                        }}
                      >
                        Save Question
                      </button>
                    </div>
                  </div>

                  {/* Practice section */}
                  {quizzes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Practice Retrieval</h4>
                      {currentQuiz ? (
                        <div className="border rounded-lg p-4">
                          <p className="font-medium mb-4">{currentQuiz.question}</p>
                          <div className="mb-3">
                            <button
                              className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 mr-2"
                              onClick={() => setShowAnswer(!showAnswer)}
                            >
                              {showAnswer ? 'Hide Answer' : 'Show Answer'}
                            </button>
                            <button
                              className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300"
                              onClick={() => {
                                setCurrentQuiz(null);
                                setShowAnswer(false);
                              }}
                            >
                              Next Question
                            </button>
                          </div>
                          {showAnswer && (
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm">{currentQuiz.answer}</p>
                              <div className="mt-3 flex space-x-2">
                                <button
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                  onClick={() => {
                                    setQuizzes(quizzes.map(q =>
                                      q.id === currentQuiz.id ?
                                        { ...q, lastPracticed: new Date().toISOString(), timesCorrect: q.timesCorrect + 1, timesAttempted: q.timesAttempted + 1 } : q
                                    ));
                                    setCurrentQuiz(null);
                                    setShowAnswer(false);
                                  }}
                                >
                                  Got it Right
                                </button>
                                <button
                                  className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                                  onClick={() => {
                                    setQuizzes(quizzes.map(q =>
                                      q.id === currentQuiz.id ?
                                        { ...q, lastPracticed: new Date().toISOString(), timesAttempted: q.timesAttempted + 1 } : q
                                    ));
                                    setCurrentQuiz(null);
                                    setShowAnswer(false);
                                  }}
                                >
                                  Need More Practice
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          className="bg-orange-100 text-orange-800 px-3 py-2 rounded text-sm hover:bg-orange-200"
                          onClick={() => {
                            const randomIndex = Math.floor(Math.random() * quizzes.length);
                            setCurrentQuiz(quizzes[randomIndex]);
                          }}
                        >
                          Start Quiz Session
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quiz list */}
                  {quizzes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Your Questions ({quizzes.length})</h4>
                      <div className="border rounded overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Question</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Last Practice</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Success Rate</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {quizzes.map(quiz => (
                              <tr key={quiz.id}>
                                <td className="px-3 py-2 text-sm">{quiz.question}</td>
                                <td className="px-3 py-2 text-sm text-gray-500">
                                  {quiz.lastPracticed ? formatDate(quiz.lastPracticed) : 'Not practiced'}
                                </td>
                                <td className="px-3 py-2 text-sm">
                                  {quiz.timesAttempted > 0
                                    ? `${Math.round((quiz.timesCorrect / quiz.timesAttempted) * 100)}%`
                                    : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeLearningTechnique === 'Elaboration' && (
              <div>
                <h3 className="font-medium mb-2">Elaboration</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect new material to what you already know. Explain concepts in your own words and relate them to your existing knowledge.
                </p>

                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                  <h4 className="text-sm font-medium mb-2">Create New Elaboration</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Select Component</label>
                      <select className="w-full border rounded p-2 text-sm">
                        <option value="">-- Select component --</option>
                        {projects.map(project => (
                          project.components.map(component => (
                            <option key={`${project.id}-${component.id}`} value={`${project.id}-${component.id}`}>
                              {project.name}: {component.name}
                            </option>
                          ))
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">How does this connect to what you already know?</label>
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        placeholder="This concept reminds me of..."
                        rows="3"
                        value={newElaboration}
                        onChange={e => setNewElaboration(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      onClick={() => {
                        if (newElaboration) {
                          setElaborations([
                            ...elaborations,
                            {
                              id: elaborations.length + 1,
                              text: newElaboration,
                              date: new Date().toISOString()
                            }
                          ]);
                          setNewElaboration('');
                        }
                      }}
                    >
                      Save Elaboration
                    </button>
                  </div>
                </div>

                {/* Elaborations list */}
                {elaborations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Elaborations</h4>
                    <div className="space-y-3">
                      {elaborations.map(item => (
                        <div key={item.id} className="border rounded p-3">
                          <p className="text-sm mb-1">{item.text}</p>
                          <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeLearningTechnique === 'Reflection' && (
              <div>
                <h3 className="font-medium mb-2">Reflection Journal</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take a few minutes to review what you've learned and ask yourself questions about it. This combines retrieval practice and elaboration.
                </p>

                <div className="border rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium mb-3">Today's Reflection</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">What did you learn today?</label>
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        rows="3"
                        value={userReflection}
                        onChange={e => setUserReflection(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">How does it connect to what you already know?</label>
                      <textarea className="w-full border rounded p-2 text-sm" rows="2"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">What questions do you still have?</label>
                      <textarea className="w-full border rounded p-2 text-sm" rows="2"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">How might you apply this in the future?</label>
                      <textarea className="w-full border rounded p-2 text-sm" rows="2"></textarea>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      Save Reflection
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Reflection Tips</h4>
                  <ul className="text-xs text-yellow-800 space-y-1 list-disc pl-4">
                    <li>Set aside 5-10 minutes at the end of each study session for reflection</li>
                    <li>Ask yourself what was most important or surprising about what you learned</li>
                    <li>Try to explain complex concepts in simple terms, as if teaching someone else</li>
                    <li>Connect new material to real-world applications in your projects</li>
                  </ul>
                </div>
              </div>
            )}

            {activeLearningTechnique === 'Interleaving' && (
              <div>
                <h3 className="font-medium mb-2">Interleaved Practice Scheduler</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mix up different topics or problem types during practice instead of focusing on one area at a time. This improves discrimination and identification abilities.
                </p>

                <div className="bg-white border rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium mb-3">Generated Practice Session</h4>

                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project, index) => {
                      const component = project.components[Math.floor(Math.random() * project.components.length)];
                      return (
                        <div key={project.id} className="border-l-2 border-indigo-500 pl-3">
                          <div className="font-medium text-sm">
                            Session {index + 1}: {project.name} - {component?.name || 'No component available'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Spend 10-15 minutes on this component.
                          </div>
                          <button
                            className="mt-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded hover:bg-indigo-200"
                            onClick={() => component && completeComponent(project.id, component.id)}
                          >
                            Mark Complete
                          </button>
                        </div>
                      );
                    })}

                    <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Why this works:</strong> Interleaving forces your brain to continually retrieve different
                      types of information, which strengthens memory and helps you see connections between different topics.
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Custom Interleaving Schedule</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select 2-4 components to practice in sequence. Spend 10-15 minutes on each, then switch.
                  </p>

                  <div className="space-y-2">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="flex items-center">
                        <span className="text-xs font-medium w-6">{num}.</span>
                        <select className="flex-grow border rounded p-1 text-sm">
                          <option value="">-- Select component --</option>
                          {projects.map(project => (
                            project.components.map(component => (
                              <option key={`${project.id}-${component.id}`} value={`${project.id}-${component.id}`}>
                                {project.name}: {component.name}
                              </option>
                            ))
                          ))}
                        </select>
                      </div>
                    ))}

                    <button className="mt-2 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700">
                      Create Custom Session
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!activeLearningTechnique && (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a learning technique to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning techniques reference */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-3">Learning Techniques Guide</h3>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Retrieval Practice</h4>
              <p className="text-xs text-gray-600">
                Practice retrieving newly learned material from memory through self-quizzing.
                This strengthens neural pathways and interrupts forgetting.
              </p>
            </div>

            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-green-800 mb-1">Spaced Practice</h4>
              <p className="text-xs text-gray-600">
                Leave time between practice sessions. This prevents forgetting and strengthens learning,
                even though it feels more difficult than cramming.
              </p>
            </div>

            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-purple-800 mb-1">Interleaved Practice</h4>
              <p className="text-xs text-gray-600">
                Mix up different types of problems or topics instead of focusing on one area at a time.
                This improves discrimination and long-term retention.
              </p>
            </div>

            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Elaboration</h4>
              <p className="text-xs text-gray-600">
                Find additional layers of meaning by relating material to what you already know or
                explaining it to others in your own words.
              </p>
            </div>

            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-red-800 mb-1">Generation</h4>
              <p className="text-xs text-gray-600">
                Attempt to solve a problem before being shown the solution. This makes your mind
                more receptive to learning.
              </p>
            </div>

            <div className="border-b pb-3">
              <h4 className="text-sm font-medium text-indigo-800 mb-1">Reflection</h4>
              <p className="text-xs text-gray-600">
                Take a few minutes to review what you've learned and ask yourself questions about it.
                This combines retrieval practice and elaboration.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-1">Calibration</h4>
              <p className="text-xs text-gray-600">
                Use quizzes or tests to objectively measure your knowledge, clearing away
                illusions about what you know or don't know.
              </p>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Tab content */}
    {activeTab === 'dashboard' && (
      <div>
        {/* Daily focus */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-medium mb-3">Today's Focus: Time-Boxed Learning</h3>
          <div className="flex flex-col space-y-2 mb-4">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="font-medium">Morning Coffee (5 min)</span>
              <span className="text-xs text-gray-600">Quick concept review</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="font-medium">Lunch Break (15 min)</span>
              <span className="text-xs text-gray-600">Component implementation</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="font-medium">Evening (30 min)</span>
              <span className="text-xs text-gray-600">Cross-project practice</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Optimize your learning by working directly on portfolio projects in short, focused sessions.</p>
        </div>

        {/* Review items */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Items To Review</h3>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Spaced Retrieval</span>
          </div>
          {reviewItems.length > 0 ? (
            <ul className="space-y-2">
              {reviewItems.slice(0, 5).map((item, index) => (
                <li key={index} className="flex items-center text-sm">
                  <button
                    className="bg-gray-100 hover:bg-gray-200 rounded p-1 mr-2"
                    onClick={() => completeComponent(item.projectId, item.componentId)}
                  >
                    <span className="text-gray-400">✓</span>
                  </button>
                  <span>{item.projectName}: {item.componentName}</span>
                </li>
              ))}
              {reviewItems.length > 5 && (
                <li className="text-gray-500 text-sm">{reviewItems.length - 5} more items...</li>
              )}
            </ul>
          ) : (
            <p className="text-sm">No components currently due for review.</p>
          )}
        </div>
      </div>
    )}

    {activeTab === 'projects' && (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Portfolio Projects</h2>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => setAddingProject(true)}
          >
            Add Project
          </button>
        </div>

        {/* New project form */}
        {addingProject && (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="font-medium mb-2">Add New Project</h3>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                className="border rounded p-2"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <div className="flex">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1"
                  onClick={addProject}
                >
                  Save Project
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                  onClick={() => setAddingProject(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects list */}
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div
                className="bg-gray-50 p-4 cursor-pointer"
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      {project.components.filter(c => c.completed).length}/{project.components.length} completed
                    </span>
                    <button className="text-blue-600">
                      {activeProject === project.id ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>

              {/* Project components */}
              {activeProject === project.id && (
                <div className="p-4">
                  {project.components.length > 0 ? (
                    <ul className="space-y-2 mb-3">
                      {project.components.map((component) => (
                        <li key={component.id} className="flex items-start">
                          <button
                            className="bg-gray-100 hover:bg-gray-200 rounded p-1 mr-2 mt-1"
                            onClick={() => completeComponent(project.id, component.id)}
                          >
                            <span className={component.completed ? "text-green-500" : "text-gray-400"}>✓</span>
                          </button>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p>{component.name}</p>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{component.time} min</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {component.lastStudied ? `Last worked on: ${formatDate(component.lastStudied)}` : 'Not started yet'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">No components added yet.</p>
                  )}

                  {/* Add component form */}
                  {addingComponent && activeProject === project.id ? (
                    <div className="mt-3">
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          className="border rounded p-2"
                          placeholder="Component/Feature name"
                          value={newComponentName}
                          onChange={(e) => setNewComponentName(e.target.value)}
                        />
                        <div className="flex">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1"
                            onClick={() => addComponent(project.id)}
                          >
                            Add Component
                          </button>
                          <button
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                            onClick={() => setAddingComponent(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="text-sm flex items-center text-blue-600 mt-2"
                      onClick={() => setAddingComponent(true)}
                    >
                      + Add Project Component
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'mixed' && (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cross-Project Learning</h2>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            onClick={() => setActiveTab('mixed')}
          >
            Refresh Session
          </button>
        </div>

        {mixedSession.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-4">Time-Efficient Cross-Project Practice (30 min)</h3>
            <ol className="space-y-6">
              {mixedSession.map((item, index) => (
                <li key={index} className="border-l-2 border-purple-500 pl-4">
                  <div className="font-medium mb-1">{index + 1}. {item.projectName}: {item.componentName} ({item.time} min)</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Focus on implementing this component for your portfolio project.
                  </div>
                  <button
                    className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                    onClick={() => completeComponent(item.projectId, item.componentId)}
                  >
                    Mark as Completed
                  </button>

                  {index < mixedSession.length - 1 && (
                    <div className="text-sm italic text-gray-500 mt-3">
                      Try connecting this work to {mixedSession[index + 1].componentName.toLowerCase()}
                      in your next project component.
                    </div>
                  )}
                </li>
              ))}

              <li className="border-l-2 border-purple-500 pl-4">
                <div className="font-medium mb-1">{mixedSession.length + 1}. Project Integration (5 min)</div>
                <div className="text-sm text-gray-600">
                  Consider how today's components could work together across projects.
                </div>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2 mt-1">💡</span>
                <div>
                  <p className="font-medium mb-1">Learning While Building</p>
                  <p className="text-sm">
                    This approach helps you learn through actual project implementation, making
                    your learning immediately applicable. The interleaved practice between different
                    projects strengthens your ability to transfer knowledge across domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p>You need to work on more project components first before generating a mixed session.</p>
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

export default LearningAssistant;