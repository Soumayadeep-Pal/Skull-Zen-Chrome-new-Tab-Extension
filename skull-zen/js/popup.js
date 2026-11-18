document.getElementById("uninstall-link").addEventListener("click", (event) => {
    event.preventDefault(); 
    if (confirm("Are you sure you want to remove this extension?")) {
        chrome.management.uninstallSelf({ showConfirmDialog: false }, () => {
            alert("The extension was removed successfully.");
        });
    }
});
// document.getElementById("espal").addEventListener("click", function() {

//     let extensionId = chrome.runtime.id; 
//     let url = `https://soumayadeep-portfolio.netlify.app`;

//     window.open(url, "_blank");
// });


document.getElementById("espal").addEventListener("click", function() {

    window.open("https://soumayadeep-portfolio.netlify.app/", "_blank");
});


// document.getElementById("privacy-policy").addEventListener("click", function() {
    
//     window.open("https://gameograf.com/privacy-policy", "_blank");
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const popupContainer = document.getElementById("remote-popup");

//     // Last notification time is kept in LocalStorage
//     const lastShownKey = "popupLastShown";

//     fetch("https://api.gameograf.com/popup/message.json")
//         .then((res) => {
//             if (!res.ok) throw new Error("Failed to retrieve notification data");
//             return res.json(); // JSON: { html: "...", timestamp: 1715376642000 }
//         })
//         .then((data) => {
//             const { html, timestamp } = data;
//             const lastShown = parseInt(localStorage.getItem(lastShownKey) || "0");

//             if (timestamp > lastShown) {
//                 popupContainer.innerHTML = html;

//                 const closeBtn = document.createElement("button");
//                 closeBtn.classList.add("close-btn");
//                 closeBtn.innerHTML = "&times;";
//                 closeBtn.onclick = () => popupContainer.style.display = "none";
//                 popupContainer.appendChild(closeBtn);

//                 popupContainer.style.display = "block";

//                 // Update timestamp as new shown
//                 localStorage.setItem(lastShownKey, timestamp.toString());
//             }
//         })
//         .catch((err) => {
//             console.error("Notification check failed:", err);
//         });
// });


// popup.js sonuna ekle
const closeBtn = document.createElement("button");

closeBtn.style.position = "absolute";
closeBtn.style.top = "5px";
closeBtn.style.right = "10px";
closeBtn.style.border = "none";
closeBtn.style.background = "transparent";
closeBtn.style.fontSize = "18px";
closeBtn.style.cursor = "pointer";
closeBtn.addEventListener("click", () => {
    popupContainer.style.display = "none";
});

popupContainer.appendChild(closeBtn);
// Sticky Note özelliği için yeni not oluşturma butonu
document.getElementById("newNoteButton")?.addEventListener("click", () => {
    // sticky-notes.js dosyasındaki fonksiyon
    createStickyNote();
});
