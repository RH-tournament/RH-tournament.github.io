const firebaseConfig = {
  apiKey: "AIzaSyDo4A20fN1l3YAO36h8SkP32lEMEOFBMf0",
  authDomain: "rh-tournament-system.firebaseapp.com",
  projectId: "rh-tournament-system"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.collection("tournaments").onSnapshot(snap=>{
  tournament.innerHTML="";
  snap.forEach(doc=>{
    tournament.innerHTML+=`<option value="${doc.id}">${doc.data().name}</option>`;
  });
});

function register(){
  const tId = tournament.value;
  const nameVal = name.value.trim();
  const uidVal = uid.value.trim();

  if(!/^\d+$/.test(uidVal)) return alert("UID must be numbers");

  db.collection("participants")
  .where("tournamentId","==",tId)
  .where("uid","==",uidVal)
  .get().then(res=>{
    if(!res.empty) return alert("UID already registered");

    db.collection("participants").add({
      tournamentId:tId,
      name:nameVal,
      uid:uidVal,
      time:Date.now()
    }).then(()=>{
      alert("Registration Successful");
      name.value="";
      uid.value="";
    });
  });
}
