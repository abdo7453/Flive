// تحميل القنوات من ملف channels.json
let channels = [];
fetch('channels.json')
    .then(res => res.json())
    .then(data => {
        channels = data;
        renderChannels();
    });

// رسم القنوات في الصفحة
function renderChannels() {
    const grid = document.getElementById("channels");
    grid.innerHTML = "";
    channels.forEach((ch, idx) => {
        const div = document.createElement("div");
        div.className = "channel-card";
        div.innerHTML = `
            <img class="channel-logo" src="${ch.logo}" alt="${ch.name}">
            <div class="channel-name">${ch.name}</div>
        `;
        div.onclick = () => openModal(idx);
        grid.appendChild(div);
    });
}

// فتح نافذة المشاهدة
function openModal(idx) {
    const ch = channels[idx];
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalLogo").src = ch.logo;
    document.getElementById("modalLogo").alt = ch.name;
    document.getElementById("modalTitle").textContent = ch.name;
    const video = document.getElementById("modalPlayer");

    // تنظيف الفيديو
    if(window.hlsInstance) { window.hlsInstance.destroy(); window.hlsInstance = null; }
    video.pause();
    video.removeAttribute('src');
    video.load();

    if (ch.url.endsWith(".m3u8") && window.Hls && Hls.isSupported()) {
        window.hlsInstance = new Hls();
        window.hlsInstance.loadSource(ch.url);
        window.hlsInstance.attachMedia(video);
        window.hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else {
        video.src = ch.url;
        video.play();
    }
}

// إغلاق النافذة
document.getElementById("closeModal").onclick = function() {
    document.getElementById("modal").style.display = "none";
    const video = document.getElementById("modalPlayer");
    video.pause();
    video.removeAttribute('src');
    video.load();
    if(window.hlsInstance) { window.hlsInstance.destroy(); window.hlsInstance = null; }
};

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(e) {
    if(e.target == document.getElementById("modal")) {
        document.getElementById("closeModal").onclick();
    }
};