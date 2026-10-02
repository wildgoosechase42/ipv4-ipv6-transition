'use client';

import React, { useState } from 'react';
import {
  Terminal,
  ChevronUp,
  ChevronDown,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ListChecks,
  Lightbulb,
  Check,
  Eye,
  Circle
} from 'lucide-react';
import { EventLogItem, LabType, LabBlueprint, NetworkDevice, DeviceConnection, TopologyCheckResult } from '../types';

interface EventConsoleProps {
  logs: EventLogItem[];
  labType: LabType;
  blueprint: LabBlueprint;
  devices: NetworkDevice[];
  connections: DeviceConnection[];
  checkResult: TopologyCheckResult | null;
  simStatus: 'idle' | 'ready' | 'running' | 'paused' | 'completed' | 'error';
  onClearLogs: () => void;
  onOpenTargetTopology?: () => void;
  onCheckNetwork?: () => void;
}

export const EventConsole: React.FC<EventConsoleProps> = ({
  logs,
  labType,
  blueprint,
  devices,
  connections,
  checkResult,
  simStatus,
  onClearLogs,
  onOpenTargetTopology,
  onCheckNetwork
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'checklist' | 'hints'>('console');
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.level === filter;
  });

  const latestLog = logs[logs.length - 1];

  const getTheoryAnchor = () => {
    switch (labType) {
      case 'dual-stack':
        return '#dual-stack';
      case 'tunneling':
        return '#tunneling';
      case 'translation':
        return '#translation';
    }
  };

  // Compute live checklist completion
  const allDevicesPlaced =
    blueprint.requiredComponents.length > 0 &&
    blueprint.requiredComponents.every((req) => {
      const neededTotal = blueprint.requiredComponents
        .filter((c) => c.type === req.type)
        .reduce((sum, c) => sum + c.count, 0);
      const placed = devices.filter((d) => {
        if (req.type === 'host-dual') return d.type === 'host-dual' || (d.protocols.ipv4 && d.protocols.ipv6 && d.type.startsWith('host'));
        if (req.type === 'host-v6') return d.type === 'host-v6' || (d.type.startsWith('host') && d.protocols.ipv6);
        if (req.type === 'router') return d.type === 'router' || (d.type.startsWith('router') && d.protocols.ipv4 && d.protocols.ipv6);
        if (req.type === 'server-v4') return d.type === 'server-v4' || (d.type.startsWith('server') && d.protocols.ipv4);
        if (req.type === 'server-v6') return d.type === 'server-v6' || (d.type.startsWith('server') && d.protocols.ipv6);
        return d.type === req.type;
      }).length;
      return placed >= neededTotal;
    });

  const minRequiredConns = blueprint.targetTopology.connections.length;
  const connectionsMade = connections.length >= minRequiredConns;

  const ipv4Configured =
    devices.some((d) => d.protocols.ipv4) &&
    devices.filter((d) => d.protocols.ipv4).every((d) => !!d.ipv4 && d.ipv4.trim().length > 0);

  const ipv6Configured =
    devices.some((d) => d.protocols.ipv6) &&
    devices.filter((d) => d.protocols.ipv6).every((d) => !!d.ipv6 && d.ipv6.trim().length > 0);

  const networkChecked = checkResult !== null && checkResult.isReady;
  const simCompleted = simStatus === 'completed';

  const checklistItems = [
    {
      id: 'devices',
      label: 'Place required devices',
      completed: allDevicesPlaced,
      hint: `${devices.length}/${blueprint.targetTopology.devices.length} placed`
    },
    {
      id: 'connections',
      label: 'Connect ports with cables',
      completed: connectionsMade,
      hint: `${connections.length}/${minRequiredConns} linked`
    },
    {
      id: 'check',
      label: 'Check network topology',
      completed: networkChecked,
      hint: checkResult ? `${checkResult.passedCount}/${checkResult.totalCount} passed` : 'Pending check'
    },
    {
      id: 'simulate',
      label: 'Run simulation',
      completed: simCompleted,
      hint: simCompleted ? 'Delivered' : 'Pending'
    }
  ];

  const completedChecklistCount = checklistItems.filter((i) => i.completed).length;

  const toggleRevealHint = (index: number) => {
    setRevealedHints((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getLevelBadge = (level: EventLogItem['level']) => {
    switch (level) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold">
            <CheckCircle2 className="w-2.5 h-2.5" />
            SUCCESS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[9px] font-bold">
            <AlertTriangle className="w-2.5 h-2.5" />
            WARNING
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-red-950/60 border border-red-500/40 text-red-400 text-[9px] font-bold">
            <XCircle className="w-2.5 h-2.5" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-950/60 border border-blue-500/40 text-blue-400 text-[9px] font-bold">
            <Info className="w-2.5 h-2.5" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#111113] border-t border-neutral-800 flex flex-col select-none transition-all duration-300">
      {/* Console Bar / Header Tabs */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-neutral-800/80 bg-[#141415] gap-2">
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('console');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'console' && isExpanded
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Console</span>
            {logs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-900 text-[10px] text-neutral-400">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('checklist');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'checklist' && isExpanded
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-[#30d158]" />
            <span>Checklist</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                completedChecklistCount === checklistItems.length
                  ? 'bg-emerald-950/60 text-[#30d158]'
                  : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {completedChecklistCount}/{checklistItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('hints');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hints' && isExpanded
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Challenge & Hints</span>
          </button>

          {/* Quick single-line status if collapsed */}
          {!isExpanded && latestLog && (
            <div className="hidden md:flex items-center gap-2 truncate text-[11px] font-mono text-neutral-400 ml-4 max-w-sm">
              <span className="text-neutral-600">[{latestLog.timestamp}]</span>
              <span className="truncate">{latestLog.message}</span>
            </div>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getTheoryAnchor()}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#2997ff] hover:underline"
          >
            <span>Lab Theory</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {isExpanded && activeTab === 'console' && (
            <button
              onClick={onClearLogs}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Tab Content */}
      {isExpanded && (
        <div className="p-3 bg-black/60 min-h-[170px]">
          {/* TAB 1: CONSOLE */}
          {activeTab === 'console' && (
            <div className="space-y-3">
              {/* Filter Chips */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilter(lvl)}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        filter === lvl
                          ? 'bg-neutral-800 text-white font-bold'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <span className="text-neutral-500">
                  Showing {filteredLogs.length} of {logs.length} events
                </span>
              </div>

              {/* Log Stream */}
              <div className="h-44 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 [scrollbar-width:thin]">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors border-l-2 border-transparent hover:border-neutral-700"
                  >
                    <span className="text-neutral-600 text-[10px] shrink-0 mt-0.5">
                      {log.timestamp}
                    </span>
                    <div className="shrink-0 mt-0.5">{getLevelBadge(log.level)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-200 leading-tight">{log.message}</p>
                      {log.details && (
                        <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-neutral-600">
                    No events recorded. Run a simulation to evaluate the topology.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BUILD CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Checklist ({completedChecklistCount}/{checklistItems.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-black/40 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-[#30d158] text-black font-bold'
                            : 'border border-neutral-700 bg-neutral-900 text-transparent'
                        }`}
                      >
                        {item.completed ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                      </div>
                      <span className={`font-semibold truncate ${item.completed ? 'text-white' : 'text-neutral-300'}`}>
                        {item.label}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        item.completed
                          ? 'bg-emerald-900/60 text-[#30d158]'
                          : 'bg-neutral-900 text-neutral-500'
                      }`}
                    >
                      {item.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHALLENGE & HINTS */}
          {activeTab === 'hints' && (
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs text-neutral-300 bg-black/40 border border-neutral-800 p-2.5 rounded-xl font-sans">
                {blueprint.goal}
              </div>

              {/* Progressive Hints */}
              <div className="space-y-2">

                {(blueprint.hints || [
                  'Inspect the required hardware list in the toolbox on the left.',
                  'Make sure cables connect the matching network interfaces.',
                  'Verify IP addresses in the inspector before running packet tests.'
                ]).map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        isRevealed
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          : 'bg-black/30 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-mono font-semibold text-neutral-300">
                            Hint {idx + 1}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleRevealHint(idx)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isRevealed ? 'Hide Hint' : 'Reveal Hint'}</span>
                        </button>
                      </div>

                      {isRevealed && (
                        <p className="text-xs font-sans text-neutral-200 mt-2 pl-7 leading-relaxed border-t border-amber-500/20 pt-2 animate-in fade-in duration-150">
                          {hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
