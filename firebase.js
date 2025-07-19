import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  // paste dari Firebase sini
  apiKey: "AIzaSyB_u-tSvrjekRig9O9H0aAoO9H37SNJfpE",

  authDomain: "portofolio-bell.firebaseapp.com",

  projectId: "portofolio-bell",

  storageBucket: "portofolio-bell.firebasestorage.app",

  messagingSenderId: "770115896339",

  appId: "1:770115896339:web:08987ba3204d8ee1342be6",

  measurementId: "G-R45JN275TW"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("project-list");

async function loadProjects() {
  const querySnapshot = await getDocs(collection(db, "projects"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "project";
    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <img src="${data.image_url}" alt="${data.title}" />
      <p><a href="${data.link_url}" target="_blank">Lihat Proyek</a></p>
    `;
    container.appendChild(div);
  });
}

loadProjects();
