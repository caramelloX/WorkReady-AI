import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StudentSkillGap({ ratings, calculateRadarPoints, overallReadiness, strengthsCount, gapsCount }) {
  const { t } = useLanguage();
  const getRating = (key) => ratings && ratings[key] ? ratings[key].toUpperCase() : 'NON-GRADED';
  const getBgColor = (key) => {
    if (!ratings || !ratings[key]) return '#f3f4f6';
    if (ratings[key] === 'high') return '#d1fae5';
    if (ratings[key] === 'low') return '#fee2e2';
    return '#fef3c7';
  };
  const getTextColor = (key) => {
    if (!ratings || !ratings[key]) return '#6b7280';
    if (ratings[key] === 'high') return '#065f46';
    if (ratings[key] === 'low') return '#b91c1c';
    return '#d97706';
  };

  return (
    <div className="student-tab-panel">
            <div className="skillgap-header-row">
              <div className="student-page-title-area">
                <h1 className="student-page-title">{t('skillgap.title')}</h1>
                <p className="student-page-subtitle">{t('skillgap.subtitle')}</p>
              </div>
            </div>

            {/* Assessment mini cards */}
            <div className="skillgap-summary-row">
              
              {/* Composite Score */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">{t('skillgap.overall')}</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-blue)' }}></span>
                </div>
                <h3 className="val">{overallReadiness}%</h3>
                <p className="desc">{t('skillgap.overallDesc')}</p>
              </div>

              {/* Strengths count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">{t('skillgap.strengths')}</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-green)' }}></span>
                </div>
                <h3 className="val">{strengthsCount}</h3>
                <p className="desc">{t('skillgap.strengthsDesc')}</p>
              </div>

              {/* Gaps count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">{t('skillgap.gaps')}</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-yellow)' }}></span>
                </div>
                <h3 className="val">{gapsCount}</h3>
                <p className="desc">{t('skillgap.gapsDesc')}</p>
              </div>

              {/* Tracked count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">{t('skillgap.competencies')}</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                </div>
                <h3 className="val">6</h3>
                <p className="desc">{t('skillgap.competenciesDesc')}</p>
              </div>

            </div>

            {/* Main questionnaire & Radar split grid */}
            <div className="skillgap-body-grid">
              
              {/* Question list */}
              <div className="student-card skillgap-assessment-card">
                <div className="skillgap-rating-header">
                  <h4 className="skillgap-card-title">{t('skillgap.ratingQuestions')}</h4>
                  <span className="skillgap-scale-legend">{t('skillgap.scaleLegend')}</span>
                </div>

                {/* 1. Process Map */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.processMapAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('processMap'),
                      color: getTextColor('processMap'),
                    }}>{getRating('processMap')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q1')}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Safety Risk */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.safetyRiskAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('safetyRisk'),
                      color: getTextColor('safetyRisk'),
                    }}>{getRating('safetyRisk')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q2')}</span>
                    </div>
                  </div>
                </div>

                {/* 3. RCA */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.rcaAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('rca'),
                      color: getTextColor('rca'),
                    }}>{getRating('rca')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q3')}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Traceability */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.traceabilityAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('traceability'),
                      color: getTextColor('traceability'),
                    }}>{getRating('traceability')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q4')}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Technical Memo */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.memoAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('memo'),
                      color: getTextColor('memo'),
                    }}>{getRating('memo')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q5')}</span>
                    </div>
                  </div>
                </div>

                {/* 6. Responsible AI */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">{t('skills.responsibleAiAss')}</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: getBgColor('responsibleAi'),
                      color: getTextColor('responsibleAi'),
                    }}>{getRating('responsibleAi')}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">{t('skillgap.q6')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visual Radar Card */}
              <div className="student-card skillgap-radar-card">
                <h4 className="skillgap-card-title">{t('skillgap.radarTitle')}</h4>
                
                <div className="skillgap-radar-container">
                  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    
                    {/* Background Grids (Low scale) */}
                    <polygon points="150,115 180,132 180,167 150,185 120,167 120,132" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                    {/* Medium Scale Grid */}
                    <polygon points="150,82 208,115 208,183 150,217 91,183 91,115" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    {/* High Scale Grid */}
                    <polygon points="150,50 236,100 236,200 150,250 63,200 63,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Outer Label Lines */}
                    <line x1="150" y1="150" x2="150" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="150" y2="250" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* Labels text */}
                    <text x="150" y="38" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Process</text>
                    <text x="246" y="96" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">Safety/Quality</text>
                    <text x="246" y="208" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">RCA</text>
                    <text x="150" y="265" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Traceability</text>
                    <text x="54" y="208" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Tech Memo</text>
                    <text x="54" y="96" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Responsible AI</text>

                    {/* Active dynamic polygon representing student level */}
                    <polygon
                      className="radar-polygon-active"
                      points={calculateRadarPoints()}
                      fill="rgba(20, 184, 166, 0.25)"
                      stroke="var(--accent-teal)"
                      strokeWidth="2.5"
                    />

                  </svg>
                </div>

                <p className="skillgap-radar-legend">{t('skillgap.radarLegend')}</p>
              </div>

            </div>

            {/* Strengths & Weaknesses Feedback */}
            <div className="skillgap-bottom-grid">
              
              {/* Strengths list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title strengths">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t('skillgap.strengths')}</span>
                </h4>
                {strengthsCount === 0 ? (
                  <p className="skillgap-feedback-empty">{t('skillgap.noHighRatings')}</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'high' && <li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.fb1')}</li>}
                    {ratings.safetyRisk === 'high' && <li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.fb2')}</li>}
                    {ratings.rca === 'high' && <li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.fb3')}</li>}
                    {ratings.traceability === 'high' && <li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.fb4')}</li>}
                    {ratings.memo === 'high' && <li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.fb5')}</li>}
                    {ratings.responsibleAi === 'high' && <li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.fb6')}</li>}
                  </ul>
                )}
              </div>

              {/* Weaknesses list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title weaknesses">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{t('skillgap.feedbackWeaknesses')}</span>
                </h4>
                {gapsCount === 0 ? (
                  <p className="skillgap-feedback-empty">{t('skillgap.noLowRatings')}</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'low' && <li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.rec1')} {t('skillgap.rec1act')}</li>}
                    {ratings.safetyRisk === 'low' && <li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.rec2')} {t('skillgap.rec2act')}</li>}
                    {ratings.rca === 'low' && <li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.rec3')} {t('skillgap.rec3act')}</li>}
                    {ratings.traceability === 'low' && <li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.rec4')} {t('skillgap.rec4act')}</li>}
                    {ratings.memo === 'low' && <li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.rec5')} {t('skillgap.rec5act')}</li>}
                    {ratings.responsibleAi === 'low' && <li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.rec6')} {t('skillgap.rec6act')}</li>}
                  </ul>
                )}
              </div>

            </div>

            {/* Recommended Training Courses */}
            <div className="student-card skillgap-training-card">
              <h4 className="skillgap-card-title" style={{ marginBottom: '20px' }}>{t('skillgap.recommended')}</h4>
              
              <div className="skillgap-table-wrapper">
                <table className="skillgap-table">
                  <thead>
                    <tr>
                      <th>{t('skillgap.thCompetency')}</th>
                      <th>{t('skillgap.thCurrent')}</th>
                      <th>{t('skillgap.thPriority')}</th>
                      <th>{t('skillgap.thTrainNext')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    <tr>
                      <td className="skillgap-table-competency">{t('skills.processMapAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.processMap}`}>{ratings.processMap}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}`}>{ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec1act')}</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">{t('skills.safetyRiskAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk}`}>{ratings.safetyRisk}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}`}>{ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec2act')}</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">{t('skills.rcaAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.rca}`}>{ratings.rca}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}`}>{ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec3act')}</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">{t('skills.traceabilityAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.traceability}`}>{ratings.traceability}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}`}>{ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec4act')}</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">{t('skills.memoAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.memo}`}>{ratings.memo}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}`}>{ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec5act')}</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">{t('skills.responsibleAiAss')}</td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi}`}>{ratings.responsibleAi}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}`}>{ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}</span></td>
                      <td>{t('skillgap.rec6act')}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
  );
}
