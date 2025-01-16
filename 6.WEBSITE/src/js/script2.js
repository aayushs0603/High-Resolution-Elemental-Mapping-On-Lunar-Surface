import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import stars from "../img/stars.jpg";
import moonImg from "../img/moonimg.jpg";
import nebula from "../img/nebula.jpg";
import pt_det from "../img/Pt_detect.png";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 14); // Position the camera at a good initial angle
orbit.update();

// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

const axeshelper = new THREE.AxesHelper(0);
scene.add(axeshelper);

const sphereGeometry = new THREE.SphereGeometry(5, 360, 180);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: "#F6F1D5",
  wireframe: false,
  map: textureLoader.load(pt_det),
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(0, 0, 0);

// Function to convert latitude and longitude to spherical coordinates
function latLonToXYZ(latitude, longitude, radius) {
  const latRad = THREE.MathUtils.degToRad(latitude); // Convert to radians
  const lonRad = THREE.MathUtils.degToRad(longitude); // Convert to radians

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.cos(latRad) * Math.sin(lonRad);
  const z = radius * Math.sin(latRad);

  return new THREE.Vector3(x, z, y); // Note: Z is usually vertical, so we swap Y and Z
}

function addMarker(latitude, longitude) {
  const radius = 5; // Radius of the moon's sphere
  const position = latLonToXYZ(latitude, longitude, radius);

  // Create a small marker (a sphere)
  const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Small sphere for the marker
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red marker
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  marker.position.set(position.x, position.y, position.z); // Set the marker's position
  scene.add(marker);
  markers.push(marker);
}

// // Create a container for the tooltip (this will be used for all markers)
// const tooltip = document.createElement("div");
// tooltip.style.position = "absolute";
// tooltip.style.padding = "5px";
// tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
// tooltip.style.color = "white";
// tooltip.style.borderRadius = "3px";
// tooltip.style.display = "none";
// document.body.appendChild(tooltip);

// Function to add a marker with tooltip at specific latitude and longitude
function addMarker(latitude, longitude) {
  const radius = 5; // Radius of the moon's sphere
  const position = latLonToXYZ(latitude, longitude, radius);

  // Create a small marker (a sphere)
  const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Small sphere for the marker
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red marker
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  marker.position.set(position.x, position.y, position.z); // Set the marker's position
  scene.add(marker);
  markers.push(marker);
}

// Store markers in an array for easy reference
const markers = [];

// Function to show the tooltip based on 3D position
// function showTooltip(event) {
//   const mouse = new THREE.Vector2();
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   // Raycast to detect which marker is clicked
//   const raycaster = new THREE.Raycaster();
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(markers);

//   if (intersects.length > 0) {
//     const intersectedMarker = intersects[0].object;
//     const { latitude, longitude } = intersectedMarker.userData;
//     tooltip.style.display = "block";
//     tooltip.innerHTML = `Lat: ${latitude}, Lon: ${longitude}`;

//     // Position the tooltip in the screen space
//     const vector = new THREE.Vector3();
//     intersectedMarker.getWorldPosition(vector);
//     const screenPos = vector.project(camera);

//     const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
//     const y = (screenPos.y * -0.5 + 0.5) * window.innerHeight;

//     tooltip.style.left = `${x}px`;
//     tooltip.style.top = `${y}px`;
//   } else {
//     tooltip.style.display = "none";
//   }
// }

// window.addEventListener("mousemove", showTooltip);

// // Add markers at specific coordinates (latitude, longitude)
// addMarker(0, 0);   // Example: Equator and Prime Meridian
// addMarker(30, 30); // Example: Latitude 30°, Longitude 30°
// addMarker(-45, -45); // Example: Latitude -45°, Longitude -45°
// addMarker(51.6,9.3) // Plato Crater 51.6 N 9.3 W
// addMarker(9.62, 20.08); // Copernicus Crater 9.62 N 20.08 W
// addMarker(8.1,38.0) // Kepler Crater 8.1 N 38.0 W



function isPointInRectangle(lat, lon, rect) {
  const latitudes = [
    parseFloat(rect[" V0_LATITUDE"]),
    parseFloat(rect[" V1_LATITUDE"]),
    parseFloat(rect[" V2_LATITUDE"]),
    parseFloat(rect[" V3_LATITUDE"]),
  ];
  const longitudes = [
    parseFloat(rect["V0_LONGITUDE"]),
    parseFloat(rect["V1_LONGITUDE"]),
    parseFloat(rect["V2_LONGITUDE"]),
    parseFloat(rect["V3_LONGITUDE"]),
  ];

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function setWeights(lat, lon, weights) {
  const popup = document.querySelector(".popup");
  popup.style.display = "flex";
  const latDiv = popup.querySelector(".lat");
  latDiv.textContent = `Lat: ${lat}`;
  const lonDiv = popup.querySelector(".lon");
  lonDiv.textContent = `Lon: ${lon}`;
  const oxyDiv = popup.querySelector(".oxy");
  oxyDiv.textContent = `${weights.O_WT}%`;
  const siliDiv = popup.querySelector(".sili");
  siliDiv.textContent = `${weights.SI_WT}%`;
  const magDiv = popup.querySelector(".mag");
  magDiv.textContent = `${weights.MG_WT}%`;
  const aluDiv = popup.querySelector(".alu");
  aluDiv.textContent = `${weights.AL_WT}%`;
  const calDiv = popup.querySelector(".cal");
  calDiv.textContent = `${weights.CA_WT}%`;
  const sodDiv = popup.querySelector(".sod");
  sodDiv.textContent = `${weights.NA_WT}%`;
  const ironDiv = popup.querySelector(".iron");
  ironDiv.textContent = `${weights.FE_WT}%`;
  const titDiv = popup.querySelector(".tit");
  titDiv.textContent = `${weights.TI_WT}%`;
}

function handleSubmit(event) {
  event.preventDefault();
  const latitude = parseFloat(event.target.latitude.value);
  const longitude = parseFloat(event.target.longitude.value);
  console.log(latitude, longitude);

  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((data) => {
      const entry = data.find((rect) =>
        isPointInRectangle(latitude, longitude, rect)
      );

      if (entry) {
        const weights = {
          FE_WT: entry["AL_WT"],
          TI_WT: entry["TI_WT"],
          CA_WT: entry["CA_WT"],
          SI_WT: entry["SI_WT"],
          AL_WT: entry["AL_WT"],
          MG_WT: entry["MG_WT"],
          NA_WT: entry["NA_WT"],
          O_WT: entry["O_WT"],
        };
        setWeights(latitude, longitude, weights);
        addMarker(latitude, -longitude);
      } else {
        alert("No matching entry found.");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function animate() {
  requestAnimationFrame(animate);
  //   sphere.rotation.y += 0.001;
  renderer.render(scene, camera);
}

import si_final from "../img/Si_final.png";
import al_final from "../img/Al_final.png";
import ca_final from "../img/Ca_final.png";
import mg_final from "../img/Mg_final.png";
import fe_final from "../img/Fe_final.png";
import mg_si_final from "../img/Mg_Si_final.png";
import ca_si_final from "../img/Ca_Si_final.png";
import al_si_final from "../img/Al_Si_final.png";

animate();

const elements = document.querySelectorAll(".sidebar-icon2");
elements.forEach((element) => {
  element.addEventListener("click", () => {
    const ele = element.getAttribute("data");
    if (ele === "fe") {
      sphereMaterial.map = textureLoader.load(fe_final);
    } else if (ele === "si") {
      sphereMaterial.map = textureLoader.load(si_final);
    } else if (ele === "mg") {
      sphereMaterial.map = textureLoader.load(mg_final);
    } else if (ele === "al") {
      sphereMaterial.map = textureLoader.load(al_final);
    } else if (ele === "ca") {
      sphereMaterial.map = textureLoader.load(ca_final);
    } else if (ele === "mg-si") {
      sphereMaterial.map = textureLoader.load(mg_si_final);
      // console.log("na");
    } else if (ele === "ca-si") {
      sphereMaterial.map = textureLoader.load(ca_si_final);
    } else if (ele === "al-si") {
      sphereMaterial.map = textureLoader.load(al_si_final);
    }
  });
});

const submit_button = document.querySelector(".sub");
submit_button.addEventListener("submit", (e) => handleSubmit(e));
