// SectionModal.js
import React, { useState, useEffect } from 'react';
import './SectionModal.css';

const SectionModal = ({ isOpen, onClose, sections, grades }) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [filteredSections, setFilteredSections] = useState([]);

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade === '' ? null : grade);
  };

  useEffect(() => {
    // Filter sections based on the selected grade
    const filtered = selectedGrade
      ? sections.filter((section) => section.grade === selectedGrade)
      : sections;

    setFilteredSections(filtered);
  }, [selectedGrade, sections]);

  return (
    isOpen && (
      <div className="section-modal-overlay" onClick={onClose}>
        <div className="section-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Sections</h2>

          {/* Add a dropdown for grade selection */}
          <div className="grade-filter">
            <label>Select Grade: </label>
            <select onChange={(e) => handleGradeChange(e.target.value)}>
              <option value="">All</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              {/* Map over the available grades */}
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          {filteredSections.map((section, index) => (
            <p key={index}>
              {section.name}: {section.totalStudents} students
            </p>
          ))}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default SectionModal;
