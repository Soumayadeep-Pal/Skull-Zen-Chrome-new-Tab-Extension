let shortcut_data = [];
let create_shortcut;
const videoUrl = "img/bg.mp4";
// Get the width of the viewport
const winwid = window.innerWidth;

// Get the height of the viewport
const winhgt = window.innerHeight;
$(document).ready(function () {
	const sw = screen.width;
	const scale = sw / 1920;
	$("body").css("--scale", scale);

	if ($("#bgVdo").length === 0) {
		const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
		videoElement.attr("src", videoUrl);
		videoElement.on("error", () => console.error("Video failed to load!"));
videoElement.on("stalled", () => {
    console.warn("Video stalled, reloading...");
    videoElement[0].load();
    videoElement[0].play();
});

		$("body").prepend(videoElement);
	}

	// api.gameograf
fetch("https://api.gameograf.com/js/shortcuts.json")
    .then(response => response.json())
    .then(data => {
        // Güncel veriyi kullan
        shortcut_data = data;

        // Güncel veriyi localStorage'a kaydet (istersen)
        localStorage.setItem("shortcuts", JSON.stringify(data));

        createShortcuts();
    })
    .catch(error => {
        console.error("Shortcuts could not be loaded from server:", error);

        // Eğer fetch başarısızsa, localStorage'daki eski veriyi kullan
        const stored_links = JSON.parse(localStorage.getItem("shortcuts"));
        shortcut_data = stored_links !== null ? stored_links : [];

        createShortcuts();
    });

activateClock();
createShortcuts();
handleSearch();
handleCustomBackground();
});

function activateClock() {
	const time_element = $("#time");
	const today_element = $("#today");

	function updateClock() {
		let date = new Date();
		let hh = date.getHours();
		let mm = date.getMinutes();
		let ss = date.getSeconds();
		let session = "AM";

		if (hh >= 12) session = "PM";
		if (hh == 0) hh = 12;
		if (hh > 12) hh -= 12;

		hh = hh < 10 ? "0" + hh : hh;
		mm = mm < 10 ? "0" + mm : mm;
		ss = ss < 10 ? "0" + ss : ss;

		time_element.text(`${hh}:${mm}:${ss} ${session}`);

		const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const monthArray = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		const todayStr = `${dayArray[date.getDay()]}, ${monthArray[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

		if (today_element.text() !== todayStr) {
			today_element.text(todayStr);
		}

		setTimeout(updateClock, 1000);
	}

	updateClock();
}

function createShortcuts() {
	const shortcut_element = $("#shortcutContainer");
	let add_shortcut = $("#addShortcut");
	let add_name = $("#addName");
	let add_url = $("#addUrl");
	let append_shortcut = $("#appendShortcut");

	shortcut_element.empty();

	shortcut_data.forEach((link) => {
		const icon_url = link.icon ? link.icon : `https://www.google.com/s2/favicons?domain=${link.url}&sz=48`;
		const element = `
			<div class="link">
				<a href="${link.url}" rel="noopener noreferrer" title="${link.url}" class="shortcutLink">
					<img src="${icon_url}" alt="${link.name} icon" />
					<p>${link.name}</p>
				</a>
				<a class="removeLink" title="Delete ${link.name} shortcut" removeLink="${link.url}">
					<span class="material-symbols-outlined">close</span>
				</a>
			</div>`;
		shortcut_element.append(element);
	});

	const createButton = `
		<div class="link">
			<a id="createShortcut" title="Add new shortcut" class="shortcutLink">
				<span class="material-symbols-outlined">add</span>
				<p>Add</p>
			</a>
		</div>`;
	shortcut_element.append(createButton);
create_shortcut = $("#createShortcut");
create_shortcut.click(function () {
    const btnOffset = $(this).offset(); // Get Add button position
    const btnHeight = $(this).outerHeight();
    const btnWidth = $(this).outerWidth();

    // Show the form beside the button
    add_shortcut.css({
       top: btnOffset.top,  // 10px gap below button
        left: btnOffset.left+btnWidth+10,                // Align with button's left
        position: "absolute"
        
    }).fadeIn(10); // Smooth show
});
	append_shortcut.click(() => {
    let link_name = add_name.val().trim();
    let link_url = add_url.val().trim();

    if (link_name && link_url) {
        if (!link_url.startsWith("http")) {
            link_url = `http://${link_url}`;
        }

        // Add to data and localStorage
        shortcut_data.push({ name: link_name, url: link_url });
        localStorage.setItem("shortcuts", JSON.stringify(shortcut_data));

        // Refresh shortcuts
        createShortcuts();

        // Clear input fields
        add_name.val("");
        add_url.val("");

        // Hide the Add Shortcut window
        add_shortcut.fadeOut(10);
    }
});
// Enable Enter key to trigger Add button
add_name.add(add_url).keypress(function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission or page refresh
        append_shortcut.click(); // Trigger Add button click
    }
});


	$(document).on("click", ".removeLink", function (e) {
		e.preventDefault();
		const linkToRemove = $(this).attr("removeLink");
		shortcut_data = shortcut_data.filter(link => link.url !== linkToRemove);
		localStorage.setItem("shortcuts", JSON.stringify(shortcut_data));
		createShortcuts();
	});
  $(document).mouseup(function (e) {
    if (!add_shortcut.is(e.target) && add_shortcut.has(e.target).length === 0 &&
        !create_shortcut.is(e.target)) {
        add_shortcut.fadeOut(200);
    }
});
}

function handleSearch() {
	const search_trigger = $("#searchTrigger");
	const search_input = $("#searchInput");

	search_input.keyup((e) => {
		if (e.keyCode === 13) {
			search_trigger.click();
		}
	});

	search_trigger.click(() => {
		const query = search_input.val();
		if (query) {
			chrome.search.query({ text: query }, function (results) {
				if (results && results.length > 0) {
					window.location.href = results[0].url;
				}
			});
		} else {
			search_input.attr("placeholder", "Enter something to search");
			setTimeout(() => search_input.attr("placeholder", "Search"), 2000);
		}
	});
}

function handleCustomBackground() {
	const add_custom = $("#addCustom");
	const remove_custom = $("#removeCustom");

	add_custom.click(() => {
		const file_input = $('<input type="file" accept="image/*" />');
		file_input.trigger("click");
		file_input.change(() => {
			const file = file_input[0].files[0];
			if (file.size > 3500000) {
				alert("File size is too big. Maximum is 3MB.");
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				custom_img = reader.result;
				localStorage.setItem("customImg", reader.result);
				setBackground();
			};
			reader.readAsDataURL(file);
		});
	});

	remove_custom.click(() => {
		custom_img = null;
		localStorage.removeItem("customImg");
		setBackground();
	});
}

function getRandomColor() {
    const colors = ["#FFD700", "#FFB6C1", "#ADFF2F", "#87CEFA", "#FFA07A", "#DA70D6"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createStickyNote(data = {}) {
    // Eğer id yoksa yeni id üret (timestamp kullanabiliriz)
    const id = data.id || Date.now().toString();

    const note = document.createElement("div");
    note.className = "sticky-note";
    note.style.backgroundColor = data.color || getRandomColor();

    // Eğer konum varsa uygula yoksa rastgele
    note.style.left = data.left || `${Math.random() * 500}px`;
    note.style.top = data.top || `${Math.random() * 300}px`;
    note.dataset.id = id;

    const header = document.createElement("div");
    header.className = "sticky-header";

    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.className = "sticky-button";
    addBtn.onclick = () => createStickyNote();

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.className = "sticky-button";
    closeBtn.onclick = () => {
        if (!textarea.value.trim() || confirm("Delete this note?")) {
            note.remove();
            saveNotes();
        }
    };

    header.appendChild(addBtn);
    header.appendChild(closeBtn);

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Write something...";
    textarea.value = data.content || "";
    textarea.addEventListener("input", saveNotes);

    note.appendChild(header);
    note.appendChild(textarea);
    document.body.appendChild(note);

    makeDraggable(note);
    saveNotes();
}

function makeDraggable(el) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    const header = el.querySelector(".sticky-header");
    if (!header) return;

    header.style.cursor = "move";

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.zIndex = 9999;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            el.style.zIndex = "";

            // Sürükleme bittiğinde kaydet
            saveNotes();
        }
    });
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll(".sticky-note")).map(note => ({
        id: note.dataset.id,
        content: note.querySelector("textarea").value,
        color: note.style.backgroundColor,
        left: note.style.left,
        top: note.style.top
    }));
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("stickyNotes") || "[]");
    notes.forEach(data => createStickyNote(data));
}

document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
});

 const API_KEY = (window.APP_CONFIG && window.APP_CONFIG.GEMINI_API_KEY) || ""; // set in js/config.js (see config.example.js)
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

    const container = document.getElementById("typing-container");
	const messages = [
      "Welcome back!",
      "Stay focused, stay sharp ⚡",
      "Your productivity hub 🚀",
      "Code. Create. Repeat."
    ];
	let msgIndex = 0;
    async function getGeminiText() {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Give me a short futuristic tech-style motivational message (max 10 words) with imoji." }] }]
          })
        });
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "System Ready ✅";
      } catch (err) {
        console.error("Gemini API error:", err);
        return "AI Offline ⚠️";
      }
    }
// 1. Welcome back! \n 2.Your productivity hub 🚀 \n 3.Stay focused, stay sharp ⚡4. Code. Create. Innovate💡
    function animateText(text) {
     if(text=="System Ready ✅")
	 {
		 container.innerHTML = ""; // clear old message
      const text = messages[msgIndex];
      
      [...text].forEach((char, i) => {
        const span = document.createElement("span");
        // preserve spaces
        span.innerHTML = char === " " ? "&nbsp;" : char;
        span.classList.add("letter");
        span.style.animationDelay = `${i * 0.07}s`; // wave delay
        container.appendChild(span);
      });

      // Show next after delay
      setTimeout(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        showMessage();
      }, text.length * 90 + 2500);
	 }
	 else
	 {
		container.innerHTML = "";
      [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.innerHTML = char === " " ? "&nbsp;" : char;
        span.classList.add("letter");
        span.style.animationDelay = `${i * 0.07}s`;
        container.appendChild(span);
      });
	 }
    }

    async function cycleMessages() {
      const text = await getGeminiText();
	  
      animateText(text);
      setTimeout(cycleMessages, 6000); // fetch a new one every 6 seconds
    }

    document.addEventListener("DOMContentLoaded", cycleMessages);


// 📍 Get current city, state & country with Google Maps link
// function loadLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       let lat = pos.coords.latitude;
//       let lon = pos.coords.longitude;

//       try {
//         // Reverse geocoding API
//         let res = await fetch(
//           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
//         );
//         let data = await res.json();

//         let city = data.city || data.locality || "Unknown City";
//         let state = data.principalSubdivision || "Unknown State";
//         let country = data.countryName || "Unknown Country";

//         // Create Google Maps link
//         let mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

//         document.getElementById("city-country").innerHTML =
//           `<a href="${mapsUrl}" target="_blank">${city}, ${state}, ${country}</a>`;
//       } catch (e) {
//         document.getElementById("city-country").innerText = "Location unavailable";
//       }
//     });
//   } else {
//     document.getElementById("city-country").innerText = "Geolocation not supported.";
//   }
// }

// loadLocation();
const weatherApiKey = (window.APP_CONFIG && window.APP_CONFIG.OPENWEATHER_API_KEY) || ""; // set in js/config.js

  async function getWeather(lat, lon) {
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
      );
      let data = await res.json();

      let temp = Math.round(data.main.temp);
      let condition = data.weather[0].main; // e.g. "Clear", "Clouds", "Rain"

      // Small emoji icons for clarity
      let icon = "🌍";
      if (condition === "Clear") icon = "☀️";
      else if (condition === "Clouds") icon = "☁️";
      else if (condition === "Rain") icon = "🌧️";
      else if (condition === "Mist" || condition === "Fog") icon = "🌫️";
      else if (condition === "Snow") icon = "❄️";
      else if (condition === "Thunderstorm") icon = "⛈️";

      document.getElementById("weather-widget").innerHTML =
        `${icon} ${temp}°C | ${condition}`;
    } catch (e) {
      document.getElementById("weather-widget").innerText = "Weather unavailable";
    }
  }

  async function loadLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        try {
          // Reverse geocoding API
          let res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          let data = await res.json();

          let city = data.city || data.locality || "Unknown City";
          let state = data.principalSubdivision || "Unknown State";
          let country = data.countryName || "Unknown Country";

          // Create Google Maps link
          let mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

          document.getElementById("city-country").innerHTML =
            `<a href="${mapsUrl}" target="_blank">${city}, ${state}, ${country}</a>`;

          // Fetch weather using lat/lon
          getWeather(lat, lon);

        } catch (e) {
          document.getElementById("city-country").innerText = "Location unavailable";
        }
      });
    } else {
      document.getElementById("city-country").innerText = "Geolocation not supported.";
    }
  }

  loadLocation();

    const launcher = document.querySelector('.launcher-btn');
    const circleMenu = document.getElementById('circleMenu');
    const circleApps = document.getElementById('circleApps');




    // Example Apps
    const apps = [
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756461552/Gmail_icon__2020.svg_pzytmj.webp", name: "Gmail", url: "https://mail.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756462427/Google_Drive_icon__2020.svg_qqtlo6.webp", name: "Drive", url: "https://drive.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756458427/1384060_c77soa.png", name: "YouTube", url: "https://www.youtube.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756461930/Google_Translate_logo.svg_nzfxu4.png", name: "Translate", url: "https://translate.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756460903/Google_Shopping_Logo_2025.svg_xcpmsy.png", name: "Shopping", url: "https://www.google.com/shopping/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756460820/Google_Chat_icon__2023.svg_njb8fw.png", name: "Chat", url: "https://mail.google.com/chat/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756463034/Google_Calendar_icon__2020.svg_raeixp.png", name: "Calender", url: "https://calendar.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756463413/google-finance_d4pm5x.webp", name: "Finance", url: "https://www.google.com/finance/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756471670/img.icons8_lihcp4.png", name: "Meet", url: "https://photos.google.com" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756471913/Google_Photos_icon__2020.svg_pfu5pa.png", name: "Photos", url: "https://photos.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756473421/2642502_g2fhf0.png", name: "Maps", url: "https://www.google.com/maps/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476368/20191031145551_Google_Earth_icon.svg_dd5iq8.png", name: "Earth", url: "https://earth.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474005/5968517_qbw8ax.png", name: "Docs", url: "https://docs.google.com/document/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474047/5968557_lhkrli.png", name: "Sheets", url: "https://docs.google.com/spreadsheets/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474112/slides_e8yoa5.svg", name: "Slides", url: "https://docs.google.com/presentation/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474261/google-my-business-icon_roo8yq.png", name: "Business Profile Manager", url: "https://business.google.com/in/business-profile/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474861/Google_Contacts_icon__2022.svg_mcy9be.png", name: "Contacts", url: "https://contacts.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474102/google-travel_vc51et.png", name: "Travels", url: "https://www.google.com/travel" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474162/300218_nxjdpc.png", name: "Play", url: "https://play.google.com/store/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756488857/img.icons8_ulgwld.png", name: "Classroom", url: "https://classroom.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756482190/281764_rdhcsj.png", name: "Search", url: "https://www.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476793/google-gemini-icon_bn3bwk.png", name: "Gemini", url: "https://gemini.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756482409/images_cpiknk.png", name: "NotebookLm", url: "https://notebooklm.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756484845/1721667_xyr5i3.webp", name: "Analytics", url: "https://analytics.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474287/7612689_dcuwa5.png", name: "One", url: "https://one.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476901/Google_News_icon.svg_p8b1d9.png", name: "News", url: "https://news.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486354/google-password_cf0mkt.png", name: "PassWord", url: "https://passwords.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486702/3357685_s9e0oc.webp", name: "YouTube Music", url: "https://music.youtube.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486535/5968528_foqru9.png", name: "Form", url: "https://docs.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486578/google-books_tnztta.png", name: "Books", url: "https://books.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489970/img.icons8_cp4xuj.png", name: "Blogger", url: "https://www.blogger.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489017/img.icons8_gy2kwb.png", name: "Keep", url: "https://keep.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756490138/img.icons8_cy952y.png", name: "Saved", url: "https://www.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489106/Google_Tasks_2021.svg_lhlaso.png", name: "Task", url: "https://tasks.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489646/Google_Arts_and_Culture_Logo_q99u1n.png", name: "Arts and Culture", url: "https://artsandculture.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489436/img.icons8_zfjtd5.png", name: "My Ad Center", url: "https://myadcenter.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489316/img.icons8_ugtdsa.png", name: "Google Ads", url: "https://ads.google.com/" },
  { img: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489579/google-merchant-center_m2otk0.svg", name: "Merchant Center" , url: "https://business.google.com/" },
];

    function createLayers(apps) {
      const ringConfigs = [
        { count: 8, radius: 100 },
        { count: 12, radius: 200 },
        { count: 18, radius: 290 }
      ];

      let index = 0;
      ringConfigs.forEach(cfg => {
        const angleStep = 360 / cfg.count;
        for (let i = 0; i < cfg.count; i++) {
          if (index >= apps.length) return;
          const app = apps[index++];
          const angle = i * angleStep * (Math.PI / 180);

          const cx = 350, cy = 350; // circle center
          const x = cx + cfg.radius * Math.cos(angle);
          const y = cy + cfg.radius * Math.sin(angle);

          const div = document.createElement("div");
          div.className = "app";
          div.style.left = `${x}px`;
          div.style.top = `${y}px`;

          div.innerHTML = `
            <a href="${app.url}" >
              <img src="${app.img}" alt="${app.name}">
              <span>${app.name}</span>
            </a>
            
          `;
{/*  */}  
          div.addEventListener("click", (e) => e.stopPropagation());

          circleApps.appendChild(div);
        }
      });
    }

    createLayers(apps);

    // Toggle launcher
    const blurOverlay = document.getElementById('overlay');
// Open menu
launcher.addEventListener("click", (e) => {
  e.stopPropagation();
  circleMenu.classList.add("active");
   blurOverlay.classList.add('active');
  circleMenu.classList.remove("closing");
  launcher.style.display = "none"; // Hide launcher button
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (
    circleMenu.classList.contains("active") &&
    !circleMenu.contains(e.target) &&
    !launcher.contains(e.target)
  ) {
    circleMenu.classList.add("closing");
    circleMenu.classList.remove("active");
      blurOverlay.classList.remove('active');

    setTimeout(() => {
      launcher.style.display = "flex"; // Show launcher after animation
    }, 400); // Match slideOutLeft duration
  }
});



    // Rotation logic
    let rotation = 0;
    let velocity = 0;
    let dragging = false;
    let lastAngle = 0;

    function getAngle(x, y) {
      const rect = circleMenu.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
    }

    circleMenu.addEventListener("mousedown", (e) => {
      dragging = true;
      lastAngle = getAngle(e.clientX, e.clientY);
      velocity = 0;
    });

    document.addEventListener("mousemove", (e) => {
      if (dragging) {
        const angle = getAngle(e.clientX, e.clientY);
        let delta = angle - lastAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        rotation += delta;
        velocity = delta;
        lastAngle = angle;
      }
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });

    document.addEventListener("wheel", (e) => {
      rotation += e.deltaY * 0.1;
    });

    function animate() {
      if (!dragging) {
        rotation += velocity;
        velocity *= 0.95;
      }
      circleApps.style.transform = `rotate(${rotation}deg)`;
      document.querySelectorAll(".app").forEach(app => {
        app.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;
      });
      requestAnimationFrame(animate);
    }
    animate();

// Save apps to localStorage
function aiSaveApps() {
  localStorage.setItem("aiApps", JSON.stringify(aiApps));
}

// Load apps from localStorage
function aiLoadApps() {
  const stored = localStorage.getItem("aiApps");
  if (stored) {
    aiApps = JSON.parse(stored);
  }
}


const aiLauncher = document.getElementById('ai-launcher');
const aiCircleMenu = document.getElementById('ai-circleMenu');
const aiCircleApps = document.getElementById('ai-circleApps');
const aiAddModal = document.getElementById('ai-addModal');
const aiNameEl = document.getElementById('ai-appName');
const aiUrlEl = document.getElementById('ai-appUrl');
const aiCancelAdd = document.getElementById('ai-cancelAdd');
const aiConfirmAdd = document.getElementById('ai-confirmAdd');

const aiAddBtn = document.getElementById('aiAddBtn');

let aiApps = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/app?is_sa=1&is_sa=1&android-min-version=301356232&ios-min-version=322.0&campaign_id=bkws&utm_source=sem&utm_source=google&utm_medium=paid-media&utm_medium=cpc&utm_campaign=bkws&utm_campaign=2024enIN_gemfeb&pt=9008&mt=8&ct=p-growth-sem-bkws&gclsrc=aw.ds&gad_source=1&gad_campaignid=20357620749&gbraid=0AAAAApk5BhmOuK3Ohh9Q1O_QtRwJPGNbk&gclid=Cj0KCQjwh5vFBhCyARIsAHBx2wwaLshLVgkfIkYNb6fI8xngwrlRrjeHN2s6Rd27BkrIEYwPL9AoruAaArdZEALw_wcB' },
];
aiLoadApps(); // 🔥 Load saved apps if any
let aiRotation = 0, aiDragging = false, aiLastAngle = 0;

function aiGetAngle(x, y) {
  const rect = aiCircleMenu.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
}

// Drag rotation
aiCircleMenu.addEventListener("mousedown", e => {
  aiDragging = true;
  aiLastAngle = aiGetAngle(e.clientX, e.clientY);
});
document.addEventListener("mousemove", e => {
  if (aiDragging) {
    const angle = aiGetAngle(e.clientX, e.clientY);
    let delta = angle - aiLastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    aiRotation += delta;
    aiLastAngle = angle;
    aiApplyRotation();
  }
});
document.addEventListener("mouseup", () => aiDragging = false);

// Scroll rotation
document.addEventListener("wheel", e => {
  aiRotation += e.deltaY * 0.1;
  aiApplyRotation();
});

function aiApplyRotation() {
  aiCircleApps.style.transform = `translate(-50%, -50%) rotate(${aiRotation}deg)`;
  document.querySelectorAll('.ai-app').forEach(app => {
    app.style.transform = `translate(-50%, -50%) rotate(${-aiRotation}deg)`;
  });
}

// Launcher toggle
aiLauncher.addEventListener('click', e => {
  e.stopPropagation();
  aiCircleMenu.classList.add('ai-active');
  blurOverlay.classList.add('active');
  aiLauncher.style.display = 'none';
  aiLayout();
});
document.addEventListener('click', e => {
  if (aiCircleMenu.classList.contains('ai-active') &&
      !aiCircleMenu.contains(e.target) &&
      !aiAddModal.contains(e.target)) {
    aiCircleMenu.classList.remove('ai-active');
    blurOverlay.classList.remove('active');
    aiLauncher.style.display = 'flex';
  }
});

// Layout calculation
function aiLayout() {
  aiCircleApps.innerHTML = '';
  const ICON = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ai-icon'));
  const GAP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ai-gap'));
  const STEP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ai-ring-step'));
  const PAD = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ai-padding'));
  const HEX_PAD = 1 / Math.cos(Math.PI / 6);
  const items = [...aiApps];
  let index = 0, ring = 0, maxRadius = 0;
  const positions = [];

  while (index < items.length) {
    const r = ICON + ring * STEP + PAD +25; // 🔥 Extra 50px spacing from center
    const circumference = 2 * Math.PI * r;
    const slotSize = ICON + GAP;
    const capacity = Math.max(1, Math.floor(circumference / slotSize));
    const slice = (2 * Math.PI) / capacity;

    for (let i = 0; i < capacity && index < items.length; i++) {
      const angle = i * slice - Math.PI / 2;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      positions.push({ item: items[index++], x, y });
      maxRadius = Math.max(maxRadius, r);
    }
    ring++;
  }

  const newSize = maxRadius * 2 * HEX_PAD + ICON * 2;
  aiCircleMenu.style.width = `${newSize}px`;
  aiCircleMenu.style.height = `${newSize}px`;

  const cx = newSize / 2, cy = newSize / 2;
  positions.forEach(({ item, x, y }) => aiAddNode(item, cx + x, cy + y));

  aiApplyRotation();
}

// Add app node
aiConfirmAdd.addEventListener('click', () => {
  const name = aiNameEl.value.trim();
  const url = aiUrlEl.value.trim();
  if (!name || !url) return;

  // ✅ Prevent duplicates
  if (aiApps.some(app => app.url === url)) {
    alert("This app is already added!");
    return;
  }

  aiApps.push({ name, url });
  aiSaveApps(); // Save
  aiAddModal.style.display = 'none';
  aiLayout();
});


function aiAddNode(data, x, y) {
  const div = document.createElement('div');
  div.className = 'ai-app';
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  const icon_url = data.icon ? data.icon : `https://www.google.com/s2/favicons?domain=${data.url}&sz=48`;
  div.innerHTML = `
    <a href="${data.url}" target="_blank" rel="noopener noreferrer">
      <img src="${icon_url}" alt="${data.name}">
      <span>${data.name}</span>
    </a>
    <div class="ai-remove-btn">&times;</div>`;

  div.querySelector('.ai-remove-btn').addEventListener('click', e => {
    e.stopPropagation();
    aiApps = aiApps.filter(app => app.url !== data.url);
    aiSaveApps(); // 🔥 Save after removing
    aiLayout();
  });

  div.addEventListener('click', e => e.stopPropagation());
  aiCircleApps.appendChild(div);
}


// Add Center Button
function aiAddCenterButton() {
  const addBtn = document.getElementById('aiAddBtn');
  addBtn.innerHTML = `
    <img alt="Add" src="https://cdn-icons-png.flaticon.com/512/4174/4174487.png" />
  `;
  addBtn.onclick = (e) => {
    e.stopPropagation();
    aiOpenAddModal();
  };
}

// Modal logic
function aiOpenAddModal() {
  aiAddModal.style.display = 'grid';
  aiNameEl.value = '';
  aiUrlEl.value = '';
  aiNameEl.focus();
}
aiCancelAdd.addEventListener('click', () => aiAddModal.style.display = 'none');
aiAddModal.addEventListener('click', e => { if (e.target === aiAddModal) aiAddModal.style.display = 'none'; });
window.addEventListener('resize', () => {
  if (aiCircleMenu.classList.contains('ai-active')) aiLayout();
});

aiLayout();
aiAddCenterButton();


  // "https://raw.githubusercontent.com/mdn/content/main/files/en-us/_wikihistory.json"; 
 //"https://httpbin.org/post"; 
  // const downloadFile = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/_wikihistory.json"; 
  // const uploadTarget = "https://httpbin.org/post"; 
  const trials = 1;
  const refreshTime = 5000;

  async function measureDownloadOnce() {
    const startTime = Date.now();
    try {
      const response = await fetch(downloadFile + "?_=" + Math.random());
      const blob = await response.blob();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = blob.size * 8;
      return bitsLoaded / duration / 1024 / 1024;
    } catch {
      return null;
    }
  }

  async function measureUploadOnce() {
    const data = new Blob([new ArrayBuffer(500000)]);
    const startTime = Date.now();
    try {
      await fetch(uploadTarget, { method: "POST", body: data });
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const bitsUploaded = data.size * 8;
      return bitsUploaded / duration / 1024 / 1024;
    } catch {
      return null;
    }
  }

  let lastDownloadSpeed = 0;
  let lastUploadSpeed = 0;

  function updateGauges(downloadSpeed, uploadSpeed) {
    const downloadNeedle = document.getElementById('download-needle');
    const uploadNeedle = document.getElementById('upload-needle');
    const downloadValueText = document.getElementById('download-value');
    const uploadValueText = document.getElementById('upload-value');

    const maxDownloadSpeed = 200;
    const cappedDownloadSpeed = Math.min(downloadSpeed, maxDownloadSpeed);
    const downloadAngle = (cappedDownloadSpeed / maxDownloadSpeed) * 360 - 90;
    downloadNeedle.style.transform = `translateX(-50%) rotate(${downloadAngle}deg)`;

    downloadValueText.innerHTML = (downloadSpeed === null || isNaN(downloadSpeed)) 
      ? `Error <span class="speed-unit"></span>`
      : `${downloadSpeed.toFixed(2)} <span class="speed-unit">Mbps</span>`;

    const maxUploadSpeed = 50;
    const cappedUploadSpeed = Math.min(uploadSpeed, maxUploadSpeed);
    const uploadAngle = (cappedUploadSpeed / maxUploadSpeed) * 180 - 90;
    uploadNeedle.style.transform = `translateX(-50%) rotate(${uploadAngle}deg)`;

    uploadValueText.innerHTML = (uploadSpeed === null || isNaN(uploadSpeed))
      ? `Error <span class="speed-unit"></span>`
      : `${uploadSpeed.toFixed(2)} <span class="speed-unit">Mbps</span>`;
  }

  async function measureDownloadSpeed() {
    let results = [];
    for (let i = 0; i < trials; i++) {
      let speed = await measureDownloadOnce();
      if (speed) results.push(speed);
    }
    lastDownloadSpeed = results.length > 0 ? results.reduce((a,b) => a+b, 0) / results.length : null;
  }

  async function measureUploadSpeed() {
    let results = [];
    for (let i = 0; i < trials; i++) {
      let speed = await measureUploadOnce();
      if (speed) results.push(speed);
    }
    lastUploadSpeed = results.length > 0 ? results.reduce((a,b) => a+b, 0) / results.length : null;
  }

  function createGaugeLabels() {
    const scale = document.getElementById("gauge-scale");
    scale.innerHTML = "";

    const maxSpeed = 200;
    const step = 20; // fewer ticks for smaller gauge

    for (let value = 0; value < maxSpeed; value += step) {
      const angle = (value / maxSpeed) * 360 +180;
      const radius = 45;

      const x = 50 + radius * Math.cos(angle * Math.PI / 180);
      const y = 50 + radius * Math.sin(angle * Math.PI / 180);
      
      const tick = document.createElement("div");
      tick.className = "gauge-tick";
      tick.style.left = `${x}px`;
      tick.style.top = `${y}px`;
      tick.textContent = value;
      scale.appendChild(tick);
    }
  }

  async function runTest() {
    updateGauges(lastDownloadSpeed, lastUploadSpeed);
    await Promise.all([measureDownloadSpeed(), measureUploadSpeed()]);
    updateGauges(lastDownloadSpeed, lastUploadSpeed);
  }

  runTest();
  setInterval(runTest, refreshTime);
  createGaugeLabels();

    const barFill = document.getElementById("barFill");
    const barLabel = document.getElementById("barLabel");

    function bytesToMB(b) {
      return (b / (1024 * 1024));
    }
    function formatMB(b) {
      return `${bytesToMB(b).toFixed(2)} MB`;
    }

    function updateHeapBar() {
      if (window.performance && performance.memory) {
        const mem = performance.memory;
        const used = mem.usedJSHeapSize || 0;
        const total = mem.totalJSHeapSize || 1; // avoid div by 0
        const percent = Math.min((used / total) * 100, 100);

        barFill.style.width = percent + "%";
        barLabel.textContent = `Memory Used: ${formatMB(used)} / ${formatMB(total)} - ${percent.toFixed(1)}%`;
      } else {
        barLabel.textContent = "Not available";
        barFill.style.width = "0%";
      }
    }

    // update every 1 second
    updateHeapBar();
    setInterval(updateHeapBar, 1000);



     const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
      alert("WebGL not supported by your browser");
    }

    // 🔹 GPU Name Cleaning Function
   function cleanGPUName(rawName) {
  if (!rawName) return "Unknown GPU";
  return rawName
    .replace(/^ANGLE \(/, "")        // remove "ANGLE ("
    .replace(/\)$/, "")              // remove trailing ")"
    .replace(/Direct3D.+/, "")       // remove Direct3D info
    .replace(/\(0x[0-9A-Fa-f]+\)/, "") // remove hex IDs like (0x00009A49)
    .trim();
}


    // 🔹 Get GPU Info
    let gpuInfo = "Unknown";
    const dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbgRenderInfo) {
      gpuInfo = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
      gpuInfo = cleanGPUName(gpuInfo);
    }
    document.getElementById("gpu").textContent = "GPU: " + gpuInfo;

    // 🔹 Simple Shader Program (to stress GPU a bit)
    const vsSource = `
      attribute vec4 aPosition;
      void main(void) {
        gl_Position = aPosition;
      }
    `;
    const fsSource = `
      precision highp float;
      uniform float time;
      void main(void) {
        // Heavy fragment shader: fractal-like color pattern
        vec2 uv = gl_FragCoord.xy / 500.0;
        float c = 0.0;
        for (int i = 0; i < 20; i++) {
          uv = abs(uv) / dot(uv, uv) - 0.5;
          c += 0.01;
        }
        gl_FragColor = vec4(sin(time + c), cos(time + c), sin(c), 1.0);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error: " + gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 🔹 Geometry (full screen quad)
    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "time");

    // 🔹 FPS + Frame Time Measurement
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;

    function draw() {
      const now = performance.now();
      const delta = now - lastTime;
      frames++;

      if (delta >= 1000) {
        fps = frames;
        document.getElementById("fps").textContent = "FPS: " + fps;
        document.getElementById("frametime").textContent = "Frame Time: " + (1000 / fps).toFixed(2) + " ms";
        frames = 0;
        lastTime = now;
      }

      gl.uniform1f(uTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(draw);
    }
    draw();

     navigator.getBattery().then(function(battery) {
      function updateBatteryInfo() {
        let level = Math.floor(battery.level * 100);
        let batteryLevel = document.getElementById("batteryLevel");
        let batteryText = document.getElementById("batteryText");
        let warningText = document.getElementById("warningText");
        let batterytip = document.getElementById("batterytip");

        // Update width
        batteryLevel.style.width = level + "%";
        batteryText.textContent =  level + "% " + (battery.charging ? "⚡" : "");

        // Check low battery condition
        if (level <= 20 && !battery.charging) {
          batteryLevel.style.background = "red";
          warningText.style.display = "block";
          batterytip.style.background="red";
        }
        else {
          batteryLevel.style.background = "linear-gradient(90deg, #00ff0d, #ffee00)";
          warningText.style.display = "none";
          
        }
      }

      updateBatteryInfo();

      // Update when battery changes
      battery.addEventListener("levelchange", updateBatteryInfo);
      battery.addEventListener("chargingchange", updateBatteryInfo);
    });