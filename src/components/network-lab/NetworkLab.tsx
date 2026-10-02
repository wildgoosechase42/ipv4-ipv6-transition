'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  NetworkDevice,
  DeviceConnection,
  PacketData,
  EventLogItem,
  LabType,
  DeviceType,
  SimulationEvaluation,
  TopologyCheckResult
} from './types';
import { TopBar } from './ui/TopBar';
import { Toolbox } from './ui/Toolbox';
import { NetworkCanvas } from './canvas/NetworkCanvas';
import { PacketInspector } from './ui/PacketInspector';
import { StatusBar } from './ui/StatusBar';
import { HowToBuildDrawer } from './ui/HowToBuildDrawer';
import { CompareTopologyModal } from './ui/CompareTopologyModal';
import { SimulationResultModal } from './ui/SimulationResultModal';
import { OnboardingModal } from './ui/OnboardingModal';
import { createNewDevice } from './presets/labPresets';
import { getLabBlueprint } from './blueprints/labBlueprints';
import { checkTopologyAgainstBlueprint } from './engine/topologyChecker';
import { evaluateSimulation } from './engine/simulationEngine';
import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';

interface NetworkLabProps {
  labType: LabType;
  onSelectLab?: (lab: LabType) => void;
}

export const NetworkLab: React.FC<NetworkLabProps> = ({ labType }) => {
  // Active Blueprint definition
  const blueprint = useMemo(() => getLabBlueprint(labType), [labType]);

  // Topology state (Starts empty as requested)
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [connections, setConnections] = useState<DeviceConnection[]>([]);
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});

  // Selection
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Simulation State
  const [simStatus, setSimStatus] = useState<
    'idle' | 'ready' | 'running' | 'paused' | 'completed' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready to assemble');
  const [activePacket, setActivePacket] = useState<PacketData | null>(null);
  const [inspectedPacket, setInspectedPacket] = useState<PacketData | null>(null);
  const [activeHopDeviceId, setActiveHopDeviceId] = useState<string | undefined>(undefined);
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);

  // Cached evaluation & step index
  const [evaluation, setEvaluation] = useState<SimulationEvaluation | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Validation / Check Network State
  const [checkResult, setCheckResult] = useState<TopologyCheckResult | null>(null);

  // UI Drawers & Modals
  const [howToBuildOpen, setHowToBuildOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [simResultModalOpen, setSimResultModalOpen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [logs, setLogs] = useState<EventLogItem[]>([]);

  // History for Undo/Redo
  const [history, setHistory] = useState<
    { devices: NetworkDevice[]; connections: DeviceConnection[] }[]
  >([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // Initialize onboarding check
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('dcn_lab_onboarding_seen');
    if (!hasSeenOnboarding) {
      setOnboardingOpen(true);
    }
  }, []);

  const handleDismissOnboarding = () => {
    setOnboardingOpen(false);
    localStorage.setItem('dcn_lab_onboarding_seen', 'true');
  };

  const addLog = useCallback(
    (level: EventLogItem['level'], message: string, details?: string, theoryAnchor?: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newLog: EventLogItem = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        level,
        message,
        details,
        theoryAnchor
      };
      setLogs((prev) => [...prev.slice(-40), newLog]);
    },
    []
  );

  // Push state to undo history
  const pushHistory = (newDevices: NetworkDevice[], newConnections: DeviceConnection[]) => {
    setHistory((prev) => {
      const updated = prev.slice(0, historyIdx + 1);
      return [...updated, { devices: newDevices, connections: newConnections }].slice(-25);
    });
    setHistoryIdx((prev) => prev + 1);
  };

  const handleUndo = useCallback(() => {
    if (historyIdx > 0) {
      const targetState = history[historyIdx - 1];
      setDevices(targetState.devices);
      setConnections(targetState.connections);
      setHistoryIdx(historyIdx - 1);
      addLog('INFO', 'Undo action applied');
    }
  }, [history, historyIdx, addLog]);

  const handleRedo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const targetState = history[historyIdx + 1];
      setDevices(targetState.devices);
      setConnections(targetState.connections);
      setHistoryIdx(historyIdx + 1);
      addLog('INFO', 'Redo action applied');
    }
  }, [history, historyIdx, addLog]);

  // Load Example Preset
  const handleLoadPreset = useCallback(() => {
    const preset = blueprint.targetTopology;

    // Deep clone preset
    const clonedDevices = JSON.parse(JSON.stringify(preset.devices));
    const clonedConnections = JSON.parse(JSON.stringify(preset.connections));

    setDevices(clonedDevices);
    setConnections(clonedConnections);
    pushHistory(clonedDevices, clonedConnections);

    setSelectedDeviceId(null);
    setSelectedConnectionId(null);
    setActivePacket(null);
    setActiveHopDeviceId(undefined);
    setSimStatus('ready');
    setStatusMessage('Preset topology loaded. Click "Check Network" to verify.');

    addLog(
      'INFO',
      `Loaded example topology for ${blueprint.title}`,
      'You can freely move, reconfigure, or add devices to this topology.'
    );
  }, [blueprint, addLog]);

  // Clear Canvas
  const handleClearCanvas = useCallback(() => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setDevices([]);
    setConnections([]);
    setSelectedDeviceId(null);
    setSelectedConnectionId(null);
    setActivePacket(null);
    setActiveHopDeviceId(undefined);
    setCheckResult(null);
    setSimStatus('idle');
    setStatusMessage('Canvas cleared. Drag components to begin.');
    pushHistory([], []);
    addLog('INFO', 'Topology workspace reset');
  }, [addLog]);

  // Add Device from Toolbox
  const handleAddDevice = useCallback(
    (type: DeviceType, x?: number, y?: number) => {
      const nextCount = (deviceCounts[type] || 0) + 1;
      setDeviceCounts((prev) => ({ ...prev, [type]: nextCount }));

      const posX = x !== undefined ? x : 180 + Math.random() * 120;
      const posY = y !== undefined ? y : 140 + Math.random() * 100;

      const newDev = createNewDevice(type, posX, posY, nextCount);
      const updatedDevices = [...devices, newDev];

      setDevices(updatedDevices);
      setSelectedDeviceId(newDev.id);
      setSelectedConnectionId(null);
      pushHistory(updatedDevices, connections);

      addLog('INFO', `Placed ${newDev.name} on canvas`);
    },
    [deviceCounts, devices, connections, addLog]
  );

  // Update Device Position (Drag)
  const handleUpdateDevicePosition = useCallback((id: string, x: number, y: number) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, x, y } : d))
    );
  }, []);

  // Update Device Properties (from Inspector)
  const handleUpdateDevice = useCallback(
    (updated: NetworkDevice) => {
      const newDevs = devices.map((d) => (d.id === updated.id ? updated : d));
      setDevices(newDevs);
      pushHistory(newDevs, connections);
      addLog('INFO', `Updated properties for "${updated.name}"`);
    },
    [devices, connections, addLog]
  );

  // Duplicate Device
  const handleDuplicateDevice = useCallback(
    (id: string) => {
      const original = devices.find((d) => d.id === id);
      if (!original) return;

      const nextCount = (deviceCounts[original.type] || 0) + 1;
      setDeviceCounts((prev) => ({ ...prev, [original.type]: nextCount }));

      const duplicated: NetworkDevice = {
        ...JSON.parse(JSON.stringify(original)),
        id: `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: `${original.name} (Copy)`,
        x: original.x + 30,
        y: original.y + 30
      };

      const newDevs = [...devices, duplicated];
      setDevices(newDevs);
      setSelectedDeviceId(duplicated.id);
      pushHistory(newDevs, connections);
      addLog('INFO', `Duplicated "${original.name}"`);
    },
    [devices, connections, deviceCounts, addLog]
  );

  // Delete Device
  const handleDeleteDevice = useCallback(
    (id: string) => {
      const dev = devices.find((d) => d.id === id);
      const newDevs = devices.filter((d) => d.id !== id);
      const newConns = connections.filter(
        (c) => c.sourceDeviceId !== id && c.targetDeviceId !== id
      );

      setDevices(newDevs);
      setConnections(newConns);
      setSelectedDeviceId(null);
      pushHistory(newDevs, newConns);

      if (dev) {
        addLog('WARNING', `Removed device "${dev.name}" and associated links`);
      }
    },
    [devices, connections, addLog]
  );

  // Connect Ports
  const handleConnectPorts = useCallback(
    (sourceDevId: string, sourcePortId: string, targetDevId: string, targetPortId: string) => {
      if (sourceDevId === targetDevId) return;

      const exists = connections.some(
        (c) =>
          (c.sourceDeviceId === sourceDevId &&
            c.sourcePortId === sourcePortId &&
            c.targetDeviceId === targetDevId &&
            c.targetPortId === targetPortId) ||
          (c.sourceDeviceId === targetDevId &&
            c.sourcePortId === targetPortId &&
            c.targetDeviceId === sourceDevId &&
            c.targetPortId === sourcePortId)
      );
      if (exists) return;

      const srcDev = devices.find((d) => d.id === sourceDevId);
      const dstDev = devices.find((d) => d.id === targetDevId);
      if (!srcDev || !dstDev) return;

      const srcPort = srcDev.ports.find((p) => p.id === sourcePortId);
      const dstPort = dstDev.ports.find((p) => p.id === targetPortId);
      if (!srcPort || !dstPort) return;

      let connProtocol: DeviceConnection['protocol'] = 'both';
      if (srcPort.protocol === 'ipv4' || dstPort.protocol === 'ipv4') {
        connProtocol = 'ipv4';
      }
      if (srcPort.protocol === 'ipv6' || dstPort.protocol === 'ipv6') {
        connProtocol = 'ipv6';
      }

      const newConnection: DeviceConnection = {
        id: `conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceDeviceId: sourceDevId,
        sourcePortId,
        targetDeviceId: targetDevId,
        targetPortId,
        protocol: connProtocol,
        status: 'idle'
      };

      const newConns = [...connections, newConnection];
      setConnections(newConns);
      setSelectedConnectionId(newConnection.id);
      setSelectedDeviceId(null);
      pushHistory(devices, newConns);

      addLog('INFO', `Linked "${srcDev.name}" [${srcPort.name}] ↔ "${dstDev.name}" [${dstPort.name}]`);
    },
    [devices, connections, addLog]
  );

  // Delete Connection
  const handleDeleteConnection = useCallback(
    (id: string) => {
      const newConns = connections.filter((c) => c.id !== id);
      setConnections(newConns);
      setSelectedConnectionId(null);
      pushHistory(devices, newConns);
      addLog('WARNING', 'Network cable disconnected');
    },
    [devices, connections, addLog]
  );

  // Reset Simulation State
  const handleResetSimulation = useCallback(() => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setActivePacket(null);
    setActiveHopDeviceId(undefined);
    setSimStatus('idle');
    setStatusMessage('Simulation reset. Ready to run.');
    setCurrentStepIdx(-1);
    setEvaluation(null);
    setLatencyMs(undefined);

    setDevices((prev) => prev.map((d) => ({ ...d, status: 'ready', errorMsg: undefined })));
    setConnections((prev) => prev.map((c) => ({ ...c, status: 'idle' })));

    addLog('INFO', 'Simulation state reset');
  }, [addLog]);

  // CHECK NETWORK (Validates without simulating packets)
  const handleCheckNetwork = useCallback(() => {
    const res = checkTopologyAgainstBlueprint(devices, connections, blueprint);
    setCheckResult(res);

    if (res.isReady) {
      setSimStatus('ready');
      setStatusMessage('✓ Network Ready: All components and connections match blueprint!');
      addLog(
        'SUCCESS',
        '✓ Network Topology Verified (100% Passed)',
        'Your hardware topology, connections, and addressing match the target blueprint. You can now run the simulation!'
      );
    } else {
      setStatusMessage(`⚠ Network Needs Fixes: ${res.passedCount}/${res.totalCount} Checks Passed`);
      const firstFail = res.items.find((i) => i.status === 'failed');
      addLog(
        'WARNING',
        `Network Verification: ${res.passedCount}/${res.totalCount} checks passed`,
        firstFail ? firstFail.detail : 'Click "Compare with Target" to inspect missing items.'
      );
    }
  }, [devices, connections, blueprint, addLog]);

  // Advance simulation by one step
  const executeStep = useCallback(
    (evalResult: SimulationEvaluation, stepIndex: number) => {
      if (stepIndex >= evalResult.steps.length) {
        setSimStatus('completed');
        setStatusMessage('✓ Packet delivered successfully');
        setActiveHopDeviceId(undefined);
        setSimResultModalOpen(true);
        addLog('SUCCESS', evalResult.message, `Path completed with ${evalResult.steps.length} hops.`);
        return;
      }

      const step = evalResult.steps[stepIndex];
      setCurrentStepIdx(stepIndex);
      setActiveHopDeviceId(step.deviceId);

      // Update active connection
      setConnections((prev) =>
        prev.map((c) => ({
          ...c,
          status: c.id === step.connectionId ? 'active' : 'idle'
        }))
      );

      const dev = devices.find((d) => d.id === step.deviceId);
      const posX = dev ? dev.x + 90 : 200;
      const posY = dev ? dev.y + 50 : 200;

      const updatedPacket: PacketData = {
        id: step.packetUpdate.id || 'packet',
        protocol: step.packetUpdate.protocol || 'ipv6',
        sourceIp: step.packetUpdate.sourceIp || '',
        targetIp: step.packetUpdate.targetIp || '',
        currentHopIndex: stepIndex,
        currentDeviceId: step.deviceId,
        currentDeviceName: step.packetUpdate.currentDeviceName || dev?.name || '',
        encapsulation: step.packetUpdate.encapsulation || 'none',
        translationState: step.packetUpdate.translationState || 'none',
        status: step.packetUpdate.status || 'forwarding',
        position: { x: posX, y: posY },
        activeConnectionId: step.connectionId
      };

      setActivePacket(updatedPacket);
      addLog('INFO', step.title, step.description, step.theoryNote);

      // Schedule next step
      const stepDuration = 900;
      simTimerRef.current = setTimeout(() => {
        executeStep(evalResult, stepIndex + 1);
      }, stepDuration);
    },
    [devices, addLog]
  );

  // Run Simulation
  const handleRunSimulation = useCallback(
    (testedProtocol: 'ipv4' | 'ipv6' = 'ipv6') => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);

      addLog('INFO', `Initiating ${testedProtocol.toUpperCase()} simulation pipeline...`);
      setSimStatus('running');
      setStatusMessage(`Evaluating topology for ${testedProtocol.toUpperCase()}...`);

      const evalResult = evaluateSimulation(devices, connections, {
        labType,
        selectedProtocol: testedProtocol
      });
      setEvaluation(evalResult);
      setLatencyMs(evalResult.latencyMs);

      if (!evalResult.success) {
        setSimStatus('error');
        setStatusMessage(evalResult.message);
        addLog(
          'ERROR',
          evalResult.message,
          evalResult.errorDetail?.reason
            ? `${evalResult.errorDetail.reason} How to fix: ${evalResult.errorDetail.howToFix}`
            : undefined
        );

        if (evalResult.errorDetail?.faultyDeviceId) {
          setDevices((prev) =>
            prev.map((d) =>
              d.id === evalResult.errorDetail!.faultyDeviceId
                ? { ...d, status: 'error', errorMsg: evalResult.errorDetail!.reason }
                : d
            )
          );
        }
        return;
      }

      setDevices((prev) => prev.map((d) => ({ ...d, status: 'ready', errorMsg: undefined })));
      executeStep(evalResult, 0);
    },
    [devices, connections, labType, executeStep, addLog]
  );

  // Keyboard Shortcuts (Delete, Escape, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedDeviceId) {
          handleDeleteDevice(selectedDeviceId);
        } else if (selectedConnectionId) {
          handleDeleteConnection(selectedConnectionId);
        }
      } else if (e.key === 'Escape') {
        setSelectedDeviceId(null);
        setSelectedConnectionId(null);
        setInspectedPacket(null);
        setHowToBuildOpen(false);
        setCompareModalOpen(false);
        setSimResultModalOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedDeviceId,
    selectedConnectionId,
    handleDeleteDevice,
    handleDeleteConnection,
    handleUndo,
    handleRedo
  ]);

  // Dynamic Assembly Progress
  const buildProgress = useMemo(() => {
    const hasDevices = blueprint.requiredComponents.every((req) => {
      const neededTotal = blueprint.requiredComponents
        .filter((c) => c.type === req.type)
        .reduce((sum, c) => sum + c.count, 0);
      const match = devices.filter((d) => {
        if (req.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
        if (req.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
        if (req.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
        if (req.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
        if (req.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
        return d.type === req.type;
      });
      return match.length >= neededTotal;
    });

    const hasConnections = connections.length >= blueprint.requiredComponents.length - 1;
    const isChecked = checkResult?.isReady === true;
    const isSimulated = simStatus === 'completed';

    return {
      hasDevices,
      hasConnections,
      isChecked,
      isSimulated
    };
  }, [devices, connections, checkResult, simStatus, blueprint]);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || null;
  const selectedConnection = connections.find((c) => c.id === selectedConnectionId) || null;

  return (
    <div className="w-full max-w-[1440px] mx-auto rounded-[2rem] border border-white/[0.08] bg-[#121214] shadow-2xl flex flex-col overflow-hidden relative selection:bg-[#2997ff]/25 text-white">
      {/* Top Bar Header */}
      <TopBar
        blueprint={blueprint}
        simStatus={simStatus}
        checkResult={checkResult}
        buildProgress={{
          isDevicesPlaced: buildProgress.hasDevices,
          isLinked: buildProgress.hasConnections,
          isChecked: buildProgress.isChecked,
          isSimulated: buildProgress.isSimulated
        }}
        onOpenHowToBuild={() => setHowToBuildOpen(true)}
        onCheckNetwork={handleCheckNetwork}
        onOpenCompare={() => setCompareModalOpen(true)}
        onRunSimulation={handleRunSimulation}
        onResetSimulation={handleResetSimulation}
        onLoadPreset={handleLoadPreset}
        onClearCanvas={handleClearCanvas}
      />

      {/* Main Spacious Interactive Workspace: Full-Width Canvas */}
      <div className="relative flex flex-col md:flex-row flex-1 min-h-[720px] lg:min-h-[760px] h-[760px] overflow-hidden">
        {/* Left Toolbox */}
        <Toolbox
          blueprint={blueprint}
          currentDevices={devices}
          onAddDevice={handleAddDevice}
        />

        {/* Expansive Main Canvas */}
        <main className="relative flex-1 min-w-0 h-full overflow-hidden">
          <NetworkCanvas
            devices={devices}
            connections={connections}
            selectedDeviceId={selectedDeviceId}
            selectedConnectionId={selectedConnectionId}
            activePacket={activePacket}
            activeHopDeviceId={activeHopDeviceId}
            snapToGrid={snapToGrid}
            onSelectDevice={(id) => {
              setSelectedDeviceId(id);
              setSelectedConnectionId(null);
            }}
            onSelectConnection={(id) => {
              setSelectedConnectionId(id);
              setSelectedDeviceId(null);
            }}
            onUpdateDevicePosition={handleUpdateDevicePosition}
            onConnectPorts={handleConnectPorts}
            onDeleteConnection={handleDeleteConnection}
            onDeleteDevice={handleDeleteDevice}
            onAddDeviceFromToolbox={(type, x, y) => handleAddDevice(type, x, y)}
            onPacketClick={(pkt) => setInspectedPacket(pkt)}
            onToggleSnap={() => setSnapToGrid(!snapToGrid)}
            onOpenHowToBuild={() => setHowToBuildOpen(true)}
          />

          {/* Packet Header Inspector Modal */}
          {inspectedPacket && (
            <PacketInspector
              packet={inspectedPacket}
              onClose={() => setInspectedPacket(null)}
            />
          )}

          {/* Large Assembly Guide & Target Blueprint Modal */}
          <HowToBuildDrawer
            blueprint={blueprint}
            currentDevices={devices}
            currentConnections={connections}
            isOpen={howToBuildOpen}
            onClose={() => setHowToBuildOpen(false)}
            onCheckNetwork={handleCheckNetwork}
          />

          {/* Compare with Target Diagnostic Modal */}
          <CompareTopologyModal
            blueprint={blueprint}
            currentDevices={devices}
            currentConnections={connections}
            checkResult={checkResult}
            isOpen={compareModalOpen}
            onClose={() => setCompareModalOpen(false)}
          />

          {/* Post-Simulation Educational Result Modal */}
          <SimulationResultModal
            blueprint={blueprint}
            evaluation={evaluation}
            isOpen={simResultModalOpen}
            onClose={() => setSimResultModalOpen(false)}
          />
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        deviceCount={devices.length}
        connectionCount={connections.length}
        packetCount={activePacket ? 1 : 0}
        status={simStatus}
        statusMessage={statusMessage}
        latencyMs={latencyMs}
      />

      {/* Onboarding Overlay */}
      <OnboardingModal isOpen={onboardingOpen} onClose={handleDismissOnboarding} />
    </div>
  );
};
