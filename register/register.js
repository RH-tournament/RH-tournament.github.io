// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDo4A20fN1l3YAO36h8SkP32lEMEOFBMf0",
  authDomain: "rh-tournament-system.firebaseapp.com",
  projectId: "rh-tournament-system",
  storageBucket: "rh-tournament-system.firebasestorage.app",
  messagingSenderId: "22836197936",
  appId: "1:22836197936:web:b7e82cc18243b860384bf5"
};

// Safe Firebase init (VERY IMPORTANT)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const tournamentSelect = document.getElementById("tournamentSelect");
const countBox = document.getElementById("count");

// 🔹 Load tournaments into dropdown
db.collection("tournaments")
  .orderBy("dateTime", "asc")
  .onSnapshot(snapshot => {
    tournamentSelect.innerHTML =
      `<option value="">Select tournament</option>`;

    snapshot.forEach(doc => {
      const t = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent =
        `${t.name} (${new Date(t.dateTime.seconds * 1000).toLocaleString()})`;
      tournamentSelect.appendChild(option);
    });
  });

// 🔹 Show participant count
tournamentSelect.addEventListener("change", () => {
  const tId = tournamentSelect.value;

  if (!tId) {
    countBox.innerText = "Select a tournament";
    return;
  }

  db.collection("registrations")
    .where("tournamentId", "==", tId)
    .onSnapshot(snapshot => {
      countBox.innerText = `Total applied: ${snapshot.size}`;
    });
});

// 🔹 Register function
function register() {
  const tournamentId = tournamentSelect.value;
  const name = document.getElementById("name").value.trim();
  const uid = document.getElementById("uid").value.trim();

  if (!tournamentId || !name || !uid) {
    alert("All fields are required");
    return;
  }

  // Check duplicate UID for same tournament
  db.collection("registrations")
    .where("tournamentId", "==", tournamentId)
    .where("uid", "==", uid)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        alert("This UID already registered for this tournament");
        throw "DUPLICATE";
      }

      return db.collection("registrations").add({
        tournamentId: tournamentId,
        name: name,
        uid: uid,
        createdAt: new Date()
      });
    })
    .then(() => {
      alert("✅ Registration successful!");
      document.getElementById("name").value = "";
      document.getElementById("uid").value = "";
    })
    .catch(err => {
      if (err !== "DUPLICATE") {
        console.error("Registration error:", err);
        alert("❌ Error occurred. Check console.");
      }
    });
              }
