const firebaseConfig = {
  apiKey: "AIzaSyDo4A20fN1l3YAO36h8SkP32lEMEOFBMf0",
  authDomain: "rh-tournament-system.firebaseapp.com",
  projectId: "rh-tournament-system"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function addTournament(){
  const name = tname.value.trim();
  const time = ttime.value;
  if(!name || !time) return alert("Fill all fields");

  db.collection("tournaments").add({
    name,
    time,
    created: Date.now()
  });
}

db.collection("tournaments").orderBy("created","desc")
.onSnapshot(snapshot=>{
  tournamentList.innerHTML="";
  snapshot.forEach(doc=>{
    const t = doc.data();
    tournamentList.innerHTML += `
      <div class="tournament">
        <b>${t.name}</b><br>
        <small>${new Date(t.time).toLocaleString()}</small>

        <table>
          <tr><th>#</th><th>Name</th><th>UID</th></tr>
          <tbody id="p-${doc.id}"></tbody>
        </table>

        <button onclick="deleteTournament('${doc.id}')">Delete</button>
      </div>
    `;

    db.collection("participants")
    .where("tournamentId","==",doc.id)
    .onSnapshot(pSnap=>{
      let rows="";
      let i=1;
      pSnap.forEach(p=>{
        const d=p.data();
        rows+=`<tr><td>${i++}</td><td>${d.name}</td><td>${d.uid}</td></tr>`;
      });
      document.getElementById("p-"+doc.id).innerHTML=rows;
    });
  });
});

function deleteTournament(id){
  if(confirm("Delete tournament?")){
    db.collection("tournaments").doc(id).delete();
  }
                }
