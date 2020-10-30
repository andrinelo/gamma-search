import React from "react";

// The website's header
function SiteHeader() {
  return (
    <div style={{backgroundColor: 'white', display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 10px 5px 10px"}}>
      <a target="_blank" rel="noopener noreferrer" href="https://www.ntnu.no/studier/emner/TDT4290">
        <img src="./ntnu_logo.png" alt="NTNU" style={{maxHeight:"20px", marginRight:"35px"}}/>
      </a>
      <a href="/">
        <img src="./gamma_logo3.png" alt="Logo" style={{maxHeight:"45px"}}/>
      </a>
      <a target="_blank" rel="noopener noreferrer" href="https://www.ardoq.com/">
        <img src="./ardoq_logo.png" alt="Ardoq" style={{maxHeight:"20px"}}/>
      </a>
    </div>
  ) 
}

export default SiteHeader;
