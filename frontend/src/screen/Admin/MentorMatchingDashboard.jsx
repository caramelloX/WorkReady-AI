import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { matchMentorForScenario } from '../../utils/scenarioMentorMatching';
import { recommendScenarioForStudent } from '../../utils/scenarioRecommendation';
import Swal from 'sweetalert2';

const STATUS_BADGE = {
  available: 'success',
  full: 'danger',
  inactive: 'neutral'
};

const MATCH_LABEL = {
  recommended: { text: 'Recommended', color: '#10B981', bg: '#ECFDF5' },
  possible:    { text: 'Possible',     color: '#F59E0B', bg: '#FFFBEB' },
  weak:        { text: 'Weak Match',   color: '#EF4444', bg: '#FEF2F2' },
  full:        { text: 'Mentor Full',  color: '#64748B', bg: '#F1F5F9' }
};

const DIFFICULTY_COLOR = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };

export default function MentorMatchingDashboard({ students, mentors, scenarios = [], onAssignmentConfirm }) {
  const { t } = useLanguage();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterTrack, setFilterTrack] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter student list
  const pendingStudents = useMemo(() => {
    let filtered = students.filter(s => s.role === 'student');
    if (filterTrack !== 'All') filtered = filtered.filter(s => s.target_track === filterTrack);
    if (searchQuery) filtered = filtered.filter(s => s.fullname?.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [students, filterTrack, searchQuery]);

  // Filter mentor list
  const filteredMentors = useMemo(() => {
    let filtered = mentors.filter(m => m.role === 'mentor');
    if (filterAvailability !== 'All') filtered = filtered.filter(m => m.availableStatus === filterAvailability.toLowerCase());
    if (searchQuery) filtered = filtered.filter(m => m.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) || m.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [mentors, filterAvailability, searchQuery]);

  // Step 1: recommend scenario for selected student
  const scenarioResults = useMemo(() => {
    if (!selectedStudent || !scenarios.length) return [];
    const studentProfile = {
      target_track: selectedStudent.target_track,
      facultyId: selectedStudent.facultyId,
      majorCode: selectedStudent.majorCode,
      weakestSkillCode: selectedStudent.weakestSkillCode,
      career_goal: selectedStudent.career_goal,
    };
    return recommendScenarioForStudent(studentProfile, selectedStudent.skillGap || {}, selectedStudent.readinessScore || 0, scenarios);
  }, [selectedStudent, scenarios]);

  const topScenario = scenarioResults[0] ?? null;

  // Step 2: match mentors for the recommended scenario
  const mentorResults = useMemo(() => {
    if (!selectedStudent || !topScenario) return [];
    const studentProfile = { target_track: selectedStudent.target_track };
    return matchMentorForScenario(studentProfile, topScenario.scenario, mentors.filter(m => m.role === 'mentor'));
  }, [selectedStudent, topScenario, mentors]);

  const bestMentorMatch = mentorResults[0] ?? null;

  const getMatchLabel = (match) => {
    if (match.capacityStatus === 'full') return MATCH_LABEL.full;
    if (match.matchScore >= 75) return MATCH_LABEL.recommended;
    if (match.matchScore >= 50) return MATCH_LABEL.possible;
    return MATCH_LABEL.weak;
  };

  const handleConfirmAssignment = (student, mentorRecord, scenarioRecord, isOverride = false) => {
    if (!mentorRecord) return;
    if (isOverride && mentorRecord.matchScore < 50) {
      Swal.fire({
        title: 'Weak Match Warning',
        text: 'This mentor is a weak match for this scenario. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Assign',
        cancelButtonText: 'Cancel'
      }).then(r => { if (r.isConfirmed) finalizeAssignment(student, mentorRecord, scenarioRecord, true); });
    } else {
      finalizeAssignment(student, mentorRecord, scenarioRecord, isOverride);
    }
  };

  const finalizeAssignment = (student, mentorRecord, scenarioRecord, isOverride) => {
    if (onAssignmentConfirm) {
      onAssignmentConfirm(
        student.id,
        mentorRecord.mentor.id,
        scenarioRecord?.scenario?.id,
        mentorRecord.matchScore,
        isOverride ? 'Admin Override' : 'System Match'
      );
    }
    Swal.fire({
      title: 'Assignment Confirmed',
      html: `<b>${student.fullname}</b> assigned to <b>${mentorRecord.mentor.fullname}</b><br>
             <small>Scenario: ${scenarioRecord?.scenario?.title || '—'}</small>`,
      icon: 'success',
      timer: 2500,
      showConfirmButton: false
    });
    setSelectedStudent(null);
  };

  return (
    <div className="admin-content mentor-matching-dashboard">

      {/* Responsible Matching Notice */}
      <div className="admin-grid-2col" style={{ gridTemplateColumns: '1fr', marginBottom: '20px' }}>
        <div className="admin-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" width="24" height="24" style={{ marginTop: '2px', flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#1E3A8A' }}>Responsible Matching Notice</h4>
              <p style={{ margin: 0, color: '#1E40AF', fontSize: '14px' }}>
                Matching scores are a support tool only. Final mentor assignment must be confirmed by Admin or Mentor.
                This system does not make employment or safety decisions. Matching flow: Student → Scenario → Mentor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-header-actions" style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search student or mentor..."
          className="admin-input"
          style={{ width: '250px' }}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select className="admin-input" value={filterTrack} onChange={e => setFilterTrack(e.target.value)}>
          <option value="All">All Tracks</option>
          <option value="quality_assurance">Quality Assurance</option>
          <option value="maintenance_machine">Maintenance & Machine</option>
          <option value="production_process">Production Process</option>
          <option value="safety_compliance">Safety Compliance</option>
        </select>
        <select className="admin-input" value={filterAvailability} onChange={e => setFilterAvailability(e.target.value)}>
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Full">Full</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', height: 'calc(100vh - 300px)' }}>

        {/* LEFT: Students */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <h3 className="admin-card-header">Students ({pendingStudents.length})</h3>
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
            {pendingStudents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>No students found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingStudents.map(student => (
                  <div
                    key={student.id}
                    className="admin-card"
                    style={{
                      padding: '12px', margin: 0, cursor: 'pointer',
                      border: selectedStudent?.id === student.id ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                      boxShadow: selectedStudent?.id === student.id ? '0 4px 6px -1px rgba(59,130,246,0.1)' : 'none'
                    }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{student.fullname}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                      {student.major} · {student.target_track?.replace(/_/g, ' ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#475569' }}>
                        Weakest: <strong>{student.weakestSkillCode?.replace(/_/g, ' ') || student.weakestSkill}</strong>
                      </span>
                      <span style={{ color: '#10B981', fontWeight: '600' }}>Score: {student.readinessScore}</span>
                    </div>
                    {student.assignedMentorId && (
                      <div style={{ marginTop: '8px', fontSize: '11px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', color: '#334155' }}>
                        Assigned: {mentors.find(m => m.id === student.assignedMentorId)?.fullname || student.assignedMentorId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Scenario + Mentor Suggestion */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <h3 className="admin-card-header">Scenario → Mentor Match</h3>
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
            {!selectedStudent ? (
              <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '40px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48" style={{ marginBottom: '16px' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>Select a student to view scenario and mentor recommendations</p>
              </div>
            ) : (
              <div>
                {/* Step 1: Recommended Scenario */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Step 1 — Recommended Scenario
                  </div>
                  {topScenario ? (
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{topScenario.scenario.title}</div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563EB', background: '#DBEAFE', padding: '2px 8px', borderRadius: '99px' }}>
                          {topScenario.score}% match
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', color: DIFFICULTY_COLOR[topScenario.scenario.difficulty] || '#64748B', fontWeight: '600' }}>
                          {topScenario.scenario.difficulty}
                        </span>
                        <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', color: '#475569' }}>
                          {topScenario.scenario.primaryTrack?.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', color: '#475569' }}>
                          Trains: {topScenario.scenario.mainSkillCode?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(topScenario.reasons || []).map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ color: '#94A3B8', fontSize: '13px', padding: '10px' }}>No scenario data available.</div>
                  )}
                </div>

                {/* Step 2: Suggested Mentor */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Step 2 — Suggested Mentor
                  </div>
                  {bestMentorMatch ? (
                    <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{bestMentorMatch.mentor.fullname}</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{bestMentorMatch.mentor.jobTitle}</div>
                        </div>
                        <span style={{
                          fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px',
                          background: getMatchLabel(bestMentorMatch).bg, color: getMatchLabel(bestMentorMatch).color
                        }}>
                          {getMatchLabel(bestMentorMatch).text} · {bestMentorMatch.matchScore}%
                        </span>
                      </div>
                      <ul style={{ margin: '0 0 10px', paddingLeft: '16px', fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(bestMentorMatch.matchReason || []).map((r, i) => (
                          <li key={i} style={{ color: r.includes('⚠') ? '#DC2626' : 'inherit' }}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ color: '#94A3B8', fontSize: '13px', padding: '10px' }}>Select a scenario first.</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="admin-btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '14px', justifyContent: 'center' }}
                    onClick={() => handleConfirmAssignment(selectedStudent, bestMentorMatch, topScenario, false)}
                    disabled={!bestMentorMatch || bestMentorMatch.capacityStatus === 'full'}
                  >
                    Confirm Assignment
                  </button>
                  <button
                    className="admin-btn-secondary"
                    style={{ width: '100%', padding: '12px', fontSize: '14px', justifyContent: 'center' }}
                    onClick={() => Swal.fire({
                      title: 'Manual Override',
                      text: 'Select a mentor from the right panel to override this suggestion.',
                      icon: 'info'
                    })}
                  >
                    Manual Override
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Available Mentors */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <h3 className="admin-card-header">Available Mentors ({filteredMentors.length})</h3>
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredMentors.map(mentor => {
                const result = selectedStudent ? mentorResults.find(m => m.mentor.id === mentor.id) : null;
                return (
                  <div key={mentor.id} className="admin-card" style={{ padding: '12px', margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{mentor.fullname}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{mentor.jobTitle}</div>
                      </div>
                      <span className={`admin-badge admin-badge-${STATUS_BADGE[mentor.availableStatus?.toLowerCase()] || 'neutral'}`}>
                        {mentor.currentStudents}/{mentor.maxStudents}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {(mentor.expertiseTracks || []).map(t => (
                        <span key={t} style={{ fontSize: '10px', background: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                          {t.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {mentor.canReviewProcessMap && <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>Map</span>}
                      {mentor.canReviewRiskChecklist && <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>Risk</span>}
                      {mentor.canReviewRca && <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>RCA</span>}
                      {mentor.canReviewTechnicalMemo && <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>Memo</span>}
                      {mentor.canReviewAiUsageLog && <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>AI</span>}
                    </div>

                    {selectedStudent && result && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: getMatchLabel(result).color }}>
                          {result.matchScore}% Match
                        </span>
                        <button
                          style={{ fontSize: '12px', padding: '4px 10px', background: 'transparent', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleConfirmAssignment(selectedStudent, result, topScenario, true)}
                        >
                          Assign
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
