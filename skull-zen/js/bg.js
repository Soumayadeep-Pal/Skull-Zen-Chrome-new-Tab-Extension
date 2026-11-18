chrome.runtime.onInstalled.addListener(function() {

  chrome.tabs.create({ 
    url: "#" 
  });

  chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
});

if (chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL('#');
} else {
  console.warn("setUninstallURL not supported in this browser.");
}

indexedDB.databases().then((dbs) => {
  dbs.forEach((db) => {
    indexedDB.deleteDatabase(db.name);
    console.log(`Deleted IndexedDB database: ${db.name}`);
  });
});


// // Fetch Chrome RAM info
// function getChromeMemory() {
//   return new Promise((resolve) => {
//     chrome.system.memory.getInfo((info) => {
//       resolve({
//         total: (info.capacity / (1024*1024*1024)).toFixed(2) + " GB",
//         available: (info.availableCapacity / (1024*1024*1024)).toFixed(2) + " GB"
//       });
//     });
//   });
// }

// // Fetch Google account storage quota
// function getGoogleQuota() {
//   return new Promise((resolve, reject) => {
//     chrome.identity.getAuthToken({interactive: true}, function(token) {
//       if (chrome.runtime.lastError || !token) {
//         reject(chrome.runtime.lastError);
//         return;
//       }

//       fetch("https://www.googleapis.com/drive/v3/about?fields=storageQuota", {
//         headers: { Authorization: "Bearer " + token }
//       })
//       .then(res => res.json())
//       .then(data => {
//         resolve({
//           used: (data.storageQuota.usage / (1024*1024*1024)).toFixed(2) + " GB",
//           total: (data.storageQuota.limit / (1024*1024*1024)).toFixed(2) + " GB"
//         });
//       })
//       .catch(err => reject(err));
//     });
//   });
// }

// // Listen for requests from newtab.html
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "getData") {
//     Promise.all([getChromeMemory(), getGoogleQuota()])
//       .then(([chromeMem, googleQuota]) => {
//         sendResponse({ chromeMem, googleQuota });
//       })
//       .catch(err => sendResponse({ error: err.message }));
//     return true; // keep async response alive
//   }
// });
