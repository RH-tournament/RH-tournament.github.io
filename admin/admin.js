// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDo4A20fN1l3YAO36h8SkP32lEMEOFBMf0",
  authDomain: "rh-tournament-system.firebaseapp.com",
  projectId: "rh-tournament-system",
  storageBucket: "rh-tournament-system.firebasestorage.app",
  messagingSenderId: "22836197936",
  appId: "1:22836197936:web:b7e82cc18243b860384bf5"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add tournament
function addTournament() {
  const name = document.getElementById("tName").value.trim();
  const time = document.getElementById("tTime").value;

  if (!name || !time) {
    alert("Tournament name & time required");
    return;
  }

  db.collection("tournaments").add({
    name: name,
    dateTime: new Date(time)
  }).then(() => {
    document.getElementById("tName").value = "";
    document.getElementById("tTime").value = "";
  });
}

// Load tournaments
db.collection("tournaments")
  .orderBy("dateTime", "asc")
  .onSnapshot(snapshot => {
    const list = document.getElementById("tournamentList");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const t = doc.data();

      const div = document.createElement("div");
      div.className = "tournament";

      div.innerHTML = `
        <b>${t.name}</b><br>
        <small>${new Date(t.dateTime.seconds * 1000).toLocaleString()}</small>
        <br>
        <button class="danger" onclick="deleteTournament('${doc.id}')">Delete</button>
        <div id="players-${doc.id}">Loading players...</div>
      `;

      list.appendChild(div);
      loadPlayers(doc.id);
    });

    if (snapshot.empty) {
      list.innerHTML = "No tournaments yet.";
    }
  });

// Delete tournament
function deleteTournament(id) {
  if (!confirm("Delete this tournament?")) return;

  db.collection("tournaments").doc(id).delete();
}

// Load players per tournament
function loadPlayers(tournamentId) {
  const box = document.getElementById(`players-${tournamentId}`);

  db.collection("registrations")
    .where("tournamentId", "==", tournamentId)
    .onSnapshot(snap => {
      if (snap.empty) {
        box.innerHTML = "<i>No participants</i>";
        return;
      }

      let html = "<ul>";
      snap.forEach(d => {
        const p = d.data();
        html += `<li>${p.name} — UID: ${p.uid}</li>`;
      });
      html += "</ul>";

      box.innerHTML = html;
    });
    }
