import streamlit as st
import google.generativeai as genai
import re

# Page configuration
st.set_page_config(
    page_title="Autonomous Program Charter",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background-color: #0e1525;
    }
    .stApp {
        background-color: #0e1525;
    }
    h1, h2, h3, h4, h5, h6 {
        color: #e5e7eb;
    }
    .agent-card {
        background: #1a1f35;
        border: 1px solid #2d3548;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }
    .sceptic {
        border-left: 4px solid #ef4444;
    }
    .historian {
        border-left: 4px solid #3b82f6;
    }
    .mediator {
        border-left: 4px solid #10b981;
    }
    .charter-section {
        background: #1a1f35;
        border: 1px solid #2d3548;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }
    .compromise-badge {
        background: #fbbf24;
        color: #0e1525;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 700;
        margin-right: 0.5rem;
    }
    .timeline-item {
        border-left: 2px solid #667eea;
        padding-left: 1rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# System instruction
SYSTEM_INSTRUCTION = """You are a Multi-Agent Risk Negotiation System with three AI agents who analyze projects and reach consensus through negotiation.

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
5. No preamble before [SCEPTIC], no text after [CHARTER]"""

def parse_agent_response(text):
    """Parse the AI response into sections"""
    markers = ['[SCEPTIC]', '[HISTORIAN]', '[MEDIATOR]', '[CHARTER]']
    keys = ['sceptic', 'historian', 'mediator', 'charter']
    result = {key: '' for key in keys}
    
    if not text:
        return result
    
    for i, marker in enumerate(markers):
        start = text.find(marker)
        if start == -1:
            continue
        
        content_start = start + len(marker)
        end = len(text)
        
        # Find next marker
        for j in range(i + 1, len(markers)):
            next_start = text.find(markers[j], content_start)
            if next_start != -1:
                end = next_start
                break
        
        result[keys[i]] = text[content_start:end].strip()
    
    return result

def parse_charter(charter_text):
    """Parse charter into structured sections"""
    sections = {
        'scope': [],
        'risks': [],
        'mitigations': [],
        'milestones': [],
        'success': []
    }
    
    if not charter_text:
        return sections
    
    # Extract sections using regex
    scope_match = re.search(r'Project Scope & Objectives:(.*?)(?=Key Risks Identified:|$)', charter_text, re.DOTALL | re.IGNORECASE)
    risks_match = re.search(r'Key Risks Identified:(.*?)(?=Mitigation Strategies|$)', charter_text, re.DOTALL | re.IGNORECASE)
    mitigations_match = re.search(r'Mitigation Strategies[^:]*:(.*?)(?=Timeline & Milestones:|$)', charter_text, re.DOTALL | re.IGNORECASE)
    milestones_match = re.search(r'Timeline & Milestones:(.*?)(?=Success Criteria:|$)', charter_text, re.DOTALL | re.IGNORECASE)
    success_match = re.search(r'Success Criteria:(.*?)$', charter_text, re.DOTALL | re.IGNORECASE)
    
    def extract_list_items(text):
        if not text:
            return []
        items = []
        lines = text.split('\n')
        current_item = ''
        
        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                continue
            
            if re.match(r'^[-\d*•]', trimmed):
                if current_item:
                    items.append(current_item.strip())
                current_item = re.sub(r'^[-\d.*•\s]+', '', trimmed)
            elif current_item:
                current_item += ' ' + trimmed
        
        if current_item:
            items.append(current_item.strip())
        
        return items
    
    if scope_match:
        sections['scope'] = extract_list_items(scope_match.group(1))
    if risks_match:
        sections['risks'] = extract_list_items(risks_match.group(1))
    if mitigations_match:
        sections['mitigations'] = extract_list_items(mitigations_match.group(1))
    if milestones_match:
        sections['milestones'] = extract_list_items(milestones_match.group(1))
    if success_match:
        sections['success'] = extract_list_items(success_match.group(1))
    
    return sections

def is_compromise(text):
    """Check if text contains compromise keywords"""
    keywords = ['compromise', 'trade-off', 'tradeoff', 'balance', 'instead of', 
                'rather than', 'reduce', 'simplif', 'scale back', 'scale down',
                'limit', 'accept', 'given up', 'sacrifice']
    return any(keyword in text.lower() for keyword in keywords)

# Sidebar configuration
with st.sidebar:
    st.title("⚙️ Configuration")
    
    api_key = st.text_input("Google API Key", type="password", help="Get your API key from https://makersuite.google.com/app/apikey")
    
    if api_key:
        st.success("✓ API Key Configured")
        
        # Fetch available models
        try:
            genai.configure(api_key=api_key)
            models = genai.list_models()
            available_models = [m.name.replace('models/', '') for m in models if 'generateContent' in m.supported_generation_methods]
            
            if available_models:
                model = st.selectbox("Select Model", available_models, index=0)
            else:
                model = st.selectbox("Select Model", ["gemini-1.5-pro", "gemini-1.5-flash"])
        except Exception as e:
            st.error(f"Error fetching models: {str(e)}")
            model = st.selectbox("Select Model", ["gemini-1.5-pro", "gemini-1.5-flash"])
    else:
        st.warning("⚠️ Enter API Key to get started")
        model = None

# Main content
st.title("🛡️ Autonomous Program Charter")
st.markdown("### AI-Powered Multi-Agent Risk Analysis & Project Planning")

# Input section
project_goal = st.text_area(
    "Project Goal",
    placeholder="Describe your project: objectives, timeline, team size, constraints...",
    height=150
)

generate_button = st.button("🤖 Generate Charter", type="primary", disabled=not (api_key and model and project_goal))

if generate_button and api_key and model and project_goal:
    with st.spinner("🔄 Generating multi-agent analysis..."):
        try:
            # Configure Gemini
            genai.configure(api_key=api_key)
            gen_model = genai.GenerativeModel(model)
            
            # Create full prompt
            full_prompt = f"""{SYSTEM_INSTRUCTION}

USER PROJECT GOAL:
{project_goal}

Now provide your multi-agent analysis following the exact format specified above with all four sections: [SCEPTIC], [HISTORIAN], [MEDIATOR], and [CHARTER]."""
            
            # Generate content
            response = gen_model.generate_content(full_prompt)
            text = response.text
            
            # Parse response
            parsed = parse_agent_response(text)
            
            # Display agent analysis
            st.markdown("---")
            st.header("🤖 AI Agent Analysis")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown('<div class="agent-card sceptic">', unsafe_allow_html=True)
                st.subheader("⚠️ The Sceptic")
                st.markdown(parsed['sceptic'])
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="agent-card historian">', unsafe_allow_html=True)
                st.subheader("📚 The Historian")
                st.markdown(parsed['historian'])
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col3:
                st.markdown('<div class="agent-card mediator">', unsafe_allow_html=True)
                st.subheader("🤝 The Mediator")
                st.markdown(parsed['mediator'])
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Display charter
            st.markdown("---")
            st.header("📋 PROGRAM CHARTER")
            st.markdown("*Negotiated Agreement & Consensus*")
            
            charter_sections = parse_charter(parsed['charter'])
            
            # Scope
            if charter_sections['scope']:
                st.markdown('<div class="charter-section">', unsafe_allow_html=True)
                st.subheader("🎯 Project Scope & Objectives")
                for item in charter_sections['scope']:
                    st.markdown(f"→ {item}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Risks
            if charter_sections['risks']:
                st.markdown('<div class="charter-section">', unsafe_allow_html=True)
                st.subheader("⚠️ Key Risks Identified")
                for i, risk in enumerate(charter_sections['risks'], 1):
                    st.markdown(f"**{i}.** {risk}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Mitigations
            if charter_sections['mitigations']:
                st.markdown('<div class="charter-section">', unsafe_allow_html=True)
                st.subheader("✓ Mitigation Strategies & Compromises")
                for i, mitigation in enumerate(charter_sections['mitigations'], 1):
                    if is_compromise(mitigation):
                        st.markdown(f'<span class="compromise-badge">COMPROMISE</span> **{i}.** {mitigation}', unsafe_allow_html=True)
                    else:
                        st.markdown(f"**{i}.** {mitigation}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Timeline
            if charter_sections['milestones']:
                st.markdown('<div class="charter-section">', unsafe_allow_html=True)
                st.subheader("🕐 Timeline & Milestones")
                for i, milestone in enumerate(charter_sections['milestones'], 1):
                    st.markdown(f'<div class="timeline-item">**{i}.** {milestone}</div>', unsafe_allow_html=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Success Criteria
            if charter_sections['success']:
                st.markdown('<div class="charter-section">', unsafe_allow_html=True)
                st.subheader("✓ Success Criteria")
                for criterion in charter_sections['success']:
                    st.markdown(f"✓ {criterion}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            st.markdown("---")
            st.markdown("*— Generated by Multi-Agent Risk Negotiation System*")
            
        except Exception as e:
            st.error(f"Error generating charter: {str(e)}")

# Footer
st.markdown("---")
st.markdown("💡 **Tip**: Enter your Google Gemini API key in the sidebar to get started")
