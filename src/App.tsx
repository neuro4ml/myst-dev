import "./styles/index.css";
import { MarkdownHandler } from "./components/markdownHandler";

export default function App() {
  return (
    <>
      
      <div className="nav-bar">
        <h1 className="app-title">Neuro4ML</h1>    
      </div>
      <div className="horizontal-columns">
        <div className="column">
          TOC
        </div>
        <hr></hr>
        <div className="column">
          <MarkdownHandler></MarkdownHandler>
        </div>
        
      </div>
      
    </>
  );
}

