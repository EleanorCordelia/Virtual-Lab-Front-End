function handleResponse(response) {
  if (response === "yes") {
    alert("True");
  } else if (response === "no") {
    alert("False");
  } else {
    alert("Unknown response");
  }
}

// Menghandle dragstart event
document.querySelectorAll(".response-image").forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.currentTarget.id);
  });
});

// Menghandle dragover event agar area drop bisa menerima item yang didrag
document.querySelector(".drag-area").addEventListener("dragover", (event) => {
  event.preventDefault(); // Mencegah default agar bisa di-drop
});

// Menghandle drop event untuk menangani saat item dilepas di dalam drop area
document.querySelector(".drag-area").addEventListener("drop", (event) => {
  event.preventDefault(); // Mencegah default

  // Ambil data dari item yang sedang didrag
  const draggedElementId = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedElementId);

  // Tampilkan aksi sesuai dengan elemen yang didrop (yes atau no)
  handleResponse(draggedElementId === "yes" ? "yes" : "no");

  // Tambahkan elemen yang di-drag ke dalam drag area (opsional)
  event.target.appendChild(draggedElement.cloneNode(true)); // Clone dan append item yang di-drop
});
