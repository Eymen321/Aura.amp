import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Kanka buraya Firebase'den aldığın kendi config bilgilerini yapıştır
const firebaseConfig = {
  apiKey: "BURAYA_KENDİ_KEYİNİ_YAZ",
  authDomain: "aura-amp.firebaseapp.com",
  projectId: "aura-amp",
  storageBucket: "aura-amp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const mesajlarRef = collection(db, "mesajlar");

const output = document.getElementById('output');
const handle = document.getElementById('handle');
const message = document.getElementById('message');
const btn = document.getElementById('send');
const chatWindow = document.getElementById('chat-window');

// Mesajları Firebase'e Gönder
btn.addEventListener('click', async () => {
    if(message.value != "" && handle.value != "") {
        await addDoc(mesajlarRef, {
            isim: handle.value,
            metin: message.value,
            zaman: serverTimestamp()
        });
        message.value = "";
    }
});

// Mesajları Canlı Al (onSnapshot sayesinde pıt diye düşer)
const q = query(mesajlarRef, orderBy("zaman", "asc"));
onSnapshot(q, (snapshot) => {
    output.innerHTML = "";
    snapshot.forEach((doc) => {
        const veri = doc.data();
        const t = veri.zaman ? new Date(veri.zaman.seconds * 1000) : new Date();
        const zaman = t.getHours().toString().padStart(2,'0') + ":" + t.getMinutes().toString().padStart(2,'0');
        
        output.innerHTML += `
            <p>
                <span style="font-size: 0.7em; opacity: 0.5;">${zaman}</span>
                <strong>${veri.isim}:</strong> ${veri.metin}
            </p>`;
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Tema ve Emoji kodlarını da buraya en alta ekleyebilirsin...

// HTML'deki elemanları koda bağlıyoruz
const output = document.getElementById('output');
const handle = document.getElementById('handle');
const message = document.getElementById('message');
const btn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const chatWindow = document.getElementById('chat-window');

// Otomatik En Aşağı Kaydırma Fonksiyonu
function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- 1. HAFIZADAKİ MESAJLARI YÜKLE ---
window.onload = function() {
    const kaydedilenler = localStorage.getItem('aura_mesajlar');
    if (kaydedilenler) {
        output.innerHTML = kaydedilenler;
        scrollToBottom(); // Eskileri yükleyince en aşağı kaydır
    }
};

// --- 2. MESAJ GÖNDERME (SAAT EKLENMİŞ HALİ) ---
btn.addEventListener('click', function() {
    if(message.value != "" && handle.value != "") {
        
        if (navigator.vibrate) { navigator.vibrate(50); }

        // Saat ve Dakika oluşturma
        const simdi = new Date();
        const saat = simdi.getHours().toString().padStart(2, '0');
        const dakika = simdi.getMinutes().toString().padStart(2, '0');
        const zaman = saat + ":" + dakika;

        // Yeni mesajı SAAT ile beraber oluştur
        const yeniMesaj = `
            <p>
                <span style="font-size: 0.75em; opacity: 0.6; margin-right: 8px;">${zaman}</span>
                <strong>${handle.value}: </strong> ${message.value}
            </p>`;

        output.innerHTML += yeniMesaj;

        let mevcutHafiza = localStorage.getItem('aura_mesajlar') || "";
        localStorage.setItem('aura_mesajlar', mevcutHafiza + yeniMesaj);

        message.value = "";
        scrollToBottom();

    } else {
        alert("Lütfen adını ve mesajını yaz kral!");
    }
});

// --- 3. TEMİZLEME BUTONU ---
clearBtn.addEventListener('click', function() {
    if(confirm("Bütün mesajları silmek istediğine emin misin kanka?")) {
        output.innerHTML = ""; 
        localStorage.removeItem('aura_mesajlar');
    }
});
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Butonun içindeki emojiyi değiştir
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerText = "🌙"; // Gece modu simgesi
    } else {
        themeToggle.innerText = "☀️"; // Gündüz modu simgesi
    }
});
// Emojiye tıklayınca mesaj kutusuna yazdır
document.querySelectorAll('#emoji-bar span').forEach(emoji => {
    emoji.addEventListener('click', () => {
        message.value += emoji.innerText;
    });
});
