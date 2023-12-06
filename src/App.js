import React from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import ContractorData from "./TempData.json";

function App() {
  return (
    <div className="App">
      <label>Looking for a contractor? Search below!</label>
      <SearchBar
        placeholder="Enter a contractor name"
        data={ContractorData}
      ></SearchBar>
    </div>
  );
}

export default App;
