import React, { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, Presentation, FileCode, Sparkles, Wand2, Eye, Download, Settings, Zap, Layers, ChevronRight, BarChart3, PieChart, TrendingUp, Layout, Maximize2, FlipHorizontal, Calendar, PlayCircle, Check, X, Loader } from 'lucide-react';

export default function CompleteGeminiConverter() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedFeatures, setSelectedFeatures] = useState(['expandable', 'charts']);
  const [showPreview, setShowPreview] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState(['#9333ea', '#c026d3']);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [processingStep, setProcessingStep] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const fileTypes = [
    { icon: FileSpreadsheet, name: 'Excel', ext: '.xlsx, .xls', color: 'from-emerald-500 to-teal-600' },
    { icon: FileText, name: 'CSV', ext: '.csv', color: 'from-blue-500 to-cyan-600' },
    { icon: FileText, name: 'PDF', ext: '.pdf', color: 'from-red-500 to-rose-600' },
    { icon: Presentation, name: 'PowerPoint', ext: '.pptx, .ppt', color: 'from-orange-500 to-amber-600' },
    { icon: FileCode, name: 'Word', ext: '.docx, .doc', color: 'from-indigo-500 to-blue-600' },
  ];

  const stylePresets = [
    { id: 'modern', name: 'Modern', gradient: 'from-violet-600 via-purple-600 to-fuchsia-600' },
    { id: 'minimal', name: 'Minimal', gradient: 'from-slate-700 via-gray-800 to-zinc-900' },
    { id: 'corporate', name: 'Corporate', gradient: 'from-blue-600 via-indigo-600 to-blue-800' },
    { id: 'vibrant', name: 'Vibrant', gradient: 'from-pink-500 via-rose-500 to-orange-500' },
  ];

  const colorPalettes = [
    { id: 'purple-fuchsia', name: 'Purple Fusion', colors: ['#9333ea', '#c026d3'], preview: 'from-purple-600 to-fuchsia-600' },
    { id: 'blue-cyan', name: 'Ocean Breeze', colors: ['#0284c7', '#06b6d4'], preview: 'from-sky-600 to-cyan-500' },
    { id: 'emerald-teal', name: 'Forest Fresh', colors: ['#059669', '#14b8a6'], preview: 'from-emerald-600 to-teal-500' },
    { id: 'orange-red', name: 'Sunset Glow', colors: ['#ea580c', '#dc2626'], preview: 'from-orange-600 to-red-600' },
    { id: 'pink-rose', name: 'Romantic Rose', colors: ['#ec4899', '#f43f5e'], preview: 'from-pink-600 to-rose-600' },
    { id: 'indigo-violet', name: 'Royal Purple', colors: ['#6366f1', '#8b5cf6'], preview: 'from-indigo-600 to-violet-600' },
    { id: 'amber-yellow', name: 'Golden Hour', colors: ['#f59e0b', '#eab308'], preview: 'from-amber-500 to-yellow-500' },
    { id: 'slate-zinc', name: 'Modern Dark', colors: ['#475569', '#52525b'], preview: 'from-slate-600 to-zinc-600' },
  ];

  const interactiveFeatures = [
    { id: 'expandable', name: 'Expandable Cards', icon: Maximize2, desc: 'Click to reveal more content' },
    { id: 'flipping', name: 'Flip Cards', icon: FlipHorizontal, desc: 'Interactive card flips' },
    { id: 'popout', name: 'Pop-out Cards', icon: Layout, desc: 'Modal overlays on click' },
    { id: 'timeline', name: 'Timeline Charts', icon: Calendar, desc: 'Chronological data flow' },
    { id: 'pie', name: 'Pie Charts', icon: PieChart, desc: 'Circular data visualization' },
    { id: 'bar', name: 'Bar Charts', icon: BarChart3, desc: 'Comparative bar graphs' },
    { id: 'line', name: 'Line Charts', icon: TrendingUp, desc: 'Trend analysis lines' },
    { id: 'animations', name: 'Scroll Animations', icon: PlayCircle, desc: 'Reveal on scroll' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Parse different file types
  const parseFile = async (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    
    try {
      if (fileType === 'csv') {
        const text = await file.text();
        return parseCSV(text);
      } else if (fileType === 'json') {
        const text = await file.text();
        return JSON.parse(text);
      } else if (fileType === 'txt') {
        return await file.text();
      } else if (fileType === 'html') {
        return await file.text();
      } else {
        // For Excel, PDF, Word - we'll extract as text
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error('File parsing error:', error);
      return file.name + ' content';
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }
    
    return data;
  };

  // Create prompt for Gemini
  const createGeminiPrompt = (fileContent) => {
    const featuresText = selectedFeatures.map(f => {
      const feature = interactiveFeatures.find(feat => feat.id === f);
      return feature ? feature.name : f;
    }).join(', ');

    return `You are an expert HTML presentation designer. Create a stunning, interactive, standalone HTML presentation based on the following data and requirements.

DATA TO CONVERT:
${typeof fileContent === 'object' ? JSON.stringify(fileContent, null, 2) : fileContent}

USER REQUIREMENTS:
${customDescription || 'Create a professional, engaging presentation that highlights key insights from the data.'}

DESIGN SPECIFICATIONS:
- Style Theme: ${selectedStyle}
- Primary Color: ${selectedColors[0]}
- Secondary Color: ${selectedColors[1]}
- Interactive Features to Include: ${featuresText}

TEMPLATE STRUCTURE TO FOLLOW:
- Use the GRC Diagnostic Report template structure as inspiration
- Include a professional header with gradient background
- Create a navigation system with buttons to switch between slides
- Each slide should have smooth animations
- Include metrics cards, charts, and visual elements
- Add expandable/collapsible sections where appropriate
- Use modern CSS with gradients and shadows
- Include a control panel (fullscreen, print, export buttons)

INTERACTIVE FEATURES IMPLEMENTATION:
${selectedFeatures.includes('expandable') ? '- Add expandable card components that toggle on click' : ''}
${selectedFeatures.includes('flipping') ? '- Create flip card animations with front/back content' : ''}
${selectedFeatures.includes('timeline') ? '- Include a visual timeline with milestones' : ''}
${selectedFeatures.includes('pie') ? '- Generate SVG pie charts for percentage data' : ''}
${selectedFeatures.includes('bar') ? '- Create bar chart visualizations for comparisons' : ''}
${selectedFeatures.includes('animations') ? '- Add scroll-triggered animations' : ''}

CRITICAL REQUIREMENTS:
1. Generate ONLY the complete HTML code (no explanations or markdown)
2. Make it fully standalone (all CSS and JavaScript inline)
3. Use the specified color palette throughout
4. Make it responsive and mobile-friendly
5. Include smooth transitions and hover effects
6. Add keyboard navigation (arrow keys for slides)
7. Ensure it's production-ready and visually stunning
8. Follow the template structure provided in the context
9. Create multiple slides/sections based on the data
10. Add interactive elements based on selected features

OUTPUT FORMAT:
Return ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>. No markdown, no explanations, just pure HTML.`;
  };

  // Call Gemini API
  const callGeminiAPI = async (prompt) => {
    if (!apiKey) {
      throw new Error('API key is required. Please set your Gemini API key first.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Extract HTML from markdown code blocks if present
    let html = generatedText;
    if (html.includes('```html')) {
      html = html.split('```html')[1].split('```')[0].trim();
    } else if (html.includes('```')) {
      html = html.split('```')[1].split('```')[0].trim();
    }
    
    return html;
  };

  // Main conversion function
  const handleConvert = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsProcessing(true);
    setShowPreview(false);
    
    try {
      // Step 1: Parse file
      setProcessingStep('Parsing file...');
      const fileContent = await parseFile(uploadedFile);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Create prompt
      setProcessingStep('Creating AI prompt...');
      const prompt = createGeminiPrompt(fileContent);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Call Gemini API
      setProcessingStep('Generating presentation with AI...');
      const html = await callGeminiAPI(prompt);

      // Step 4: Set generated HTML
      setProcessingStep('Finalizing...');
      setGeneratedHTML(html);
      await new Promise(resolve => setTimeout(resolve, 500));

      setShowPreview(true);
      setProcessingStep('Complete!');
      
    } catch (error) {
      console.error('Conversion error:', error);
      alert(`Error: ${error.message}`);
      setProcessingStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Export HTML
  const exportHTML = () => {
    if (!generatedHTML) return;
    
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile.name.split('.')[0]}-presentation.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Preview in new window
  const previewInNewWindow = () => {
    if (!generatedHTML) return;
    
    const newWindow = window.open();
    newWindow.document.write(generatedHTML);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
              Powered by Gemini AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
            Transform Data Into Visual Stories
          </h1>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your documents and watch as advanced AI converts them into stunning, interactive HTML presentations
          </p>

          <button
            onClick={() => setShowApiKeyModal(true)}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm transition-all"
          >
            {apiKey ? '✓ API Key Set' : '⚙️ Configure API Key'}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Area */}
            <div 
              className={`relative group bg-white/5 backdrop-blur-xl border-2 rounded-3xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!uploadedFile ? (
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-purple-600 to-fuchsia-600 p-6 rounded-full">
                      <Upload className="w-12 h-12" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Drop Your Files Here</h3>
                    <p className="text-sm text-slate-400">or click to browse</p>
                  </div>

                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".xlsx,.xls,.csv,.pdf,.pptx,.ppt,.docx,.doc,.txt,.json,.html"
                  />

                  <div className="grid grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
                    {fileTypes.map((type, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group/icon">
                        <div className={`bg-gradient-to-br ${type.color} p-2 rounded-lg group-hover/icon:scale-110 transition-transform`}>
                          <type.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-slate-400">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{uploadedFile.name}</h4>
                      <p className="text-xs text-slate-400">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button 
                      onClick={() => {
                        setUploadedFile(null);
                        setShowPreview(false);
                        setGeneratedHTML('');
                      }}
                      className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <button 
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-500/50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Transform to Presentation
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowDescriptionModal(true)}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    {customDescription ? 'Edit Instructions' : 'Add Custom Instructions'}
                  </button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs text-center text-slate-400">{processingStep}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Style & Color Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold">Style</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stylePresets.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        selectedStyle === style.id
                          ? 'border-white/40 bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`h-8 rounded bg-gradient-to-r ${style.gradient} mb-1`}></div>
                      <p className="text-xs font-semibold">{style.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <h3 className="text-sm font-bold">Colors</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => setSelectedColors(palette.colors)}
                      className={`p-2 rounded-lg border transition-all ${
                        selectedColors[0] === palette.colors[0]
                          ? 'border-white/40 bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`h-6 rounded bg-gradient-to-r ${palette.preview} mb-1`}></div>
                      <p className="text-xs">{palette.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Features */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <Layout className="w-5 h-5 text-fuchsia-400" />
                <h3 className="text-lg font-bold">Interactive Features</h3>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {interactiveFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                      selectedFeatures.includes(feature.id)
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        selectedFeatures.includes(feature.id)
                          ? 'bg-purple-600'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{feature.name}</h4>
                        <p className="text-xs text-slate-400">{feature.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedFeatures.includes(feature.id)
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-white/30'
                      }`}>
                        {selectedFeatures.includes(feature.id) && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">
                  {selectedFeatures.length} features selected
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold">Preview</h3>
                </div>
              </div>

              <div className="aspect-[9/16] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 overflow-hidden relative">
                {showPreview && generatedHTML ? (
                  <iframe
                    srcDoc={generatedHTML}
                    className="w-full h-full"
                    title="Preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3 p-6">
                      <Eye className="w-12 h-12 mx-auto text-slate-600" />
                      <p className="text-sm text-slate-500">
                        {isProcessing ? 'Generating preview...' : 'Upload and convert to see preview'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {showPreview && generatedHTML && (
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={previewInNewWindow}
                    className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Full Preview
                  </button>
                  <button 
                    onClick={exportHTML}
                    className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export HTML
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Configure Gemini API Key</h3>
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-
<button 
                onClick={() => setShowApiKeyModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-slate-300 mb-2">
                  To use this tool, you need a Gemini API key from Google AI Studio.
                </p>
                <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy and paste your key below</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (apiKey) {
                      setShowApiKeyModal(false);
                      alert('API key saved! You can now convert files.');
                    } else {
                      alert('Please enter an API key');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 py-3 rounded-xl font-semibold transition-all"
                >
                  Save API Key
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Your API key is stored locally in your browser and never sent to any server except Google's Gemini API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold">Custom Presentation Instructions</h3>
              </div>
              <button 
                onClick={() => setShowDescriptionModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">What do you want the AI to focus on?</label>
                <p className="text-xs text-slate-400 mb-3">
                  Describe your specific requirements, preferred structure, target audience, key points to highlight, or any special instructions for the presentation.
                </p>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Example: Create a sales presentation focusing on Q4 metrics. Highlight revenue growth and customer acquisition. Use professional tone suitable for executives. Include executive summary slide and detailed breakdown slides. Emphasize positive trends with visual charts."
                  rows={8}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {customDescription.length} characters {customDescription.length > 0 && `• ${customDescription.split(' ').length} words`}
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2 text-cyan-300">💡 Pro Tips:</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Be specific about the type of insights you want to highlight</li>
                  <li>• Mention your target audience (executives, clients, team members, etc.)</li>
                  <li>• Specify preferred tone (professional, casual, technical, storytelling)</li>
                  <li>• Request specific slide types (overview, details, comparisons, trends)</li>
                  <li>• Indicate if you want emphasis on certain data points or metrics</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDescriptionModal(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply Instructions
                </button>
                <button
                  onClick={() => {
                    setCustomDescription('');
                    setShowDescriptionModal(false);
                  }}
                  className="px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}