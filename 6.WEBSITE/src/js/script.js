import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";
import mooon from "../img/moonimg.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// takes the full width and height of the window and creates a renderer object.
const mainArea = document.querySelector(".content");
mainArea.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// creates a scene object.

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

const axeshelper = new THREE.AxesHelper(0); // To help plotting the points
scene.add(axeshelper);

camera.position.set(0, 0, 14); 

const sphereGeometry = new THREE.SphereGeometry(5, 360, 180);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: "#F6F1D5", //colour of moon
  wireframe: false,
  map: textureLoader.load(mooon),
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(0, 0, 0);

function latLonToXYZ(latitude, longitude, radius) {
  const latRad = THREE.MathUtils.degToRad(latitude); // Convert to radians
  const lonRad = THREE.MathUtils.degToRad(longitude); // Convert to radians

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.cos(latRad) * Math.sin(lonRad);
  const z = radius * Math.sin(latRad);

  return new THREE.Vector3(x, z, y); // Note: Z is usually vertical, so we swap Y and Z
}

const markers = [];

function addMarker(latitude, longitude) {
  const radius = 5; // Radius of the moon's sphere
  const position = latLonToXYZ(latitude, longitude, radius);

  // Create a small marker (a sphere)
  const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16); // Small sphere for the marker
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 'green' }); // Grey purple marker
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  marker.position.set(position.x, position.y, position.z); // Set the marker's position
  scene.add(marker);

  // Add click event to show tooltip
  marker.userData = { latitude, longitude };
  marker.style = "cursor: pointer";
  markers.push(marker);
}

const leftpop = document.querySelector(".side-popup");

// Function to show the tooltip based on 3D position
function showPopUp(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycast to detect which marker is clicked
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(markers);

  if (intersects.length > 0) {
    const intersectedMarker = intersects[0].object;
    const { latitude, longitude } = intersectedMarker.userData;
    leftpop.style.display = "flex";
    const latDiv = document.querySelector(".lat");
    latDiv.textContent = `Lat: ${latitude}`;
    const lonDiv = document.querySelector(".lon");
    lonDiv.textContent = `Lon: -${longitude}`;
    
    console.log("clicked");
  } else {
    console.log("not clicked");
    // tooltip.style.display = "none";
  }
}
addMarker(79.137, 67.512)


document.querySelector("canvas").addEventListener("click", showPopUp);
document.querySelector(".close-btn").addEventListener("click", () => {
  leftpop.style.display = "none";
});

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.0;

  renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);
import sp_al from "../img/SP_Al.png";
import sp_si from "../img/SP_Si.png";
import sp_mg from "../img/SP_Mg.png";

const dropdown = document.querySelector(".dropdown");
const image = document.querySelector(".image");
dropdown.addEventListener("change", () => {
  if (dropdown.value === "al") {
    image.src = sp_al;
  } 
  else if (dropdown.value === "si") {
    image.src = sp_si;
  } 
  else if (dropdown.value === "mg") {
    image.src = sp_mg;
  }
});
