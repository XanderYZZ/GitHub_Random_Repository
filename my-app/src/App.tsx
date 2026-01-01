import { useEffect, useState } from 'react'
import {selections} from "./Selections.tsx"
import './App.css'
import axios from 'axios';
import { StarIcon, RepoForkedIcon, IssueOpenedIcon } from '@primer/octicons-react';

function App() {
  interface SELECTED {
    url: string;
    name: string;
    description: string;
    language: string;  
    stars: number;
    forks: number;
    open_issues: number;
  };
  type STATUS_TYPE = "none" | "loading" | "error" | "success";

  const [isVisible, setIsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [status, setStatus] = useState<STATUS_TYPE>("none");
  const [selectedRepository, setSelectedRepository] = useState<SELECTED | null>(null);
  
  const handleToggle = (title : string) => {
    const isDeselecting = selectedLanguage === title;
    const newLanguage = isDeselecting ? null : title;
    setSelectedLanguage(newLanguage);
    setStatus(newLanguage === null ? "none" : "loading");
    setIsVisible(false); 
  };
  const toggleDropdown = () => setIsVisible(!isVisible);
  const fetchRandomRepository = () => {
    if (selectedLanguage == null) { return; }

    setStatus("loading");

    const perPage = 100;
    const maxPages = 10;
    const randomPage = Math.floor(Math.random() * maxPages) + 1;

    axios.get("https://api.github.com/search/repositories",
    {
      params: {
        q: `language:${selectedLanguage}`,
        sort: "stars",
        order: "desc",
        per_page: perPage,
        page: randomPage,
      },
    })
      .then(res => {
        if (!res.data.items.length) {
          setStatus("error");
          return;
        }

        const randIndex = Math.floor(Math.random() * res.data.items.length);
        const item = res.data.items[randIndex];
        console.log(item);

        setSelectedRepository({
          url: item.html_url,
          name: item.name,
          description: item.description,
          language: item.language,
          stars: item.stargazers_count,
          forks: item.forks_count,
          open_issues: item.open_issues_count,
        });

        setStatus("success");
      }) 
      .catch(() => setStatus("error"));
  }
  useEffect(() => {
    fetchRandomRepository();
  }, [selectedLanguage]);

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
      <div style={{
        backgroundColor: "#e0e0e027",
        borderRadius: "12px",
        padding: "1rem",
        margin: "20px auto 0 auto",  
        maxWidth: "600px",          
        width: "100%",
        height: "200%",
        boxSizing: "border-box",
      }}>
        {status == "none" && <>
          <label>Select a language</label>
        </>} 
        {status == "loading" && <>
          <label>Loading, please wait...</label>
        </>} 
        {status == "error" && <>
          <h2 style={{ marginTop: 0 }}>Error fetching repositories.</h2>
          <button onClick={fetchRandomRepository} style={{"backgroundColor": "red", "width": "100%",}}>
            Retry
          </button>
        </>} 
        {status === "success" && selectedRepository != null && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap"  
        }}>
          <div>
            <h2 style={{ marginTop: 0 }}>{selectedRepository.name}</h2>
            <h4>{selectedRepository.description}</h4>
          </div>

          <div style={{ position: "relative", height: "20px", }}>
          <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", fontWeight: "bold" }}>
            {selectedRepository.language}
          </div>

          <a
            href={selectedRepository.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textDecoration: "none", fontWeight: "bold" }}
          >
            View on GitHub
          </a>

          <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <StarIcon size={16} /> {selectedRepository.stars}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <RepoForkedIcon size={16} /> {selectedRepository.forks}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IssueOpenedIcon size={16} /> {selectedRepository.open_issues}
            </div>
          </div>
        </div>
        <div style={{marginTop: 16}}>
          <button onClick={fetchRandomRepository} style={{"backgroundColor": "#229ac3ff", "width": "100%",}}>
            Refresh
          </button>
        </div>
        </div>
      )}
      </div>
    </>
  )
}

export default App