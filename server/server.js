const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// System instruction for multi-agent response
const SYSTEM_INSTRUCTION = `You are a Multi-Agent Risk Negotiation System with three AI agents who analyze projects and reach consensus through negotiation.

OUTPUT FORMAT - You MUST use these EXACT markers:

[SCEPTIC]
List 5-7 specific risks with impact. Be direct and concrete.

[HISTORIAN]
Reference 3-4 similar projects, typical timelines, and lessons learned. Include specific examples.

[MEDIATOR]
Synthesize the above. YOU MUST propose at least 3 COMPROMISES using these exact phrases:
- "COMPROMISE: [what's reduced] to [benefit]"
- "TRADE-OFF: [what's given up] for [what's gained]"

[CHARTER]
Write a structured charter with these EXACT sections:

Project Scope & Objectives:
- 3-5 clear objectives
- What's in/out of scope

Key Risks Identified:
1. Risk Name: Description and impact
2. Risk Name: Description and impact
(List 5-7 risks)

Mitigation Strategies & Compromises:
1. COMPROMISE: [Strategy with clear trade-off explanation]
2. Strategy Name: Description
(List 5-8 items, at least 3 MUST start with "COMPROMISE:" or "TRADE-OFF:")

Timeline & Milestones:
- Milestone 1 (Week 1-2): What will be accomplished
- Milestone 2 (Week 3-4): What will be accomplished
(List 4-6 milestones with timeframes)

Success Criteria:
- Measurable outcome 1
- Measurable outcome 2
(List 4-6 criteria)

CRITICAL RULES:
1. Include ALL four markers: [SCEPTIC], [HISTORIAN], [MEDIATOR], [CHARTER]
2. In CHARTER, include ALL five subsections
3. At least 3 mitigations MUST be marked as COMPROMISE or TRADE-OFF
4. Each milestone MUST have a timeframe in parentheses
5. No preamble before [SCEPTIC], no text after [CHARTER]`;

// Parse agent response
function parseAgentResponse(text) {
  const markers = ['[SCEPTIC]', '[HISTORIAN]', '[MEDIATOR]', '[CHARTER]'];
  const keys = ['sceptic', 'historian', 'mediator', 'charter'];
  const result = {};
  
  keys.forEach(key => result[key] = '');
  
  if (!text) return result;
  
  markers.forEach((marker, i) => {
    const start = text.indexOf(marker);
    if (start === -1) return;
    
    const contentStart = start + marker.length;
    let end = text.length;
    
    // Find next marker
    for (let j = i + 1; j < markers.length; j++) {
      const nextStart = text.indexOf(markers[j], contentStart);
      if (nextStart !== -1) {
        end = nextStart;
        break;
      }
    }
    
    result[keys[i]] = text.substring(contentStart, end).trim();
  });
  
  return result;
}

// API endpoint to generate charter
app.post('/api/generate-charter', async (req, res) => {
  try {
    const { apiKey, model, projectGoal } = req.body;
    
    // Validation
    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    if (!model || !model.trim()) {
      return res.status(400).json({ error: 'Model selection is required' });
    }
    
    if (!projectGoal || !projectGoal.trim()) {
      return res.status(400).json({ error: 'Project goal is required' });
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const generativeModel = genAI.getGenerativeModel({
      model: model.trim()
    });
    
    // Create the full prompt with system instruction embedded
    const fullPrompt = `${SYSTEM_INSTRUCTION}

USER PROJECT GOAL:
${projectGoal.trim()}

Now provide your multi-agent analysis following the exact format specified above with all four sections: [SCEPTIC], [HISTORIAN], [MEDIATOR], and [CHARTER].`;
    
    // Generate content
    const result = await generativeModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('=== AI Response ===');
    console.log(text);
    console.log('=== End Response ===');
    
    if (!text) {
      return res.status(500).json({ error: 'No response from AI model' });
    }
    
    // Parse the response
    const parsed = parseAgentResponse(text);
    
    console.log('=== Parsed Results ===');
    console.log('Sceptic:', parsed.sceptic ? 'Found' : 'Missing');
    console.log('Historian:', parsed.historian ? 'Found' : 'Missing');
    console.log('Mediator:', parsed.mediator ? 'Found' : 'Missing');
    console.log('Charter:', parsed.charter ? 'Found' : 'Missing');
    
    // Check if parsing was successful
    if (!parsed.sceptic && !parsed.historian && !parsed.mediator && !parsed.charter) {
      console.error('Failed to parse any sections from response');
      return res.json({
        success: true,
        data: {
          sceptic: 'Error: Could not parse response',
          historian: 'Error: Could not parse response',
          mediator: 'Error: Could not parse response',
          charter: text // Return raw text in charter so user can see what was generated
        }
      });
    }
    
    // Return parsed results
    res.json({
      success: true,
      data: parsed
    });
    
  } catch (error) {
    console.error('Error generating charter:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate charter',
      details: error.toString()
    });
  }
});

// Endpoint to fetch available models
app.post('/api/list-models', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Fetch models directly from Google's API
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ 
          error: 'Invalid API key or failed to fetch models',
          details: errorData.error?.message || 'Unknown error'
        });
      }
      
      const data = await response.json();
      
      // Filter for models that support generateContent
      const availableModels = data.models
        .filter(model => 
          model.supportedGenerationMethods?.includes('generateContent')
        )
        .map(model => ({
          name: model.name.replace('models/', ''), // Remove 'models/' prefix
          displayName: model.displayName || model.name.replace('models/', ''),
          description: model.description || ''
        }));
      
      res.json({
        success: true,
        models: availableModels
      });
      
    } catch (fetchError) {
      console.error('Error fetching models:', fetchError);
      return res.status(500).json({ 
        error: 'Failed to fetch models from Google API',
        details: fetchError.message 
      });
    }
    
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({ 
      error: 'Failed to fetch models',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-charter`);
});
