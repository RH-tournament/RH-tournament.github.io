const firebaseConfig = {
  apiKey: "AIzaSyDo4A20fN1l3YAO36h8SkP32lEMEOFBMf0",
  authDomain: "rh-tournament-system.firebaseapp.com",
  projectId: "rh-tournament-system"
};

// 🔐 prevent double init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const tournamentSelect = document.getElementById("tournament");
const countDiv = document.getElementById("count");
const successDiv = document.getElementById("success");

// Load tournaments
db.collection("tournaments").onSnapshot(snap=>{
  tournamentSelect.innerHTML="";
  snap.forEach(doc=>{
    tournamentSelect.innerHTML +=
      `<option value="${doc.id}">${doc.data().name}</option>`;
  });
  updateCount();
});

// Count participants
function updateCount(){
  const tId = tournamentSelect.value;
  if(!tId) return;

  db.collection("participants")
    .where("tournamentId","==",tId)
    .onSnapshot(snap=>{
      countDiv.innerText = `Total Participants: ${snap.size}`;
    });
}

tournamentSelect.addEventListener("change", updateCount);

// Register function
function register(){
  const tId = tournamentSelect.value;
  const name = document.getElementById("name").value.trim();
  const uid = document.getElementById("uid").value.trim();

  successDiv.style.display="none";

  if(!tId || !name || !uid){
    alert("Fill all fields");
    return;
  }

  if(!/^\d+$/.test(uid)){
    alert("UID must be numbers only");
    return;
  }

  // 🔒 duplicate UID block
  db.collection("participants")
    .where("tournamentId","==",tId)
    .where("uid","==",uid)
    .get()
    .then(res=>{
      if(!res.empty){
        alert("This UID already registered");
        return;
      }

      // ✅ REAL SAVE
      return db.collection("participants").add({
        tournamentId: tId,
        name: name,
        uid: uid,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(()=>{
      document.getElementById("name").value="";
      document.getElementById("uid").value="";
      successDiv.style.display="block";
    })
    .catch(err=>{
      alert("Error: " + err.message);
    });
                   }
