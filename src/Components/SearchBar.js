import React, { useState } from "react";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    const newFilter = data.filter((value) => {
      return value.contractorName
        .toLowerCase()
        .includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleFilter}
        ></input>
        <div className="searchIcon"></div>
      </div>

      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.map((value, key) => {
            return (
              <a
                className="dataItem"
                href="https://www.youtube.com/watch?v=BbeeuzU5Qc8"
                target="_blank"
              >
                <p>{value.contractorName}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
