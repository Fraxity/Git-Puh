let xp = parseInt(localStorage.getItem("xp")) || 0;
let progress = parseInt(localStorage.getItem("progress")) || 0;
let currentSoal = 0;

const kuisData = [
    { q: "Apa kepanjangan dari HTML?", a: ["Hyper Text Markup Language", "High Tech Multi Language"], correct: 0 },
    { q: "Properti CSS untuk warna teks?", a: ["font-color", "color"], correct: 1 },
    { q: "Simbol untuk memanggil ID di CSS?", a: [". (titik)", "# (pagar)"], correct: 1 }
];

document.addEventListener("DOMContentLoaded", () => {
    // SINKRONISASI DARK MODE (Menggunakan key "darkMode" agar sama dengan profile.html)
    if (localStorage.getItem("darkMode") === "enabled") {
        document.documentElement.classList.add("dark");
    }
    
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
        // Mendukung ID userName (teks) dan userImg atau userAvatar (gambar)
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user.firstName;
        if(document.getElementById("displayFirstName")) document.getElementById("displayFirstName").innerText = user.firstName;
        
        const avatarImg = document.getElementById("userImg") || document.getElementById("userAvatar");
        if(avatarImg) avatarImg.src = user.image;
    }

    if(document.getElementById("pertanyaan")) loadKuis();
    updateUI();
});

// FUNGSI TOGGLE YANG DISINKRONKAN
function toggleDark() {
    const isDark = document.documentElement.classList.toggle("dark");
    if (isDark) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

function updateUI() {
    const xpT = document.getElementById("xpText");
    const pb = document.getElementById("progressBar");
    if(xpT) xpT.innerText = xp;
    if(pb) {
        pb.style.width = progress + "%";
        document.getElementById("progressText").innerText = progress + "%";
        document.getElementById("levelText").innerText = "Level " + Math.floor(xp / 300) + " Scholar";
    }
}

function selesaiMateri() {
    xp += 100; progress = Math.min(progress + 20, 100);
    saveAndSync();
    showToast("Materi Selesai! +100 XP 🎯", "success");
}

function loadKuis() {
    const data = kuisData[currentSoal];
    document.getElementById("soalKe").innerText = `Soal ${currentSoal + 1}/3`;
    document.getElementById("pertanyaan").innerText = data.q;
    const opsiDiv = document.getElementById("opsi");
    opsiDiv.innerHTML = "";
    data.a.forEach((opt, index) => {
        const btn = document.createElement("button");
        // Update warna ke BLUE agar sinkron dengan dashboard baru
        btn.className = "w-full text-left p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 dark:text-white";
        btn.innerText = opt;
        btn.onclick = () => cekJawaban(index);
        opsiDiv.appendChild(btn);
    });
}

function cekJawaban(idx) {
    const container = document.getElementById("quizContainer");
    if (idx === kuisData[currentSoal].correct) {
        xp += 50; progress = Math.min(progress + 10, 100);
        showToast("Benar! +50 XP ⚡", "success");
        container.classList.add("border-green-500", "ring-4", "ring-green-500/20");
    } else {
        showToast("Salah! Coba lagi ❌", "error");
        container.classList.add("border-red-500", "animate-pulse");
    }

    setTimeout(() => {
        container.classList.remove("border-green-500", "border-red-500", "ring-4", "ring-green-500/20", "animate-pulse");
        currentSoal++;
        if (currentSoal < kuisData.length) loadKuis();
        else {
            document.getElementById("quizContent").classList.add("hidden");
            document.getElementById("quizResult").classList.remove("hidden");
        }
        saveAndSync();
    }, 800);
}

function saveAndSync() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("progress", progress);
    updateUI();
}

function showToast(msg, type) {
    const t = document.createElement("div");
    // Styling toast lebih kecil dan modern
    t.className = `fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white font-black shadow-2xl z-50 transition-all uppercase tracking-widest text-[9px] ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 500); }, 2000);
}