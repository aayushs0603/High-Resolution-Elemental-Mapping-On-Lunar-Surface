import stars from "../img/stars.jpg";
import moonImg from "../img/moonimg.jpg";
import nebula from "../img/nebula.jpg";
import si_final from "../img/Si_final.png";
import al_final from "../img/Al_final.png";
import ca_final from "../img/Ca_final.png";
import mg_final from "../img/Mg_final.png";
import fe_final from "../img/Fe_final.png";
import mg_si_final from "../img/Mg_Si_final.png";
import ca_si_final from "../img/Ca_Si_final.png";
import al_si_final from "../img/Al_Si_final.png";



const dropdown = document.querySelector(".dropdown");
const image = document.querySelector(".image");
dropdown.addEventListener("change", () => {
  if (dropdown.value === "si") {
    image.src = si_final;
  } 
  else if (dropdown.value === "al") {
    image.src = al_final;
  } 
  else if (dropdown.value === "ca") {
    image.src = ca_final;
  }
  else if (dropdown.value === "mg") {
    image.src = mg_final;
  }
  else if (dropdown.value === "fe") {
    image.src = fe_final;
  }
  else if (dropdown.value === "mg-si") {
    image.src = mg_si_final;
  }
  else if (dropdown.value === "ca-si") {
    image.src = ca_si_final;
  }
  else if (dropdown.value === "al-si") {
    image.src = al_si_final;
  }
  else if (dropdown.value === "al") {
    image.src = moonImg;
  }
});
