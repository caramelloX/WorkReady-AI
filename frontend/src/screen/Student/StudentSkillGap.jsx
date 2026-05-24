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
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--card-bg, #18181b)', borderRadius: '12px', border: '1px dashed var(--border-color, #27272a)', marginTop: '2rem' }}>
              <p>Skill gap analysis data is currently unavailable.</p>
            </div>

          </div>
  );
}
