import { useState } from 'react'
import {selections} from "./Selections.tsx"
import './App.css'

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  const handleToggle = (title : any) => {
    setSelectedLanguage(prevTitle => (prevTitle === title ? null : title));
  };
  const toggleDropdown = () => setIsVisible(!isVisible);

  return (
    <>
      <h1 style={{fontSize: "300%",}}>GitHub Repository Finder</h1>
      <div>
        <button onClick={toggleDropdown} style={{width: "50%",}}>
        {selectedLanguage != null ? selectedLanguage : "Select a Language"} {isVisible ? '▲' : '▼'}
      </button> 
        {isVisible && (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, }}>
        {selections.map((item) => (
          <li key={item.title}>
            <button
              onClick={() => handleToggle(item.title)}
              style={{
                backgroundColor: selectedLanguage === item.title ? 'blue' : 'gray',
                color: 'white'
              }}
              aria-pressed={selectedLanguage === item.title}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
        )}
      </div>
    </>
  )
}

export default App