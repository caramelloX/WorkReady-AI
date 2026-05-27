import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Copy, Archive, ArchiveRestore, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import './ScenarioManager.css';
import ScenarioForm from './ScenarioForm.jsx';
import { SCENARIOS, SCENARIO_ENRICHMENT, FACULTIES, SKILLS } from '../../data/scenarioData.js';

const TRACKS = [
  { code: 'quality_assurance',   label: 'Quality Assurance' },
  { code: 'maintenance_machine', label: 'Machine Maintenance' },
  { code: 'production_process',  label: 'Production Process' },
  { code: 'safety_compliance',   label: 'Safety & Compliance' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const STATUSES = ['active', 'draft', 'archived'];

const STORAGE_KEY = 'workready_admin_scenarios';

function mergeScenario(base, enrichment) {
  return { ...base, ...(enrichment || {}) };
}

function loadScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return SCENARIOS.map(sc => mergeScenario(sc, SCENARIO_ENRICHMENT[sc.id] || {}));
}

function saveScenarios(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

function generateId(list) {
  const nums = list.map(s => {
    const m = s.id?.match(/scenario-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  const next = Math.max(0, ...nums) + 1;
  return `scenario-${String(next).padStart(3, '0')}`;
}

function StatusChip({ status }) {
  return (
    <span className={`sm-status-chip ${status}`}>
      <span className="sm-chip-dot" />
      {status}
    </span>
  );
}

export default function ScenarioManager() {
  const [scenarios, setScenarios] = useState(loadScenarios);
  const [search, setSearch]       = useState('');
  const [filterTrack, setFilterTrack]   = useState('');
  const [filterSkill, setFilterSkill]   = useState('');
  const [filterDiff, setFilterDiff]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editTarget, setEditTarget]     = useState(null);
  const [showForm, setShowForm]         = useState(false);

  useEffect(() => { saveScenarios(scenarios); }, [scenarios]);

  /* ── derived stats ──────────────────────────────────────── */
  const stats = useMemo(() => ({
    total:    scenarios.length,
    active:   scenarios.filter(s => s.status === 'active').length,
    draft:    scenarios.filter(s => s.status === 'draft').length,
    archived: scenarios.filter(s => s.status === 'archived').length,
  }), [scenarios]);

  /* ── filtered list ──────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return scenarios.filter(sc => {
      if (q && !sc.title?.toLowerCase().includes(q) && !sc.description?.toLowerCase().includes(q)) return false;
      if (filterTrack  && sc.primaryTrack !== filterTrack) return false;
      if (filterSkill  && sc.mainSkillCode !== filterSkill) return false;
      if (filterDiff   && sc.difficulty !== filterDiff) return false;
      if (filterStatus && sc.status !== filterStatus) return false;
      return true;
    });
  }, [scenarios, search, filterTrack, filterSkill, filterDiff, filterStatus]);

  /* ── CRUD handlers ──────────────────────────────────────── */
  function handleNew() {
    setEditTarget(null);
    setShowForm(true);
  }

  function handleEdit(sc) {
    setEditTarget(sc);
    setShowForm(true);
  }

  function handleDuplicate(sc) {
    const newId = generateId(scenarios);
    const copy = {
      ...sc,
      id: newId,
      title: sc.title + ' (Copy)',
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setScenarios(prev => [copy, ...prev]);
  }

  function handleArchive(id) {
    setScenarios(prev => prev.map(sc => sc.id === id ? { ...sc, status: 'archived' } : sc));
  }

  function handleUnarchive(id) {
    setScenarios(prev => prev.map(sc => sc.id === id ? { ...sc, status: 'draft' } : sc));
  }

  function handleDelete(sc) {
    const hasAssignments = false; // future: check real assignment data
    if (hasAssignments) {
      setScenarios(prev => prev.map(s => s.id === sc.id ? { ...s, status: 'archived' } : s));
      return;
    }
    if (!window.confirm(`Delete "${sc.title}"? This cannot be undone.`)) return;
    setScenarios(prev => prev.filter(s => s.id !== sc.id));
  }

  function handleFormSave({ form }) {
    const now = new Date().toISOString().split('T')[0];
    if (editTarget) {
      setScenarios(prev => prev.map(sc =>
        sc.id === editTarget.id
          ? { ...sc, ...form, updatedAt: now }
          : sc
      ));
    } else {
      const newId = generateId(scenarios);
      const newSc = { ...form, id: newId, version: 1, createdAt: now, updatedAt: now };
      setScenarios(prev => [newSc, ...prev]);
    }
    setShowForm(false);
    setEditTarget(null);
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditTarget(null);
  }

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="sm-root">
      {/* Responsible AI notice */}
      <div className="sm-notice">
        <AlertTriangle size={15} />
        <span>
          <strong>Responsible Content Notice:</strong> Use synthetic or approved data only. Do not enter confidential factory data.
          Scenario content is for learning simulation — not a real safety instruction or production SOP.
          AI matching can only suggest — final mentor assignment must be confirmed by Admin.
        </span>
      </div>

      {/* Stats bar */}
      <div className="sm-stats-bar">
        <div className="sm-stat">
          <span className="sm-stat-value">{stats.total}</span>
          <span className="sm-stat-label">Total Scenarios</span>
        </div>
        <div className="sm-stat active">
          <span className="sm-stat-value">{stats.active}</span>
          <span className="sm-stat-label">Active</span>
        </div>
        <div className="sm-stat draft">
          <span className="sm-stat-value">{stats.draft}</span>
          <span className="sm-stat-label">Draft</span>
        </div>
        <div className="sm-stat archived">
          <span className="sm-stat-value">{stats.archived}</span>
          <span className="sm-stat-label">Archived</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sm-toolbar">
        <div className="sm-search-wrap">
          <Search size={15} />
          <input
            className="sm-search"
            placeholder="Search scenarios…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="sm-filter-select" value={filterTrack} onChange={e => setFilterTrack(e.target.value)}>
          <option value="">All tracks</option>
          {TRACKS.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
        </select>

        <select className="sm-filter-select" value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
          <option value="">All skills</option>
          {SKILLS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>

        <select className="sm-filter-select" value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
          <option value="">All difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>

        <select className="sm-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        <button className="sm-btn-new" onClick={handleNew}>
          <Plus size={15} /> New Scenario
        </button>
      </div>

      {/* Cards grid */}
      <div className="sm-grid">
        {filtered.length === 0 ? (
          <div className="sm-empty">
            <strong>No scenarios found</strong>
            {search || filterTrack || filterSkill || filterDiff || filterStatus
              ? 'Try adjusting the filters.'
              : 'Create your first scenario with the "New Scenario" button.'}
          </div>
        ) : filtered.map(sc => (
          <ScenarioCard
            key={sc.id}
            sc={sc}
            onEdit={() => handleEdit(sc)}
            onDuplicate={() => handleDuplicate(sc)}
            onArchive={() => handleArchive(sc.id)}
            onUnarchive={() => handleUnarchive(sc.id)}
            onDelete={() => handleDelete(sc)}
          />
        ))}
      </div>

      {/* Form overlay */}
      {showForm && (
        <ScenarioForm
          scenario={editTarget}
          enrichment={editTarget ? null : null}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

/* ── Scenario Card ────────────────────────────────────────── */
function ScenarioCard({ sc, onEdit, onDuplicate, onArchive, onUnarchive, onDelete }) {
  const trackLabel = TRACKS.find(t => t.code === sc.primaryTrack)?.label || sc.primaryTrack || '';
  const skillName  = SKILLS.find(s => s.code === sc.mainSkillCode)?.name || sc.mainSkillCode || '';
  const focusSubs  = sc.focusSubskills || [];
  const tasks      = sc.tasks || [];
  const status     = sc.status || 'draft';

  return (
    <div className={`sm-card${status === 'archived' ? ' archived' : ''}`}>
      <div className="sm-card-header">
        <div>
          <div className="sm-card-title">{sc.title}</div>
          <div className="sm-card-id">{sc.id}</div>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="sm-card-meta">
        {trackLabel && <span className="sm-meta-chip">{trackLabel}</span>}
        {sc.difficulty && (
          <span className={`sm-meta-chip difficulty-${sc.difficulty}`}>
            {sc.difficulty.charAt(0).toUpperCase() + sc.difficulty.slice(1)}
          </span>
        )}
        {sc.estimatedTime && <span className="sm-meta-chip secondary">{sc.estimatedTime}</span>}
        {tasks.length > 0 && <span className="sm-meta-chip secondary">{tasks.length} tasks</span>}
      </div>

      {skillName && (
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <strong style={{ color: '#374151' }}>Focus:</strong> {skillName}
        </div>
      )}

      {focusSubs.length > 0 && (
        <div className="sm-skill-row">
          {focusSubs.slice(0, 4).map((sub, i) => <span key={i} className="sm-skill-tag">{sub}</span>)}
          {focusSubs.length > 4 && <span className="sm-skill-tag">+{focusSubs.length - 4}</span>}
        </div>
      )}

      {sc.description && <p className="sm-card-desc">{sc.description}</p>}

      <div className="sm-card-actions">
        <button className="sm-action-btn edit" onClick={onEdit} title="Edit">
          <Edit2 size={13} /> Edit
        </button>
        <button className="sm-action-btn dup" onClick={onDuplicate} title="Duplicate">
          <Copy size={13} /> Duplicate
        </button>
        {status !== 'archived' ? (
          <button className="sm-action-btn archive" onClick={onArchive} title="Archive">
            <Archive size={13} /> Archive
          </button>
        ) : (
          <button className="sm-action-btn unarchive" onClick={onUnarchive} title="Unarchive">
            <ArchiveRestore size={13} /> Unarchive
          </button>
        )}
        <button className="sm-action-btn del" onClick={onDelete} title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
