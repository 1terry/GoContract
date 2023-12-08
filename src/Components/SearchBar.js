// import React, { useState } from "react";

// function SearchBar({ placeholder, data }) {
//   const [filteredData, setFilteredData] = useState([]);


//   const handleContractorSearch = async (event) => {
//     event.preventDefault();
//     setMessage(''); // Clear previous messages

//     // Simple validation
//     try {
//       const response = await fetch('http://localhost:3001/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username: email, userType: userType}),
//       });

//       const data = await response.json();
//       if (response.status === 201) {
//         console.log('Search Successful', data);
//         setMessage('Search Successful!'); // Display success message
//         // Redirect or handle success scenario
//       } else {
//         console.error('Sign Up Failed emnail:', email,password);
//         setMessage(data.message || 'Sign Up Failed'); // Display error message from server or default message
//       }
//     } catch (error) {
//       console.error('Error during sign up', error);
//       setMessage('An error occurred during sign up'); // Display error message
//     }
//   };

//   const handleFilter = (event) => {
//     const searchWord = event.target.value;
//     const newFilter = data.filter((value) => {
//       return value.contractorName
//         .toLowerCase()
//         .includes(searchWord.toLowerCase());
//     });
//     if (searchWord === "") {
//       setFilteredData([]);
//     } else {
//       setFilteredData(newFilter);
//     }
//   };

//   return (
//     <div className="search">
//       <div className="searchInputs">
//         <input
//           type="text"
//           placeholder={placeholder}
//           onChange={handleFilter}
//         ></input>
//         <div className="searchIcon"></div>
//       </div>

//       {filteredData.length != 0 && (
//         <div className="dataResult">
//           {filteredData.map((value, key) => {
//             return (
//               <a
//                 className="dataItem"
//                 href="https://www.youtube.com/watch?v=BbeeuzU5Qc8"
//                 target="_blank"
//               >
//                 <p>{value.contractorName}</p>
//               </a>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchBar;
