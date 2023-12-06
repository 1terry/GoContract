// src/routes/Home.js
import React from 'react';
import './contractorCard.css'; // Import the CSS file

function ContractorCard() {
  return (
    <div className="container-search card-container">
        <div className="Grid">
            <a href="/" class="hero-image-container">
                <img class="hero-image" src="https://i.postimg.cc/NfR2yhNs/image-equilibrium.jpg" alt="Spinning glass cube"/>
            </a>
            <main class="main-content">
                <h1><a href="#">Equilibrium #3429</a></h1>
                <p>Our Equilibrium collection promotes balance and calm.</p>
                <div class="flex-row">
                <div class="coin-base">
                    <img src="https://i.postimg.cc/T1F1K0bW/Ethereum.png" alt="Ethereum" class="small-image"/>
                    <h2>0.041 ETH</h2>
                </div>
                <div class="time-left">
                    <img src="https://i.postimg.cc/prpyV4mH/clock-selection-no-bg.png" alt="clock" class="small-image"/>
                    <p>3 days left</p>
                </div>
                </div>
            </main>
            <div class="card-attribute">
                <img src="https://i.postimg.cc/SQBzNQf1/image-avatar.png" alt="avatar" class="small-avatar"/>
                <p>Creation of <span><a href="#">Jules Wyvern</a></span></p>
            </div>
        <div class="attribution">
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
            Coded by <a href="#">Lauro235</a>.
        </div>
        </div>
    </div>
  );
};

export default ContractorCard;
