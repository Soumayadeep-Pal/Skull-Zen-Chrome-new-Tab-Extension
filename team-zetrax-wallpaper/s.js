const theme = "space";
const total_images = 10;
let custom_img;
let resource_available = false;
const links = [
    {
        name: "Play Games",
        url: "https://yowgames.com/games/",
    },
    {
        name: "Youtube",
        url: "https://www.youtube.com",
    },
    {
        name: "Amazon",
        url: "https://www.amazon.com",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com",
    },
    {
        name: "X",
        url: "https://x.com",
    },
    {
        name: "Netflix",
        url: "https://www.netflix.com",
    },
];
let stored_links = JSON.parse(localStorage.getItem("shortcuts"));
let shortcut_data = stored_links !== null ? stored_links : links;
let remove_link_button;
let create_shortcut;

// Video arka plan ayarı
const videoUrl = "img/bg.webm";

// Video elementini oluştur ve arka plana ekle
$(document).ready(function () {
    const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
    videoElement.attr('src', videoUrl);
    $('body').prepend(videoElement);

    // Diğer işlemler burada devam eder (kısayollar, saat, arama işlevi)
});

// Run after the page is loaded
$(document).ready(function () {
    const sw = screen.width;
    const scale = 1410 / 1920;
    $("body").css("--scale", scale);
    const bg_mode_toggle = $("#bgModeToggle");
    const img_mode = $("#imgMode");
    const add_custom = $("#addCustom");
    const remove_custom = $("#removeCustom");
    const search_trigger = $("#searchTrigger");
    const search_input = $("#searchInput");
    const voice_search = $("#voiceSearch");

    // Initialize the clock
    activateClock();

    // Initialize the shortcuts


    // Initialize the background
    function setBackground() {
        // Video element handling
        const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
        videoElement.attr('src', videoUrl);
        // Ensure no image background is applied
        $("body").css("--img", "");

        // Adding video to the body if not already added
        if ($("#bgVdo").length === 0) {
            $("body").prepend(videoElement);
        }
    }
    setBackground();

    // Enter key triggers search
    search_input.on("keyup", function (e) {
        if (e.key === "Enter") {
            search_trigger.click();
        }
    });

    // Search button click
    search_trigger.on("click", function () {
        const searchQuery = search_input.val().trim();

        if (searchQuery !== "") {
            const searchUrl =
                activeSearchUrl + encodeURIComponent(searchQuery);

            // New tab navigation (correct way)
            window.location.assign(searchUrl);
        } else {
            search_input.attr("placeholder", "Enter something to search");

            setTimeout(() => {
                search_input.attr("placeholder", "Search");
            }, 2000);
        }
    });


    // Handle the background mode
    bg_mode_toggle.click(() => {
        if (bg_mode == "img") {
            bg_mode = "img";
            localStorage.setItem("bgMode", "img");

            function setBackground() {
                // Video element handling
                const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
                videoElement.attr('src', videoUrl);
                // Ensure no image background is applied
                $("body").css("--img", "");

                // Adding video to the body if not already added
                if ($("#bgVdo").length === 0) {
                    $("body").prepend(videoElement);
                }
            }
            setBackground();
        }
    });

    // Handle the custom background upload
    add_custom.click(async () => {
        const file_input = $('<input type="file" accept="image/*" />');
        file_input.trigger("click");
        file_input.change(() => {
            const file = file_input[0].files[0];
            const file_type = file.type;
            const file_size = file.size;
            // max file size is 5MB
            if (file_size > 3500000) {
                alert("File size is too big. Maximum file size is 3MB.");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (file_type.includes("image")) {
                    custom_img = reader.result;
                    localStorage.setItem("customImg", reader.result);
                    img = getImage();

                    function setBackground() {
                        // Video element handling
                        const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
                        videoElement.attr('src', videoUrl);
                        // Ensure no image background is applied
                        $("body").css("--img", "");

                        // Adding video to the body if not already added
                        if ($("#bgVdo").length === 0) {
                            $("body").prepend(videoElement);
                        }
                    }
                    setBackground();
                }
            };
        });
    });

    // Handle the custom background remove
    remove_custom.click(() => {
        custom_img = null;
        localStorage.removeItem("customImg");

        function setBackground() {
            // Video element handling
            const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
            videoElement.attr('src', videoUrl);
            // Ensure no image background is applied
            $("body").css("--img", "");

            // Adding video to the body if not already added
            if ($("#bgVdo").length === 0) {
                $("body").prepend(videoElement);
            }
        }
        setBackground();
    });
});

// Handle the clock
function activateClock() {
    const time_element = $("#time");
    const today_element = $("#today");
    let date = new Date();

    // Tarayıcı diline göre saat formatını belirle
    const userLang = navigator.language || navigator.userLanguage;
    const isEnglish = userLang.startsWith("en");

    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let session = "AM";

    if (isEnglish) {
        // 12 saat formatı
        if (hh >= 12) {
            session = "PM";
            if (hh > 12) hh -= 12;
        }
        if (hh === 0) hh = 12;
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;
        time_element.text(`${hh}: ${mm}:${ss} ${session}`);
    } else {
        // 24 saat formatı
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;
        time_element.text(`${hh}:${mm}:${ss}`);
    }

    // Tarih kısmını güncelle
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let dayDate = date.getDate();

    let dayArray = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let monthArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    if (
        today_element.text() !=
        `${dayArray[day]}, ${monthArray[month]} ${dayDate}, ${year}`
    ) {
        today_element.text(
            `${dayArray[day]}, ${monthArray[month]} ${dayDate}, ${year}`
        );
    }

    setTimeout(activateClock, 1000);
}
createShortcuts();
// Handle the shortcuts
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
<div class="link shortcut-item shortcut-item--link" data-tooltip="${link.name}">
  <a href="${link.url}" rel="noopener noreferrer" class="shortcutLink">
    <img src="${icon_url}" alt="${link.name} icon" />
  </a>
  <a class="removeLink" removeLink="${link.url}">
    <span class="material-symbols-outlined">close</span>
  </a>
</div>`;


        shortcut_element.append(element);
    });

    const createButton = `
<div class="link shortcut-item shortcut-item--create">
  <div id="createShortcut"class="plusButton" tabindex="0" >
    <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
      <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
    </svg>
  </div>
</div>`;


    shortcut_element.append(createButton);
    create_shortcut = $("#createShortcut");
    create_shortcut.click(function () {
        const btnOffset = $(this).offset(); // Get Add button position
        const btnHeight = $(this).outerHeight();
        const btnWidth = $(this).outerWidth();

        // Show the form beside the button
        add_shortcut.css({
            top: btnOffset.top, // 10px gap below button
            left: btnOffset.left + btnWidth + 10, // Align with button's left
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
            shortcut_data.push({
                name: link_name,
                url: link_url
            });
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
// Handle the background
function setBackground() {
    const add_custom = $("#addCustom");
    const remove_custom = $("#removeCustom");
    if (custom_img != null) {
        add_custom.hide();
        remove_custom.show();
    } else {
        add_custom.show();
        remove_custom.hide();
    }
    const bg_vdo = $("#bgVdo");
    const bg_mode_toggle = $("#bgModeToggle");
    const img_mode = $("#imgMode");
    if (bg_mode == "img") {
        $("body").css("--img", `url(${img})`);
    } else {
        localStorage.setItem("bgMode", "img");
        bg_mode = "img";

        function setBackground() {
            // Video element handling
            const videoElement = $('<video id="bgVdo" autoplay muted loop playsinline></video>');
            videoElement.attr('src', videoUrl);
            // Ensure no image background is applied
            $("body").css("--img", "");

            // Adding video to the body if not already added
            if ($("#bgVdo").length === 0) {
                $("body").prepend(videoElement);
            }
        }
        setBackground();
    }
}

// Get the image
function getImage() {
    const remove_custom = $("#removeCustom");
    if (custom_img != null) {
        remove_custom.show();
        return custom_img;
    } else {
        remove_custom.hide();
        const random_image = Math.floor(Math.random() * total_images) + 1;
        if (random_image == localStorage.getItem("lastImage")) {
            return getImage();
        } else {
            localStorage.setItem("lastImage", random_image);
            return `wallpapers/${random_image}.jpg`;
        }
    }
}
const selector = document.getElementById("searchSelector");
const engines = document.querySelectorAll(".engine");
// const activeIcon = document.getElementById("activeEngineIcon");
const search_input = document.getElementById("searchInput");
const search_trigger = document.getElementById("searchTrigger");

let activeSearchUrl = "https://www.google.com/search?q=";
const radius = 40;

// Initial hide
engines.forEach(engine => {
    engine.style.transform = "translate(0,0) scale(0)";
});

// Toggle menu
selector.addEventListener("click", (e) => {
    e.stopPropagation();
    selector.classList.toggle("open");

    engines.forEach(engine => {
        const angle = parseFloat(engine.dataset.angle);
        const rad = (angle * (Math.PI / 180)) - Math.PI * 3 / 4;
        const x = -Math.abs(Math.cos(rad) * radius);
        const y = -(Math.sin(rad) * radius);

        engine.style.transform = selector.classList.contains("open") ?
            `translate(${x}px, ${y}px) scale(1)` :
            `translate(0,0) scale(0)`;

        engine.style.opacity = selector.classList.contains("open") ? 1 : 0;
        engine.style.pointerEvents = selector.classList.contains("open") ? 'auto' : 'none';
    });
});

// Select engine
engines.forEach(engine => {
    engine.addEventListener("click", (e) => {
        e.stopPropagation();
        activeSearchUrl = engine.dataset.url;
        activeIcon.src = engine.dataset.icon;

        selector.classList.remove("open");
        engines.forEach(engine => {
            engine.style.transform = "translate(0,0) scale(0)";
            engine.style.opacity = 0;
            engine.style.pointerEvents = 'none';
        });
    });
});

// Click outside → close
document.addEventListener("click", () => {
    selector.classList.remove("open");
    engines.forEach(engine => {
        engine.style.transform = "translate(0,0) scale(0)";
        engine.style.opacity = 0;
        engine.style.pointerEvents = 'none';
    });
});

const apps = [{
    name: "Account",
    url: "https://myaccount.google.com/?utm_source=OGB&utm_medium=app&pli=1",
    imageUrl: "https://lh3.googleusercontent.com/a/ACg8ocIdWQno_reGJvdF49ZWLeEl0-HtLwSsF1QPmRneVdNmD2QEGNM=s400-c"
},
{
    name: "Search",
    url: "https://www.google.com/?authuser=0",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756482190/281764_rdhcsj.png"
},
{
    name: "Gmail",
    url: "https://mail.google.com/mail/u/0/#inbox",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756461552/Gmail_icon__2020.svg_pzytmj.webp"
},
{
    name: "YouTube",
    url: "https://youtube.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756458427/1384060_c77soa.png"
},
{
    name: "YT Music",
    url: "https://music.youtube.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486702/3357685_s9e0oc.webp"
},
{
    name: "Drive",
    url: "https://drive.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756462427/Google_Drive_icon__2020.svg_qqtlo6.webp"
},
{
    name: "Maps",
    url: "https://maps.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756473421/2642502_g2fhf0.png"
},
{
    name: "Photos",
    url: "https://photos.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756471913/Google_Photos_icon__2020.svg_pfu5pa.png"
},
{
    name: "Gemini",
    url: "https://gemini.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476793/google-gemini-icon_bn3bwk.png"
},
{
    name: "NotebookLM",
    url: "https://notebooklm.google.com/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756482409/images_cpiknk.png"
},
{
    name: "Meet",
    url: "https://meet.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756471670/img.icons8_lihcp4.png"
},
{
    name: "Sheets",
    url: "https://docs.google.com/spreadsheets/u/0/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474047/5968557_lhkrli.png"
},
{
    name: "Docs",
    url: "https://docs.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474005/5968517_qbw8ax.png"
},
{
    name: "Slides",
    url: "https://docs.google.com/presentation/u/0/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474112/slides_e8yoa5.svg"
},
{
    name: "Vids",
    url: "https://docs.google.com/videos/d",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1769367949/Google_Vids_2024_Logo.svg_xtjfjl.png"
},
{
    name: "Translate",
    url: "https://translate.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756461930/Google_Translate_logo.svg_nzfxu4.png"
},
{
    name: "Forms",
    url: "https://docs.google.com/forms/u/0/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486535/5968528_foqru9.png"
},
{
    name: "Translate",
    url: "https://translate.google.com/?sl=auto&tl=hi&op=translate",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756461930/Google_Translate_logo.svg_nzfxu4.png"
},
{
    name: "News",
    url: "https://news.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476901/Google_News_icon.svg_p8b1d9.png"
},
{
    name: "Business Profile Manager",
    url: "https://business.google.com/in/business-profile/?ppsrc=GPDA2&gmbsrc=ww-ww-ot-gs-z-gmb-l-z-h~z-ogb-u",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474261/google-my-business-icon_roo8yq.png"
},
{
    name: "Calender",
    url: "https://calendar.google.com/calendar/u/0/r?pli=1",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756463034/Google_Calendar_icon__2020.svg_raeixp.png"
},
{
    name: "One",
    url: "https://one.google.com/?utm_source=app_launcher&utm_medium=web&utm_campaign=all&utm_content=google_oo&g1_landing_page=1",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474287/7612689_dcuwa5.png"
},
{
    name: "Shopping",
    url: "https://www.google.com/shopping?source=og&authuser=0",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756460903/Google_Shopping_Logo_2025.svg_xcpmsy.png"
},
{
    name: "Store",
    url: "https://store.google.com/?utm_source=app_launcher&utm_medium=google_oo&utm_campaign=GS107345&pli=1&hl=en-IN",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1769518616/google-store-logo-png_seeklogo-482248-removebg-preview_qvs9q1.png"
},
{
    name: "Play",
    url: "https://play.google.com/store/games?device=windows",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474162/300218_nxjdpc.png"
},
{
    name: "Finance",
    url: "https://www.google.com/finance/beta",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756463413/google-finance_d4pm5x.webp"
},
{
    name: "Keep",
    url: "https://keep.google.com/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489017/img.icons8_gy2kwb.png"
},
{
    name: "My Ads Center",
    url: "https://myadcenter.google.com/home?ref=app-launcher",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489436/img.icons8_zfjtd5.png"
},
{
    name: "Classroom",
    url: "https://classroom.google.com/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756488857/img.icons8_ulgwld.png"
},
{
    name: "Chat",
    url: "https://mail.google.com/chat/u/0/#chat/home",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756460820/Google_Chat_icon__2023.svg_njb8fw.png"
},
{
    name: "Earth",
    url: "https://earth.google.com/static/multi-threaded/versions/10.96.0.1/index.html?authuser=0",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756476368/20191031145551_Google_Earth_icon.svg_dd5iq8.png"
},
{
    name: "Saved",
    url: "https://www.google.com/interests/saved?authuser=0",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756490138/img.icons8_cy952y.png"
},
{
    name: "Arts & Cluture",
    url: "https://artsandculture.google.com/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489646/Google_Arts_and_Culture_Logo_q99u1n.png"
},
{
    name: "Google Ads",
    url: "https://ads.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489316/img.icons8_ugtdsa.png"
},
{
    name: "Merchant Ceter",
    url: "https://business.google.com/in/merchant-center/",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489579/google-merchant-center_m2otk0.svg"
},
{
    name: "Contacts",
    url: "https://contacts.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1769674055/Google_Contacts_icon__2022.svg_lkayvt.png"
},
{
    name: "Travel",
    url: "https://www.google.com/travel/?dest_src=al&authuser=0",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756474102/google-travel_vc51et.png"
},
{
    name: "Books",
    url: "https://books.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486578/google-books_tnztta.png"
},
{
    name: "Webstore",
    url: "https://chromewebstore.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1769674136/Google_Chrome_Web_Store_icon_2022.svg_d1wofd.png"
},
{
    name: "Analytics",
    url: "https://analytics.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756484845/1721667_xyr5i3.webp"
},
{
    name: "Blogger",
    url: "https://blogger.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489970/img.icons8_cp4xuj.png"
},
{
    name: "Password Manager",
    url: "https://passwords.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756486354/google-password_cf0mkt.png"
},
{
    name: "Tasks",
    url: "https://tasks.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1756489106/Google_Tasks_2021.svg_lhlaso.png"
},
{
    name: "Wallet",
    url: "https://wallet.google.com",
    imageUrl: "https://res.cloudinary.com/dptzkxc0y/image/upload/v1769674440/google-wallet-icon_h2gfgw.webp"
},
];

const tooltip = document.getElementById("globalTooltip");
const launcherBtn = document.getElementById("googlelauncherBtn");
const menubar = document.getElementById("menubar");
const blurOverlay = document.getElementById("blurOverlay");
const spiralPath = document.getElementById("spiralPath");

let isOpen = false;
let spiralVectors = [];
let animationFrameId = null;

function showTooltip(e, text) {
    const tooltip = document.getElementById("globalTooltip");
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    // Check if the hovered item is inside the shortcut container
    const isShortcut = target.closest("#shortcutContainer") !== null;

    tooltip.textContent = text;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;

    if (isShortcut) {
        // --- SHORTCUT STYLE (Tooltip at Bottom) ---
        tooltip.style.top = `${rect.bottom}px`; // 8px gap below icon
        tooltip.style.transform = "translate(-50%, 0)"; // Slide down
    } else {
        // --- MENUBAR STYLE (Tooltip at Top) ---
        tooltip.style.top = `${rect.top - 8}px`; // 8px gap above icon
        tooltip.style.transform = "translate(-50%, -100%)"; // Slide up
    }

    tooltip.style.opacity = "1";
}

function hideTooltip() {
    const tooltip = document.getElementById("globalTooltip");
    tooltip.style.opacity = "0";
}

document.querySelectorAll('[data-tooltip]').forEach(btn => {
    btn.onmouseenter = (e) => showTooltip(e, btn.dataset.tooltip);
    btn.onmouseleave = hideTooltip;
});

// Spiral math
function calculateSpiral(num, gap) {
    let pts = [],
        x = 0,
        y = 0,
        step = 1,
        taken = 0,
        turns = 0;
    let dx = gap,
        dy = 0;
    for (let i = 0; i < num; i++) {
        pts.push({
            x,
            y,
            dx,
            dy
        });
        x += dx;
        y += dy;
        taken++;
        if (taken === step) {
            taken = 0;
            turns = (turns + 1) % 4;
            if (turns === 0) {
                dx = gap;
                dy = 0;
                step++;
            } else if (turns === 1) {
                dx = 0;
                dy = gap;
            } else if (turns === 2) {
                dx = -gap;
                dy = 0;
                step++;
            } else {
                dx = 0;
                dy = -gap;
            }
        }
    }
    return pts;
}

function animateSpiral(timestamp) {
    if (!isOpen) return;
    // Center of the SCREEN
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    let d = `M ${cx} ${cy}`;
    spiralVectors.forEach((p, i) => {
        const wave = Math.sin(timestamp * 0.003 + i * 0.2) * 4;
        const nx = cx + p.x + (p.dx === 0 ? wave : 0);
        const ny = cy + p.y + (p.dx !== 0 ? wave : 0);
        d += ` L ${nx} ${ny}`;
    });
    spiralPath.setAttribute("d", d);
    animationFrameId = requestAnimationFrame(animateSpiral);
}

function showApps() {
    isOpen = true;
    blurOverlay.classList.add("active");
    if (menubar.style) menubar.style.visibility = "hidden";

    // Center of SCREEN
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    spiralVectors = calculateSpiral(apps.length, 75);
    animationFrameId = requestAnimationFrame(animateSpiral);

    spiralVectors.forEach((p, i) => {
        const appDiv = document.createElement("div");
        appDiv.className = "app";
        appDiv.innerHTML = `<img src="${apps[i].imageUrl}" class="app-image">`;
        appDiv.style.left = `${cx + p.x - 22}px`;
        appDiv.style.top = `${cy + p.y - 22}px`;

        appDiv.onmouseenter = (e) => showTooltip(e, apps[i].name);
        appDiv.onmouseleave = hideTooltip;
        appDiv.onclick = () => {
            const link = document.createElement('a');
            link.href = apps[i].url;
            link.target = '_self';
            link.rel = 'noreferrer';

            // We don't even need to append it to the DOM in modern browsers
            link.click();
        };

        document.body.appendChild(appDiv);
        setTimeout(() => appDiv.style.transform = "scale(1)", i * 40);
    });
}

function hideApps() {
    isOpen = false;
    blurOverlay.classList.remove("active");
    if (menubar.style) menubar.style.visibility = "Visible";
    cancelAnimationFrame(animationFrameId);
    document.querySelectorAll(".app").forEach(a => a.style.transform = "scale(0)");
    setTimeout(() => {
        document.querySelectorAll(".app").forEach(a => a.remove());
        spiralPath.setAttribute("d", "");
    }, 300);
}

launcherBtn.onclick = (e) => {
    e.stopPropagation();
    isOpen ? hideApps() : showApps();
};
// Listen for the Escape key globally
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
        hideApps();

    }
});
blurOverlay.onclick = hideApps;
document.getElementById('flask-btn').onclick = () => window.location.href = "https://labs.google.com/search";

/**
 * MAGIC LINKS UI CONTROLLER
 * Consolidates link management, context menus, and UI visibility toggle.
 */

const genWrapper = document.getElementById('gen-ui-wrapper');
const genTriggerBtn = document.getElementById('gen-trigger-btn');
const genMenuList = document.getElementById('gen-menu-list');
const genInput = document.getElementById('gen-message-input');
const genSendBtn = document.getElementById('gen-send-button');
const genCtxMenu = document.getElementById('gen-context-menu');
// const blurOverlay = document.getElementById('blurOverlay');
// Ensure 'menubar' is defined in your HTML
// const menubar = document.getElementById('menubar') || { style: {} }; 

let genLinks = JSON.parse(localStorage.getItem('genMagicLinks')) || [];
let genRightClickedId = null;
let isMagicOpen = false;

// --- UTILITY FUNCTIONS ---

function genExtractName(url) {
    try {
        const formatted = url.includes('://') ? url : `https://${url}`;
        const urlObj = new URL(formatted);
        let hostParts = urlObj.hostname.replace('www.', '').split('.');
        // Logic: if domain is 'app.openai.com', take 'openai' instead of 'app'
        let name = (hostParts[0].length <= 3 && hostParts.length > 1) ? hostParts[1] : hostParts[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
        return "Link";
    }
}

function genSaveAndRender() {
    localStorage.setItem('genMagicLinks', JSON.stringify(genLinks));
    genRenderLinks();
}

function genRenderLinks() {
    // Clear existing dynamic links
    const currentLinks = genMenuList.querySelectorAll('.gen-outer-cont');
    currentLinks.forEach(el => el.remove());

    genLinks.forEach(link => {
        const a = document.createElement('a');
        const finalUrl = link.url.includes('://') ? link.url : `https://${link.url}`;

        a.href = finalUrl;
        a.target = "_self";
        a.className = "gen-outer-cont";

        // --- GRADIENT LOGIC ---
        // Color 1: The base hue
        // Color 2: The hue shifted by 40 degrees for a nice transition
        const color1 = `hsl(${link.hue}, 70%, 45%)`;
        const color2 = `hsl(${link.hue + 180}, 70%, 35%)`;

        // Apply gradient to the background of the <a> tag
        a.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;

        // Ensure no filters are inherited
        a.style.filter = "none";

        a.innerHTML = `
            <img src="https://www.google.com/s2/favicons?sz=64&domain=${link.url}" 
                 width="24" height="24" 
                 style="border-radius:50%; filter: none;">
            <span style="color: white; filter: none; font-weight: 500;">Ask ${link.name}</span>
        `;

        // Custom Right Click
        a.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            genRightClickedId = link.id;
            genCtxMenu.style.display = 'flex';
            genCtxMenu.style.top = `${e.clientY - 10}px`;
            genCtxMenu.style.left = `${e.clientX}px`;
        };
        genCtxMenu.addEventListener('mouseleave', (e) => {
            genCtxMenu.style.display = 'none';
        })

        const inputBox = genMenuList.querySelector('.gen-message-box');
        genMenuList.insertBefore(a, inputBox);
    });
}

function closeMagicMenu() {
    isMagicOpen = false;
    if (menubar.style) menubar.style.visibility = "visible";
    genMenuList.style.visibility = "hidden";
    blurOverlay.classList.remove("active");
    genWrapper.classList.remove('gen-active');
    genCtxMenu.style.display = 'none';
}

function genHandleAdd() {
    const val = genInput.value.trim();
    if (!val) return;

    genLinks.push({
        id: Date.now(),
        name: genExtractName(val),
        url: val,
        hue: Math.floor(Math.random() * 360)
    });

    genInput.value = '';
    genSaveAndRender();
}

// --- EVENT LISTENERS ---

// Main Toggle Logic
genTriggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isMagicOpen) {
        isMagicOpen = true;
        blurOverlay.classList.add("active");
        genWrapper.classList.add('gen-active');
        if (menubar.style) menubar.style.visibility = "hidden";
        genMenuList.style.visibility = "visible";
        genRenderLinks();
    } else {
        closeMagicMenu();
    }
});

// Prevent menu from closing when clicking inside the list
genMenuList.onclick = (e) => e.stopPropagation();

// Delete Action
document.getElementById('gen-ctx-delete').onclick = (e) => {
    e.stopPropagation();
    genLinks = genLinks.filter(l => l.id !== genRightClickedId);
    genSaveAndRender();
    genCtxMenu.style.display = 'none';
};

// Close on outside click
window.onclick = () => {
    if (isMagicOpen) closeMagicMenu();
};

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMagicOpen) {
        closeMagicMenu();
    }
});

// Blur click to close
blurOverlay.addEventListener('click', closeMagicMenu);

// Input handling
genSendBtn.onclick = genHandleAdd;
genInput.onkeypress = (e) => {
    if (e.key === 'Enter') genHandleAdd();
};

// Initial Render
genRenderLinks();







const mainBtn = document.getElementById('ai-mainBtn');
const honeycombUI = document.getElementById('ai-honeycomb-ui');
const plusBtn = document.getElementById('ai-plusBtn');
const modal = document.getElementById('ai-modal');
const saveBtn = document.getElementById('ai-saveBtn');
const urlInput = document.getElementById('ai-urlInput');
const ctx = document.getElementById('ai-ctx');
const a = document.getElementsByClassName('ai-cite-node')
let ainodes = JSON.parse(localStorage.getItem('ai_nodes')) || [];
let deleteTargetIndex = null;

// --- OPEN UI ---
mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // menuBar.classList.add('ai-hidden');
    if (menubar.style) menubar.style.visibility = "hidden";
    blurOverlay.classList.add('active');
    honeycombUI.classList.add('isvisible');
    renderNodes();
});



// --- OPEN MODAL ---
plusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.style.display = 'flex';
    ctx.style.display = 'none';
    urlInput.focus();
});

// --- SAVE NODE ---
// 1. Define the Save Logic in a function
const handleSave = () => {
    const val = urlInput.value.trim();
    if (val) {
        ainodes.push(val);
        localStorage.setItem('ai_nodes', JSON.stringify(ainodes));
        renderNodes();
        modal.style.display = 'none';
        urlInput.value = '';
    }
};

// 2. Trigger on Button Click
saveBtn.addEventListener('click', handleSave);

// 3. Trigger on "Enter" Key Press
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevents page reload if inside a form
        handleSave();
    }
});

// --- RENDER NODES ---
function renderNodes() {
    document.querySelectorAll('.ai-site-node').forEach(n => n.remove());

    ainodes.forEach((url, i) => {
        const [x, y] = calculateHexPos(i + 1);
        const div = document.createElement('div');
        div.className = 'ai-node ai-site-node';
        // div.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        // Inside your renderNodes function, update the div style:
        div.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(var(--node-scale, 1))`;
        const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
        const icon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${cleanUrl}&sz=64`;

        div.innerHTML = `<img src="${icon}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/124/124010.png'">`;
        const title = url.replace(/^https?:\/\/(www\.)?/, '').split('.')[0];
        div.dataset.tooltip = title;
        div.onmouseenter = (e) => showTooltip(e, title);
        div.onmouseleave = hideTooltip;
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(cleanUrl, '_self');
        });

        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteTargetIndex = i;
            ctx.style.display = 'flex';
            ctx.style.left = `${e.clientX}px`;
            ctx.style.top = `${e.clientY - 10}px`;
        });
        ctx.addEventListener('mouseleave', (e) => {
            ctx.style.display = 'none';
        })

        honeycombUI.appendChild(div);
    });
}

function calculateHexPos(n) {
    let ring = 0,
        count = 0;
    while (count < n) {
        ring++;
        count += 6 * ring;
    }
    const pos = n - (count - 6 * ring) - 1;
    const side = Math.floor(pos / ring);
    const spacing = 24;
    const step = pos % ring;
    const dirs = [
        [1, 0],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [0, -1],
        [1, -1]
    ];
    let q = dirs[4][0] * ring,
        r = dirs[4][1] * ring;
    for (let i = 0; i <= side; i++) {
        let s = (i === side) ? step : ring;
        q += dirs[i][0] * s;
        r += dirs[i][1] * s;
    }
    return [spacing * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r), spacing * (1.5 * r)];
}

// --- DELETE NODE ---
ctx.addEventListener('click', (e) => {
    e.stopPropagation();
    if (deleteTargetIndex !== null) {
        ainodes.splice(deleteTargetIndex, 1);
        localStorage.setItem('ai_nodes', JSON.stringify(ainodes));
        renderNodes();
        ctx.style.display = 'none';
    }
});
ctx.addEventListener('mouseleave', () => {
    ctx.style.display = 'none';
});
// --- GLOBAL CLICKS (Modal & Context Menu) close the input modal ---
const closeModal = () => {
    modal.style.display = 'none';
    ctx.style.display = 'none';
    urlInput.value = ''; // Reset input for next time
};

// Listen for clicks
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Listen for Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});



// --- CLOSE UI (Clicking on the background space) ---

const closeAiUI = () => {
    if (menubar.style) menubar.style.visibility = "Visible";
    blurOverlay.classList.remove('active');
    honeycombUI.classList.remove('isvisible');
    ctx.style.display = 'none';
}
// Only close if clicking the background, not a button
honeycombUI.addEventListener('click', (e) => {
    if (e.target === honeycombUI) closeAiUI();
});
// only if clicking the escape button
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAiUI();
});


let editApps = JSON.parse(localStorage.getItem('editApps')) || [{
    name: 'Google Lab',
    url: 'https://labs.google/experiments?category=create%3Fcategory%3Ddevelop',
    icon: 'https://www.google.com/s2/favicons?sz=128&domain=https://labs.google/experiments?category=create%3Fcategory%3Ddevelop'
}];

const editmainbtn = document.getElementById('editbtn');
const editContainer = document.getElementById('editAppContainer');
const editGridBody = document.getElementById('editGridBody');
const editUrlInput = document.getElementById('editAppUrl');
const editmodalOverlay = document.getElementById('editModalOverlay');
const edit_APPS_PER_ROW = 14;
let editSelectedIndex = null;

// Assuming these exist from your previous code
// const menubar = document.getElementById('mainMenuBar'); 
// const blurOverlay = document.getElementById('blurOverlay');

function editSaveApps() {
    localStorage.setItem('editApps', JSON.stringify(editApps));
}

// Helper to close the main UI
const closeeditui = () => {
    editContainer.style.display = 'none';
    editContainer.classList.remove('visible');
    if (menubar) menubar.style.visibility = 'visible';
    if (blurOverlay) blurOverlay.classList.remove('active');
};

// Main trigger for opening the edit ui
editmainbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    editRenderApps();
    editContainer.style.display = 'flex';
    editContainer.classList.add('visible');
    if (menubar) menubar.style.visibility = 'hidden';
    if (blurOverlay) blurOverlay.classList.add('active');
});

function editRenderApps() {
    editGridBody.innerHTML = '';
    let editAllItems = [...editApps, { isAdd: true }];
    let editRows = [];

    for (let i = 0; i < editAllItems.length; i += edit_APPS_PER_ROW) {
        editRows.push(editAllItems.slice(i, i + edit_APPS_PER_ROW));
    }

    editRows.forEach((editRowItems, editRowIndex) => {
        const editRowDiv = document.createElement('div');
        const editIsRtl = editRowIndex % 2 !== 0;
        editRowDiv.className = `editGridRow ${editIsRtl ? 'rtl' : 'ltr'}`;
        
        const editConnector = document.createElement('div');
        editConnector.className = 'editRowConnector';
        editRowDiv.appendChild(editConnector);

        editRowItems.forEach((editItem, editIndex) => {
            const editNode = document.createElement('div');
            editNode.className = 'editAppNode';
            const editGlobalIndex = editRowIndex * edit_APPS_PER_ROW + editIndex;

            const bracketWrapper = document.createElement('div');
            bracketWrapper.className = 'editBracketWrapper';

            if (editItem.isAdd) {
                const addBtn = document.createElement('div');
                addBtn.className = 'editAddBtn';
                addBtn.textContent = '+';
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    editOpenModal();
                });
                bracketWrapper.appendChild(addBtn);
            } else {
                const appLink = document.createElement('a');
                appLink.href = editItem.url;
                appLink.className = 'editAppContent';
                appLink.dataset.tooltip = editItem.name;

                // Make sure showTooltip/hideTooltip functions are defined elsewhere
                if (typeof showTooltip === "function") {
                    appLink.onmouseenter = (e) => showTooltip(e, editItem.name);
                    appLink.onmouseleave = hideTooltip;
                }

                appLink.addEventListener('contextmenu', (e) => editShowContextMenu(e, editGlobalIndex));

                const iconDiv = document.createElement('div');
                iconDiv.className = 'editAppIcon';
                const iconImg = document.createElement('img');
                iconImg.src = editItem.icon;
                iconImg.onerror = () => { iconImg.src = 'https://cdn-icons-png.flaticon.com/512/1243/1243966.png'; };

                iconDiv.appendChild(iconImg);
                appLink.appendChild(iconDiv);
                bracketWrapper.appendChild(appLink);
            }

            editNode.appendChild(bracketWrapper);
            editRowDiv.appendChild(editNode);

            if (editIndex < editRowItems.length - 1) {
                const editLine = document.createElement('div');
                editLine.className = 'editLineConnector';
                editRowDiv.appendChild(editLine);
            }
        });
        editGridBody.appendChild(editRowDiv);
    });
}

async function editAddApp() {
    let editUrl = editUrlInput.value.trim();
    if (!editUrl) return;
    if (!editUrl.startsWith('http')) editUrl = 'https://' + editUrl;

    try {
        const urlObj = new URL(editUrl);
        const editDomain = urlObj.hostname;
        const editName = editDomain.replace(/^www\./, '').split('.')[0];
        const formattedName = editName.charAt(0).toUpperCase() + editName.slice(1);

        const editIcon = `https://www.google.com/s2/favicons?sz=128&domain=${editDomain}`;
        editApps.push({ name: formattedName, url: editUrl, icon: editIcon });
        
        editSaveApps();
        editRenderApps();
        editCloseModal();
        editUrlInput.value = '';
    } catch (e) {
        alert("BROKEN_LINK_ERROR");
    }
}

function editShowContextMenu(e, index) {
    e.preventDefault();
    e.stopPropagation();
    editSelectedIndex = index;
    const editMenu = document.getElementById('editContextMenu');
    editMenu.style.display = 'block';
    editMenu.style.left = e.pageX + 'px';
    editMenu.style.top = e.pageY + 'px';
}

function editOpenModal() {
    editmodalOverlay.style.display = 'flex';
}

function editCloseModal() {
    editmodalOverlay.style.display = 'none';
}

// Modal Click Logic
document.getElementById('editInstallBtn').addEventListener('click', editAddApp);

editmodalOverlay.addEventListener('click', (e) => {
    if (e.target === editmodalOverlay) {
        editCloseModal();
    }
});

// Context Menu action
document.getElementById('editRemoveItem').addEventListener('click', (e) => {
    e.stopPropagation();
    if (editSelectedIndex !== null) {
        editApps.splice(editSelectedIndex, 1);
        editSaveApps();
        editRenderApps();
    }
});

// Combined Global Listeners
window.addEventListener('click', (e) => {
    // Hide context menu
    document.getElementById('editContextMenu').style.display = 'none';
    
    // Close UI if clicking outside the app container
    if (editContainer.classList.contains('visible') && !editContainer.contains(e.target)) {
        closeeditui();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        if (editmodalOverlay.style.display === 'flex') {
            editCloseModal();
        } else if (editContainer.classList.contains('visible')) {
            closeeditui();
        }
    }
});

window.oncontextmenu = (e) => {
    if (editContainer.classList.contains('visible')) e.preventDefault();
};