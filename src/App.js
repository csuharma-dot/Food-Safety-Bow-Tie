import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// ==========================================
// 1. ADVANCED CUSTOM NODE COMPONENT
// ==========================================
const BowtieCustomNode = ({ id, data, selected }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threatInput, setThreatInput] = useState('');

  const handleAddThreat = () => {
    if (!threatInput.trim()) return;
    if (data.onAddThreatItem) {
      data.onAddThreatItem(id, threatInput.trim());
      setThreatInput('');
    }
  };

  return (
    <div style={{ 
      background: '#fff', 
      border: selected ? '2.5px solid #3498db' : `2px solid ${data.borderColor || '#bdc3c7'}`, 
      borderRadius: '6px', 
      width: data.isContainer ? '320px' : '260px', 
      fontFamily: 'sans-serif',
      boxShadow: selected ? '0 0 12px rgba(52, 152, 219, 0.7)' : '0 4px 6px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      {/* Node Header */}
      <div style={{ 
        background: data.bgColor || '#7f8c8d', 
        color: '#fff', 
        padding: '7px 10px', 
        fontWeight: 'bold', 
        fontSize: '11px',
        textAlign: 'center',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{data.typeLabel}</span>
        {data.hasMetadata && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
            style={{ background: 'rgba(255,255,255,0.3)', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '9px', padding: '1px 5px' }}
          >
            {isCollapsed ? '▼ Open' : '▲ Close'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '10px' }}>
        {data.isContainer ? (
          /* KOTAK BESAR CONTAMINATION GROUP */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input 
                type="text"
                placeholder="Add specific threat/hazard item..."
                value={threatInput}
                onChange={(e) => setThreatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddThreat()}
                style={{ flexGrow: 1, padding: '4px 6px', fontSize: '11px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' }}
              />
              <button 
                onClick={handleAddThreat}
                style={{ background: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
            
            {/* List Item Kontaminasi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '150px', overflowY: 'auto', marginTop: '4px' }}>
              {data.threatItems && data.threatItems.length > 0 ? (
                data.threatItems.map((item, index) => (
                  <div key={index} style={{ background: '#f8f9fa', borderLeft: '3px solid #e67e22', padding: '6px', fontSize: '11px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#333' }}>{index + 1}. {item}</span>
                    <button 
                      onClick={() => data.onRemoveThreatItem && data.onRemoveThreatItem(id, index)}
                      style={{ background: 'transparent', color: '#e74c3c', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ color: '#999', fontSize: '11px', textAlign: 'center', padding: '10px 0', border: '1px dashed #ddd', borderRadius: '4px' }}>
                  No contamination items listed yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* KOTAK TEKS STANDARD */
          <textarea
            value={data.label}
            onChange={(e) => data.onTextChange(id, 'label', e.target.value)}
            placeholder="Click to enter details..."
            style={{
              width: '100%',
              border: 'none',
              resize: 'none',
              fontSize: '12px',
              textAlign: 'center',
              fontFamily: 'inherit',
              outline: 'none',
              background: 'transparent'
            }}
            rows={2}
          />
        )}
      </div>

      {/* Capability & Reliability Fields */}
      {data.hasMetadata && !isCollapsed && (
        <div style={{ padding: '8px', background: '#f8f9fa', borderTop: '1px solid #e2e8f0', fontSize: '11px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#555', fontWeight: 'bold', fontSize: '10px', width: '60px' }}>Capability:</span>
                <input 
                  type="text" 
                  value={data.capabilityRate || ''} 
                  placeholder="100%"
                  onChange={(e) => data.onTextChange(id, 'capabilityRate', e.target.value)}
                  style={rateInputStyle}
                />
              </div>
              <textarea 
                value={data.capabilityCondition || ''} 
                placeholder="Conditions..."
                onChange={(e) => data.onTextChange(id, 'capabilityCondition', e.target.value)}
                style={conditionInputStyle}
                rows={1}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#555', fontWeight: 'bold', fontSize: '10px', width: '60px' }}>Reliability:</span>
                <input 
                  type="text" 
                  value={data.reliabilityRate || ''} 
                  placeholder="100%"
                  onChange={(e) => data.onTextChange(id, 'reliabilityRate', e.target.value)}
                  style={rateInputStyle}
                />
              </div>
              <textarea 
                value={data.reliabilityCondition || ''} 
                placeholder="Conditions..."
                onChange={(e) => data.onTextChange(id, 'reliabilityCondition', e.target.value)}
                style={conditionInputStyle}
                rows={1}
              />
            </div>
          </div>
        </div>
      )}

      {/* Handles */}
      <Handle type="target" id="target-left" position={Position.Left} style={{ background: '#333', top: '35%', width: '8px', height: '8px' }} />
      <Handle type="source" id="source-left" position={Position.Left} style={{ background: '#3498db', top: '65%', width: '8px', height: '8px' }} />
      <Handle type="target" id="target-right" position={Position.Right} style={{ background: '#333', top: '35%', width: '8px', height: '8px' }} />
      <Handle type="source" id="source-right" position={Position.Right} style={{ background: '#3498db', top: '65%', width: '8px', height: '8px' }} />
      <Handle type="target" id="target-bottom" position={Position.Bottom} style={{ background: '#333', left: '35%', width: '8px', height: '8px' }} />
      <Handle type="source" id="source-bottom" position={Position.Bottom} style={{ background: '#3498db', left: '65%', width: '8px', height: '8px' }} />
      <Handle type="target" id="target-top" position={Position.Top} style={{ background: '#333', left: '35%', width: '8px', height: '8px' }} />
      <Handle type="source" id="source-top" position={Position.Top} style={{ background: '#3498db', left: '65%', width: '8px', height: '8px' }} />
    </div>
  );
};

const rateInputStyle = { width: '50px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', background: '#e2e8f0', color: '#2c3e50' };
const conditionInputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px', fontSize: '10px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' };
const nodeTypes = { bowtieNode: BowtieCustomNode };

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [history, setHistory] = useState([]);
  const [tourStep, setTourStep] = useState(1); 

  // AUTOMATION WATCHER
  useEffect(() => {
    const hasContamination = nodes.some(n => n.id === 'contamination-main');
    const hasHazard = nodes.some(n => n.id === 'hazard-main');
    const hasProcessControl = nodes.some(n => n.id.startsWith('process-control'));
    const linkExists = edges.some(e => e.id === 'edge-auto-link' || e.id.startsWith('edge-p1-'));

    if (hasContamination && hasHazard && !hasProcessControl && !linkExists) {
      setEdges((eds) => eds.concat({
        id: `edge-auto-link`,
        source: 'contamination-main',
        target: 'hazard-main',
        sourceHandle: 'source-right',
        targetHandle: 'target-left',
        type: 'straight',
        style: { stroke: '#555', strokeWidth: 1.5 }
      }));
    }
  }, [nodes, edges, setEdges]);

  const handleTextChange = (nodeId, field, value) => {
    setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, [field]: value } } : node));
  };

  const handleAddThreatItem = (nodeId, newItem) => {
    saveToHistory();
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        const currentItems = node.data.threatItems || [];
        return { ...node, data: { ...node.data, threatItems: [...currentItems, newItem] } };
      }
      return node;
    }));
  };

  const handleRemoveThreatItem = (nodeId, indexToRemove) => {
    saveToHistory();
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        const filteredItems = (node.data.threatItems || []).filter((_, idx) => idx !== indexToRemove);
        return { ...node, data: { ...node.data, threatItems: filteredItems } };
      }
      return node;
    }));
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, type: 'straight', style: { stroke: '#555', strokeWidth: 1.5 } }, eds));
  }, [setEdges]);

  const onNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
  };

  const saveToHistory = () => {
    setHistory((prev) => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    setHistory((prev) => prev.slice(0, -1));
    setSelectedNodeId(null);
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    saveToHistory();
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const triggerAutoFailureMode = (activeProcess) => {
    const newId = `failure-mode-${Date.now()}`;
    const config = { typeLabel: '💥 FAILURE MODE / DEV.', bgColor: '#e74c3c', borderColor: '#c0392b', hasMetadata: false };
    
    const customX = activeProcess.position.x + 100;
    const customY = activeProcess.position.y + 180;
    
    const newNode = { id: newId, type: 'bowtieNode', data: { ...config, label: '', onTextChange: handleTextChange }, position: { x: customX, y: customY } };
    setNodes((nds) => nds.concat(newNode));
    
    setTimeout(() => {
      setEdges((eds) => eds.concat({
        id: `edge-fail-from-process-${Date.now()}`,
        source: activeProcess.id,
        target: newId,
        sourceHandle: 'source-bottom',
        targetHandle: 'target-top',
        type: 'straight',
        style: { stroke: '#e74c3c', strokeWidth: 1.5, strokeDasharray: '4,4' }
      }));
    }, 50);
  };

  const triggerAutoAdditionalControl = (activeProcess, failureNode) => {
    saveToHistory();
    const midX = (activeProcess.position.x + failureNode.position.x) / 2;
    const midY = (activeProcess.position.y + failureNode.position.y) / 2;
    const additionalControlId = `additional-control-${Date.now()}`;

    setNodes((nds) => nds.concat({
      id: additionalControlId,
      type: 'bowtieNode',
      data: { typeLabel: '⚙️ ADD. CONTROL MEASURES', label: 'Check the sieve from any breakage everyday', bgColor: '#d35400', borderColor: '#a04000', hasMetadata: true, capabilityRate: '100%', capabilityCondition: '', reliabilityRate: '90%', reliabilityCondition: '', onTextChange: handleTextChange },
      position: { x: midX, y: midY }
    }));

    setTimeout(() => {
      setEdges((eds) => {
        const verticalEdge = eds.find(e => e.source === activeProcess.id && e.target === failureNode.id);
        const filteredEdges = verticalEdge ? eds.filter(e => e.id !== verticalEdge.id) : eds;
        return filteredEdges.concat([
          { id: `edge-v1-${Date.now()}`, source: activeProcess.id, target: additionalControlId, sourceHandle: 'source-bottom', targetHandle: 'target-top', type: 'straight', style: { stroke: '#555', strokeWidth: 1.5 } },
          { id: `edge-v2-${Date.now()}`, source: additionalControlId, target: failureNode.id, sourceHandle: 'source-bottom', targetHandle: 'target-top', type: 'straight', style: { stroke: '#e74c3c', strokeWidth: 1.5, strokeDasharray: '4,4' } }
        ]);
      });
    }, 50);
  };

  const addNodeManual = (type) => {
    saveToHistory();
    
    const isHazard = type === 'hazard';
    const isContamination = type === 'contamination';
    const newId = isHazard ? 'hazard-main' : isContamination ? 'contamination-main' : `${type}-${Date.now()}`;
    
    let config = {};
    let customX = 450;
    let customY = 220;

    switch(type) {
      case 'hazard':
        config = { typeLabel: '🔥 HAZARD / TOP EVENT', bgColor: '#0066cc', borderColor: '#0052a3', hasMetadata: false };
        customX = 750; 
        customY = 200;
        if (tourStep === 2) setTourStep(3);
        break;
      case 'contamination':
        config = { 
          typeLabel: '⚠️ CONTAMINATION / THREAT GROUP', 
          bgColor: '#e67e22', 
          borderColor: '#d35400', 
          isContainer: true, 
          threatItems: [],
          onAddThreatItem: handleAddThreatItem,
          onRemoveThreatItem: handleRemoveThreatItem
        };
        customX = 100; 
        customY = 200;
        if (tourStep === 3) setTourStep(4);
        break;
      case 'process-control':
        config = { typeLabel: '🛡️ PROCESS/CONTROL MEASURES', bgColor: '#ff9f43', borderColor: '#f39c12', hasMetadata: true, capabilityRate: '100%', capabilityCondition: '', reliabilityRate: '100%', reliabilityCondition: '' };
        break;
      case 'failure-mode':
        config = { typeLabel: '💥 FAILURE MODE / DEV.', bgColor: '#e74c3c', borderColor: '#c0392b', hasMetadata: false };
        break;
      case 'root-cause':
        config = { typeLabel: '🔍 ROOT CAUSE', bgColor: '#7f8c8d', borderColor: '#555', hasMetadata: false };
        break;
      case 'additional-control':
        config = { typeLabel: '⚙️ ADD. CONTROL MEASURES', bgColor: '#d35400', borderColor: '#a04000', hasMetadata: true, capabilityRate: '100%', capabilityCondition: '', reliabilityRate: '90%', reliabilityCondition: '' };
        break;
      default:
        break;
    }

    if (type === 'failure-mode') {
      const activeProcess = nodes.find(n => n.id.startsWith('process-control'));
      if (activeProcess) {
        triggerAutoFailureMode(activeProcess);
        return;
      }
    }

    const newNode = {
      id: newId,
      type: 'bowtieNode',
      data: { ...config, label: '', onTextChange: handleTextChange },
      position: { x: customX, y: customY },
    };

    setNodes((prev) => [...prev, newNode]);
  };

  // INTERCEPT: PROCESS ON LINE
  const interceptLineWithProcess = () => {
    const contaminationNode = nodes.find(n => n.id === 'contamination-main');
    const hazardNode = nodes.find(n => n.id === 'hazard-main');
    if (!contaminationNode || !hazardNode) return alert("Silakan taruh Contamination & Hazard dulu!");

    const existingEdge = edges.find(e => e.source === 'contamination-main' && e.target === 'hazard-main');
    if (!existingEdge) return alert("Garis utama horizontal tidak ditemukan!");

    saveToHistory();
    const midX = (contaminationNode.position.x + hazardNode.position.x) / 2 + 50;
    const midY = (contaminationNode.position.y + hazardNode.position.y) / 2;
    const processId = `process-control-${Date.now()}`;
    
    setNodes((nds) => nds.concat({
      id: processId,
      type: 'bowtieNode',
      data: { typeLabel: '🛡️ PROCESS/CONTROL MEASURES', label: 'Sieve / Filtration Process', bgColor: '#ff9f43', borderColor: '#f39c12', hasMetadata: true, capabilityRate: '100%', capabilityCondition: '', reliabilityRate: '100%', reliabilityCondition: '', onTextChange: handleTextChange },
      position: { x: midX, y: midY }
    }));

    setTimeout(() => {
      setEdges((eds) => eds.filter(e => e.id !== existingEdge.id).concat([
        { id: `edge-p1-${Date.now()}`, source: 'contamination-main', target: processId, sourceHandle: 'source-right', targetHandle: 'target-left', type: 'straight', style: { stroke: '#555', strokeWidth: 1.5 } },
        { id: `edge-p2-${Date.now()}`, source: processId, target: 'hazard-main', sourceHandle: 'source-right', targetHandle: 'target-left', type: 'straight', style: { stroke: '#555', strokeWidth: 1.5 } }
      ]));
      if (tourStep === 4) setTourStep(5);
    }, 50);
  };

  // INTERCEPT: ADDITIONAL CONTROL ON LINE
  const interceptLineWithAdditionalControl = () => {
    const activeProcess = nodes.find(n => n.id.startsWith('process-control'));
    const failureNode = nodes.find(n => n.id.startsWith('failure-mode'));
    if (!activeProcess || !failureNode) return alert("Silakan buat Process dan Failure Mode dulu!");

    const verticalEdge = edges.find(e => e.source === activeProcess.id && e.target === failureNode.id);
    if (!verticalEdge) return alert("Garis vertikal langsung dari Process ke Failure tidak ditemukan!");

    triggerAutoAdditionalControl(activeProcess, failureNode);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>
      
      {/* PANDUAN FLOATING TENGAH ATAS */}
      {tourStep > 0 && (
        <div style={centeredTourContainerStyle}>
          {tourStep === 1 && (
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>🍏 Food Safety Center Tour</h2>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.4em', margin: '0 0 12px 0' }}>
                Let's initialize your hazard mitigation bowtie template step-by-step.
              </p>
              <button onClick={() => setTourStep(2)} style={modalBtnStyle}>Start Tour ➡️</button>
            </div>
          )}

          {tourStep === 2 && (
            <div style={{ borderLeft: '4px solid #0066cc', paddingLeft: '8px' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#0066cc', fontSize: '15px' }}>🎯 Step 1: Set Hazard</h2>
              <p style={{ color: '#333', fontSize: '13px', margin: '0' }}>
                Please click the blue <b>`+ Hazard`</b> button on the sidebar left menu to deploy the main top event risk.
              </p>
            </div>
          )}

          {tourStep === 3 && (
            <div style={{ borderLeft: '4px solid #e67e22', paddingLeft: '8px' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#e67e22', fontSize: '15px' }}>⚠️ Step 2: Set Contamination</h2>
              <p style={{ color: '#333', fontSize: '13px', margin: '0' }}>
                Great! Now click the orange <b>`+ Contamination`</b> button to deploy the threat group collector box.
              </p>
            </div>
          )}

          {tourStep === 4 && (
            <div style={{ borderLeft: '4px solid #ff9f43', paddingLeft: '8px' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#ff9f43', fontSize: '15px' }}>🛡️ Step 3: Set Process Control</h2>
              <p style={{ color: '#333', fontSize: '13px', margin: '0' }}>
                Anticipate this! Go to <b>Process/Control Measures</b> group inside the menu, and click <b>`⚡ Insert on Line`</b>.
              </p>
            </div>
          )}

          {tourStep === 5 && (
            <div style={{ borderLeft: '4px solid #e74c3c', paddingLeft: '8px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#e74c3c', fontSize: '15px' }}>❓ Step 4: Deviation Check</h2>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.4em', margin: '0 0 12px 0' }}>
                Do your control measure have any deviation?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    const activeProcess = nodes.find(n => n.id.startsWith('process-control'));
                    if (activeProcess) triggerAutoFailureMode(activeProcess);
                    setTourStep(6); 
                  }} 
                  style={{ ...modalBtnStyle, background: '#e74c3c', padding: '5px 10px', fontSize: '11px' }}
                >
                  Yes, it has 💥
                </button>
                <button onClick={() => setTourStep(0)} style={{ ...modalBtnStyle, background: '#7f8c8d', padding: '5px 10px', fontSize: '11px' }}>No, all clear!</button>
              </div>
            </div>
          )}

          {tourStep === 6 && (
            <div style={{ borderLeft: '4px solid #d35400', paddingLeft: '8px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#d35400', fontSize: '15px' }}>⚙️ Step 5: Additional Mitigations Check</h2>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.4em', margin: '0 0 12px 0' }}>
                Do you have any additional control measures to anticipate this deviation?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    const activeProcess = nodes.find(n => n.id.startsWith('process-control'));
                    const failureNode = nodes.find(n => n.id.startsWith('failure-mode'));
                    if (activeProcess && failureNode) triggerAutoAdditionalControl(activeProcess, failureNode);
                    setTourStep(0); 
                  }} 
                  style={{ ...modalBtnStyle, background: '#d35400', padding: '5px 10px', fontSize: '11px' }}
                >
                  Yes, insert it ⚙️
                </button>
                <button onClick={() => setTourStep(0)} style={{ ...modalBtnStyle, background: '#7f8c8d', padding: '5px 10px', fontSize: '11px' }}>No, that's enough</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEFT SIDEBAR BUILDER MENU */}
      <div style={{ 
        width: '320px', 
        background: '#2c3e50', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.15)',
        zIndex: 5,
        overflowY: 'auto'
      }}>
        <h3 style={{ color: '#fff', fontFamily: 'sans-serif', margin: '0', borderBottom: '2px solid #34495e', paddingBottom: '8px', fontSize: '12px', letterSpacing: '0.5px' }}>
          🎯 BOWTIE MENU BUILDER
        </h3>
        
        {/* CORE EVENTS */}
        <button onClick={() => addNodeManual('hazard')} style={{ ...btnStyle, background: '#0066cc' }}>+ Hazard / Top Event</button>
        <button onClick={() => addNodeManual('contamination')} style={{ ...btnStyle, background: '#e67e22' }}>+ Contamination Group</button>
        
        {/* GROUP: PROCESS / CONTROL MEASURES */}
        <div style={groupContainerStyle}>
          <div style={{ ...groupHeaderStyle, color: '#ff9f43' }}>🛡️ PROCESS / CONTROL MEASURES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => addNodeManual('process-control')} style={subBtnStyle}>＋ Deploy Standalone (Bebas)</button>
            <button onClick={interceptLineWithProcess} style={{ ...subBtnStyle, background: '#ff9f43', color: '#fff' }}>⚡ Insert on Line (Garis Utama)</button>
          </div>
        </div>

        {/* GROUP: ADDITIONAL CONTROL MEASURES */}
        <div style={groupContainerStyle}>
          <div style={{ ...groupHeaderStyle, color: '#ffbe76' }}>⚙️ ADDITIONAL CONTROL MEASURES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => addNodeManual('additional-control')} style={subBtnStyle}>＋ Deploy Standalone (Bebas)</button>
            <button onClick={interceptLineWithAdditionalControl} style={{ ...subBtnStyle, background: '#d35400', color: '#fff' }}>⚡ Insert on Line (Garis Vertikal)</button>
          </div>
        </div>

        {/* OTHERS */}
        <button onClick={() => addNodeManual('failure-mode')} style={{ ...btnStyle, background: '#e74c3c' }}>+ Failure Mode / Deviation</button>
        <button onClick={() => addNodeManual('root-cause')} style={{ ...btnStyle, background: '#7f8c8d' }}>+ Root Cause</button>
        
        {/* CANVAS ACTIONS */}
        <div style={{ borderTop: '2px solid #34495e', marginTop: '5px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ color: '#94a3b8', margin: '0 0 3px 0', fontSize: '10px', fontFamily: 'sans-serif' }}>CANVAS ACTIONS:</h4>
          <button onClick={handleUndo} disabled={history.length === 0} style={{ ...actionBtnStyle, background: '#f1c40f', color: '#2c3e50', opacity: history.length === 0 ? 0.5 : 1 }}>↩️ Undo Last Action</button>
          <button onClick={handleDeleteNode} disabled={!selectedNodeId} style={{ ...actionBtnStyle, background: '#e74c3c', color: '#fff', opacity: !selectedNodeId ? 0.5 : 1 }}>🗑️ Delete Selected Card</button>
        </div>
      </div>

      {/* RIGHT CANVAS WORKSPACE */}
      <div style={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={16} size={1} color="#cbd5e1" />
        </ReactFlow>
      </div>

    </div>
  );
}

// STYLING OBJECTS
const centeredTourContainerStyle = { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '400px', background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.18)', zIndex: 1000, fontFamily: 'sans-serif', border: '1px solid #cbd5e1' };
const modalBtnStyle = { background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' };
const btnStyle = { padding: '11px 12px', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' };
const actionBtnStyle = { padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', cursor: 'pointer' };

// NESTED BOX STYLING FOR GROUPS
const groupContainerStyle = { background: '#34495e', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #7f8c8d', display: 'flex', flexDirection: 'column', gap: '8px' };
const groupHeaderStyle = { fontSize: '10px', fontWeight: 'bold', fontFamily: 'sans-serif', letterSpacing: '0.3px' };
const subBtnStyle = { background: '#fff', color: '#2c3e50', border: 'none', padding: '8px 10px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%' };