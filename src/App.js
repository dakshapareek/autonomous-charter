import React, { useState } from 'react';
import { Shield, Settings, FileText, Loader, AlertCircle, Bot, AlertTriangle, BookOpen, Users, CheckCircle, Clock, Target, Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper function to convert markdown to HTML
  const convertMarkdownToHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // Convert **text** to bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>')              // Convert *text* to italic
      .replace(/^#+\s+(.+)$/gm, '<strong>$1</strong>')   // Convert headers to bold
      .trim();
  };

  // Load API key from localStorage on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchModels(savedApiKey);
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = (key) => {
    if (key && key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setAvailableModels([]);
    setModel('');
    localStorage.removeItem('gemini_api_key');
  };

  // Parse charter into structured sections
  const parseCharter = (charterText) => {
    const sections = {
      scope: '',
      risks: [],
      mitigations: [],
      milestones: [],
      success: []
    };

    if (!charterText) return sections;

    // Split into major sections first
    const scopeMatch = charterText.match(/Project Scope & Objectives:([\s\S]*?)(?=Key Risks Identified:|$)/i);
    const risksMatch = charterText.match(/Key Risks Identified:([\s\S]*?)(?=Mitigation Strategies|$)/i);
    const mitigationsMatch = charterText.match(/Mitigation Strategies[^:]*:([\s\S]*?)(?=Timeline & Milestones:|$)/i);
    const milestonesMatch = charterText.match(/Timeline & Milestones:([\s\S]*?)(?=Success Criteria:|$)/i);
    const successMatch = charterText.match(/Success Criteria:([\s\S]*?)$/i);

    // Helper to extract list items
    const extractListItems = (text) => {
      if (!text) return [];
      const items = [];
      const lines = text.split('\n');
      let currentItem = '';
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        // Check if it's a new list item
        if (trimmed.match(/^[-\d*•]/)) {
          if (currentItem) {
            items.push(convertMarkdownToHtml(currentItem));
          }
          currentItem = trimmed.replace(/^[-\d.*•\s]+/, '');
        } else if (currentItem) {
          currentItem += ' ' + trimmed;
        }
      });
      
      if (currentItem) {
        items.push(convertMarkdownToHtml(currentItem));
      }
      
      return items;
    };

    // Parse scope
    if (scopeMatch) {
      sections.scope = convertMarkdownToHtml(scopeMatch[1].trim());
    }

    // Parse risks
    if (risksMatch) {
      sections.risks = extractListItems(risksMatch[1]);
    }

    // Parse mitigations
    if (mitigationsMatch) {
      sections.mitigations = extractListItems(mitigationsMatch[1]);
    }

    // Parse milestones
    if (milestonesMatch) {
      sections.milestones = extractListItems(milestonesMatch[1]);
    }

    // Parse success criteria
    if (successMatch) {
      sections.success = extractListItems(successMatch[1]);
    }

    return sections;
  };

  const fetchModels = async (key) => {
    if (!key || !key.trim()) {
      setAvailableModels([]);
      return;
    }

    setIsFetchingModels(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/list-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch models');
      }

      if (data.success && data.models) {
        setAvailableModels(data.models);
        // Auto-select first model if none selected
        if (!model && data.models.length > 0) {
          setModel(data.models[0].name);
        }
      }
    } catch (err) {
      setError('Failed to fetch models: ' + err.message);
      setAvailableModels([]);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleApiKeyChange = (e) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    saveApiKey(newKey);
    
    // Fetch models when API key is entered (debounce could be added here)
    if (newKey.trim().length > 20) { // Basic validation for API key length
      fetchModels(newKey);
    } else {
      setAvailableModels([]);
      setModel('');
    }
  };

  const handleGenerate = async () => {
    setError('');
    
    if (!apiKey.trim()) {
      setError('Please enter your Google API Key');
      return;
    }
    
    if (!model) {
      setError('Please select a model');
      return;
    }
    
    if (!projectGoal.trim()) {
      setError('Please enter a project goal');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/generate-charter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          model: model,
          projectGoal: projectGoal.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate charter');
      }

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError('Failed to generate charter: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Settings size={24} />
          <h2>Configuration</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* API Key Section */}
          <div className="auth-section">
            <h3>Google AI API Key</h3>
            {apiKey ? (
              <div className="api-key-status">
                <div className="status-indicator">
                  <CheckCircle size={16} />
                  <span>API Key Configured</span>
                </div>
                <button className="clear-key-btn" onClick={handleClearApiKey}>
                  <X size={16} />
                  <span>Clear Key</span>
                </button>
              </div>
            ) : (
              <div className="api-key-prompt">
                <AlertCircle size={20} />
                <p>Enter your Google AI API key to get started</p>
              </div>
            )}
          </div>

          {/* API Key Input */}
          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={handleApiKeyChange}
              disabled={isProcessing}
            />
            <small className="help-text">
              Get your free API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
              <br />
              Your key is stored locally in your browser.
            </small>
          </div>

          {/* Model Selection */}
          <div className="form-group">
            <label>Model {isFetchingModels && <span className="loading-text">(Loading...)</span>}</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isProcessing || isFetchingModels || availableModels.length === 0}
            >
              <option value="">
                {availableModels.length === 0 
                  ? 'Enter API key to load models...' 
                  : 'Select a model...'}
              </option>
              {availableModels.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <Shield size={40} />
          <div className="header-text">
            <h1>Autonomous Program Charter</h1>
            <p>AI-Powered Multi-Agent Risk Analysis & Project Planning</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Input Section */}
        <div className="input-card">
          <div className="input-header">
            <FileText size={20} />
            <span>Project Goal</span>
          </div>
          <textarea
            placeholder="Describe your project: objectives, timeline, team size, constraints..."
            value={projectGoal}
            onChange={(e) => setProjectGoal(e.target.value)}
            disabled={isProcessing}
          />
          <div className="button-container">
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader size={20} className="spinner" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Bot size={20} />
                  <span>Generate Charter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Agent Analysis */}
        {results && (
          <div className="agents-section">
            <div className="section-header">
              <Bot size={24} />
              <h2>AI Agent Analysis</h2>
              <span className="status-badge">✓ Complete</span>
            </div>
            <div className="agents-grid">
              {/* Sceptic */}
              <div className="agent-card sceptic">
                <div className="agent-header">
                  <AlertTriangle size={28} color="#ef4444" />
                  <h3 className="agent-title">The Sceptic</h3>
                </div>
                <div className="agent-content">
                  {results.sceptic.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(line) }} />
                  ))}
                </div>
              </div>

              {/* Historian */}
              <div className="agent-card historian">
                <div className="agent-header">
                  <BookOpen size={28} color="#3b82f6" />
                  <h3 className="agent-title">The Historian</h3>
                </div>
                <div className="agent-content">
                  {results.historian.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(line) }} />
                  ))}
                </div>
              </div>

              {/* Mediator */}
              <div className="agent-card mediator">
                <div className="agent-header">
                  <Users size={28} color="#10b981" />
                  <h3 className="agent-title">The Mediator</h3>
                </div>
                <div className="agent-content">
                  {results.mediator.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(line) }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charter Document */}
        {results && results.charter && (() => {
          const parsed = parseCharter(results.charter);
          return (
            <>
              <div className="charter-card">
                <div className="charter-header">
                  <Shield size={32} />
                  <div>
                    <h2 className="charter-title">PROGRAM CHARTER</h2>
                    <p className="charter-subtitle">Negotiated Agreement & Consensus</p>
                  </div>
                </div>

                {/* Scope Section */}
                {parsed.scope && (
                  <div className="charter-section">
                    <div className="section-title">
                      <Target size={20} />
                      <h3>Project Scope & Objectives</h3>
                    </div>
                    <p className="section-content" dangerouslySetInnerHTML={{ __html: parsed.scope }} />
                  </div>
                )}

                {/* Risks Section */}
                {parsed.risks.length > 0 && (
                  <div className="charter-section">
                    <div className="section-title">
                      <AlertTriangle size={20} />
                      <h3>Key Risks Identified</h3>
                    </div>
                    <ul className="risk-list">
                      {parsed.risks.map((risk, i) => (
                        <li key={i}>
                          <span className="risk-marker">⚠</span>
                          <span dangerouslySetInnerHTML={{ __html: risk }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mitigations Section */}
                {parsed.mitigations.length > 0 && (
                  <div className="charter-section">
                    <div className="section-title">
                      <CheckCircle size={20} />
                      <h3>Mitigation Strategies & Compromises</h3>
                    </div>
                    <ul className="mitigation-list">
                      {parsed.mitigations.map((mitigation, i) => {
                        const lowerMitigation = mitigation.toLowerCase();
                        const isCompromise = lowerMitigation.includes('compromise') || 
                                           lowerMitigation.includes('trade-off') ||
                                           lowerMitigation.includes('tradeoff') ||
                                           lowerMitigation.includes('balance') ||
                                           lowerMitigation.includes('instead of') ||
                                           lowerMitigation.includes('rather than') ||
                                           lowerMitigation.includes('reduce') ||
                                           lowerMitigation.includes('simplif') ||
                                           lowerMitigation.includes('scale back') ||
                                           lowerMitigation.includes('scale down') ||
                                           lowerMitigation.includes('limit') ||
                                           lowerMitigation.includes('accept') ||
                                           lowerMitigation.includes('given up') ||
                                           lowerMitigation.includes('sacrifice');
                        return (
                          <li key={i} className={isCompromise ? 'compromise' : ''}>
                            {isCompromise && <span className="compromise-badge">COMPROMISE</span>}
                            <span className="mitigation-marker">✓</span>
                            <span dangerouslySetInnerHTML={{ __html: mitigation }} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Timeline Section */}
                {parsed.milestones.length > 0 && (
                  <div className="charter-section">
                    <div className="section-title">
                      <Clock size={20} />
                      <h3>Timeline & Milestones</h3>
                    </div>
                    <div className="timeline">
                      {parsed.milestones.map((milestone, i) => (
                        <div key={i} className="timeline-item">
                          <div className="timeline-marker">{i + 1}</div>
                          <div className="timeline-content" dangerouslySetInnerHTML={{ __html: milestone }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Criteria Section */}
                {parsed.success.length > 0 && (
                  <div className="charter-section">
                    <div className="section-title">
                      <CheckCircle size={20} />
                      <h3>Success Criteria</h3>
                    </div>
                    <ul className="success-list">
                      {parsed.success.map((criterion, i) => (
                        <li key={i}>
                          <span className="success-marker">✓</span>
                          <span dangerouslySetInnerHTML={{ __html: criterion }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="charter-footer">
                  — Generated by Multi-Agent Risk Negotiation System
                </div>
              </div>
            </>
          );
        })()}

        {/* Placeholder when no results */}
        {!results && !isProcessing && (
          <div className="agents-section">
            <div className="section-header">
              <Bot size={24} />
              <h2>AI Agent Analysis</h2>
            </div>
            <div className="agents-grid">
              <div className="agent-card sceptic">
                <div className="agent-header">
                  <AlertTriangle size={28} color="#ef4444" />
                  <h3 className="agent-title">The Sceptic</h3>
                </div>
                <div className="placeholder">
                  Identifies risks, blockers, and critical objections.
                  <br /><br />
                  <em>Awaiting project goal input...</em>
                </div>
              </div>

              <div className="agent-card historian">
                <div className="agent-header">
                  <BookOpen size={28} color="#3b82f6" />
                  <h3 className="agent-title">The Historian</h3>
                </div>
                <div className="placeholder">
                  References similar projects and lessons learned.
                  <br /><br />
                  <em>Awaiting project goal input...</em>
                </div>
              </div>

              <div className="agent-card mediator">
                <div className="agent-header">
                  <Users size={28} color="#10b981" />
                  <h3 className="agent-title">The Mediator</h3>
                </div>
                <div className="placeholder">
                  Synthesizes balanced, negotiated plans.
                  <br /><br />
                  <em>Awaiting project goal input...</em>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
