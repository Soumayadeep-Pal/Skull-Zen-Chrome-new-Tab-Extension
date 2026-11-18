chrome.runtime.onInstalled.addListener(function() {
  //chrome.tabs.create({ url: "https://chromewallpaper.com/"});
 
});


if(chrome.runtime.setUninstallURL) {
  //chrome.runtime.setUninstallURL('https://chromewallpaper.com/');
} else {
}
indexedDB.databases().then((dbs) => {
      dbs.forEach((db) => {
        indexedDB.deleteDatabase(db.name);
        console.log(`Deleted IndexedDB database: ${db.name}`);
      });
    });