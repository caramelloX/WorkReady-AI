import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { api } from '../../api';
import './MentorScenario.css';
import ScenarioEditForm from '../../components/ScenarioEditForm';

const MySwal = withReactContent(Swal);

export default function MentorScenario({ scenarios, students, onScenarioUpdate }) {
  const { t } = useLanguage();
  const [selections, setSelections] = useState({});
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectStudent = (scenarioId, studentId) => {
    setSelections(prev => ({ ...prev, [scenarioId]: studentId }));
  };

  const handleSendScenario = (scenario) => {
    const studentId = selections[scenario.id];
    if (!studentId) return;

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    Swal.fire({
      title: 'Success!',
      text: `Scenario "${scenario.title}" has been assigned to ${student.name}.`,
      icon: 'success',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK'
    });

    setSelections(prev => ({ ...prev, [scenario.id]: '' }));
  };

  const handleCreateScenario = () => {
    Swal.fire({
      title: 'Create New Scenario',
      text: 'The ability to create custom scenarios is coming soon!',
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Got it'
    });
  };

  const handleEditClick = (scenario) => {
    MySwal.fire({
      title: 'Edit Scenario',
      width: '80vw',
      padding: '2rem',
      html: (
        <ScenarioEditForm 
          scenario={scenario}
          onSave={async (data) => {
            MySwal.close();
            await handleSaveEdit(scenario.id, data.title, data.desc, data.quiz);
          }}
          onCancel={() => {
            MySwal.close();
          }}
          onGenerate={async () => {
            MySwal.close();
            await handleGenerateAI(scenario);
          }}
        />
      ),
      showConfirmButton: false,
      showCancelButton: false,
      showDenyButton: false,
    });
  };

  const handleSaveEdit = async (scenarioId, title, desc, quiz) => {
    setIsSaving(true);
    try {
      await api.updateScenario(scenarioId, title, desc, quiz);
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Scenario updated successfully',
        showConfirmButton: false,
        timer: 3000
      });
      // Option: Trigger parent refresh here if needed
      // if(onScenarioUpdate) onScenarioUpdate();
    } catch (err) {
      console.error(err);
      MySwal.fire('Error', 'Failed to update scenario', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAI = async (scenario) => {
    MySwal.fire({
      title: 'Generating with AI...',
      text: 'Please wait while AI constructs a new scenario...',
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      }
    });

    try {
      const generated = await api.generateScenarioContent(scenario.id);
      MySwal.close();
      
      // Re-open the edit modal with new generated content
      handleEditClick({ ...scenario, title: generated.title, desc: generated.desc, quiz: generated.quiz || [] });
      
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'AI has generated new content!',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      console.error(err);
      MySwal.fire('AI Generation Failed', err.message || 'Could not reach AI services.', 'error');
    }
  };

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="mentor-scenario-container">
        <div className="mentor-scenario-header">
          <button className="mentor-create-scenario-btn" onClick={handleCreateScenario}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Scenario
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>No scenarios available to assign.</p>
      </div>
    );
  }

  return (
    <div className="mentor-scenario-container">
      <div className="mentor-scenario-header">
        <button className="mentor-create-scenario-btn" onClick={handleCreateScenario}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Scenario
        </button>
      </div>
      
      {scenarios.map(scenario => {
        const currentSelection = selections[scenario.id] || '';
        
        return (
          <div key={scenario.id} className="mentor-scenario-card">
            
            <div className="mentor-scenario-info">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h3 className="mentor-scenario-title">{scenario.title}</h3>
                  <p className="mentor-scenario-desc">
                    {scenario.desc || scenario.description || 'A simulation scenario to assess and develop skills.'}
                    <span style={{marginLeft: '0.5rem', color: 'var(--accent)', fontWeight: '500'}}>
                      • {scenario.quiz && scenario.quiz.length > 0 ? scenario.quiz.length : 0} Questions
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => handleEditClick(scenario)}
                  style={{
                    background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                    padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="mentor-scenario-action">
              <select 
                className="mentor-scenario-select"
                value={currentSelection}
                onChange={(e) => handleSelectStudent(scenario.id, e.target.value)}
              >
                <option value="" disabled>-- Select Student --</option>
                {students && students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              
              <button 
                className="mentor-scenario-send-btn"
                disabled={!currentSelection}
                onClick={() => handleSendScenario(scenario)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Scenario
              </button>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
