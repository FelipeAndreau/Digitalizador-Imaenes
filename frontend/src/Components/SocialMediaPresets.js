import React from 'react';
import './SocialMediaPresets.css';

const SocialMediaPresets = ({ onSelect }) => {
  const presets = [
    { id: 'instagram-post', icon: '📷', label: 'Posts', size: '1080x1080' },
    { id: 'instagram-story', icon: '📱', label: 'Story', size: '1080x1920' },
    { id: 'facebook-post', icon: '👍', label: 'Posts', size: '1200x630' },
    { id: 'facebook-story', icon: '📱', label: 'Story', size: '1080x1920' },
    { id: 'twitter-post', icon: '🐦', label: 'Posts', size: '1200x675' },
    { id: 'pinterest-pin', icon: '📌', label: 'Pins', size: '1000x1500' },
    { id: 'linkedin-post', icon: '💼', label: 'Posts', size: '1200x627' },
  ];

  return (
    <div className="social-presets">
      <h3>Cambiar el tamaño para las redes sociales:</h3>
      <div className="social-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className="social-preset-btn"
            onClick={() => onSelect(preset)}
          >
            <span className="social-icon">{preset.icon}</span>
            <span className="social-label">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaPresets;