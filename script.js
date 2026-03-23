// ===== PRODUCT DATA =====
const vibesFiles = [
    { file: 'Half Empty.mp3', cover: 'Half Empty.jpg' },
    { file: 'fallout.mp3', cover: 'Fallout.jpg' },
    { file: 'Mad Max.mp3', cover: 'Mad Max.jpg' },
    { file: 'theroad.mp3', cover: 'TheRoad.jpg' },
    { file: 'Dark Cathedral.mp3', cover: 'Dark Cathedral.jpg' }
];

const parodiesFiles = [
    { file: 'Albus.mp3', cover: 'Albus.jpg', name: 'Albus' },
    { file: 'Annie.mp3', cover: 'Annie.jpg', name: 'Annie' },
    { file: 'Fly You Fools.mp3', cover: 'Fly You Fools.jpg', name: 'Fly You Fools' },
    { file: 'Merry Crip-Mas.mp3', cover: 'Merry Crip-Mas.jpg', name: 'Merry Crip-Mas' },
    { file: 'whypeepoo.mp3', cover: 'whypeepoo.jpg', name: 'Why Peepoo' }
];

const artFiles = [
    '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg',
    '6.jpg','7.JPG','8.jpg','9.jpg','10.jpg',
    '11.jpg','12.jpg','13.jpg'
];

const ebookFiles = [
    { file: 'aim.jpg', title: 'AI Income Manipulator', price: 1999, preorder: false },
    { file: 'asc.jpg', title: 'AI Spaghetti Code', price: 1999, preorder: true, release: 7 },
    { file: 'aee.jpg', title: 'AI Engagement Engine', price: 1999, preorder: true, release: 14 },
    { file: 'cya.jpg', title: 'Channel Your AI', price: 1999, preorder: true, release: 21 }
];

// ===== CART =====
let cart = [];

function addToCart(id, quantity = 1) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, quantity });
    }
}

// ===== CHECKOUT =====
async function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
        const response = await fetch('http://localhost:4242/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        const data = await response.json();
        window.location.href = data.url;
    } catch (err) {
        console.error(err);
        alert("Checkout failed");
    }
}

// ===== LANDING PAGE MUSIC PLAYER =====
let currentTrackIndex = 0;
const musicPlayer = document.getElementById('music-player');
const trackNameDisplay = document.getElementById('track-name');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const nextBtn = document.getElementById('next-btn');

function loadTrack(index) {
    if (!musicPlayer) return;
    const files = vibesFiles;
    if (files.length === 0) return;

    currentTrackIndex = index % files.length;

    const trackPath = `music/vibes/${files[currentTrackIndex].file}`;
    musicPlayer.src = trackPath;

    trackNameDisplay.textContent =
        files[currentTrackIndex].file.replace(/\.[^/.]+$/, '');
}

if (playBtn) playBtn.addEventListener('click', () => musicPlayer.play());
if (pauseBtn) pauseBtn.addEventListener('click', () => musicPlayer.pause());
if (nextBtn) nextBtn.addEventListener('click', () => {
    loadTrack(currentTrackIndex + 1);
    musicPlayer.play();
});

if (musicPlayer) {
    musicPlayer.addEventListener('ended', () => {
        loadTrack(currentTrackIndex + 1);
        musicPlayer.play();
    });
}

if (document.body.classList.contains('landing-page')) loadTrack(0);

// ===== MUSIC PAGE =====
const musicListContainer = document.getElementById('music-list');
const genreTabs = document.querySelectorAll('.genre-tab');

function loadMusicGenre(genre) {
    if (!musicListContainer) return;

    musicListContainer.innerHTML = '';
    const files = genre === 'vibes' ? vibesFiles : parodiesFiles;

    if (files.length === 0) {
        musicListContainer.innerHTML = `<p style="text-align:center; color:#ff0066; padding:20px;">No songs yet in this genre</p>`;
        return;
    }

    files.forEach((songData) => {
        const trackName = songData.file.replace(/\.[^/.]+$/, '');
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.innerHTML = `
            <div class="music-item-image">
                <img src="music/cover/${songData.cover}" alt="${trackName}">
            </div>
            <div class="music-item-info">
                <div class="music-item-name">${trackName}</div>
                <audio class="music-item-player" controls>
                    <source src="music/${genre}/${songData.file}" type="audio/mpeg">
                </audio>
            </div>
        `;
        musicListContainer.appendChild(musicItem);
    });
}

if (genreTabs.length > 0) {
    loadMusicGenre('vibes');
    genreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            genreTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const genre = tab.getAttribute('data-genre');
            loadMusicGenre(genre);
        });
    });
}

// ===== EBOOK PAGE =====
const productsGridContainer = document.getElementById('products-grid');
if (productsGridContainer) {
    ebookFiles.forEach((ebookData, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = 'ebook-' + (index + 1);

        let preorderOverlay = '';
        if (ebookData.preorder) {
            preorderOverlay = `<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); color:#ff0066; display:flex; align-items:center; justify-content:center; font-weight:bold;">Pre-Order – 50% Off</div>`;
        }

        productCard.innerHTML = `
            <div class="product-image" style="position:relative;">
                <img src="e-book/${ebookData.file}" alt="${ebookData.title}">
                ${preorderOverlay}
            </div>
            <div class="product-info">
                <h3 class="product-title">${ebookData.title}</h3>
                <p class="product-price">$${(ebookData.price/100).toFixed(2)}</p>
                <button class="btn btn-buy">Buy</button>
                <button class="btn btn-bundle">Bundle</button>
            </div>
        `;

        productsGridContainer.appendChild(productCard);
    });
}

// ===== ART PAGE =====
const artGalleryContainer = document.getElementById('art-gallery');
if (artGalleryContainer) {
    artFiles.forEach((file, index) => {
        const artNumber = index + 1;
        const artPiece = document.createElement('div');
        artPiece.className = 'art-piece';
        artPiece.dataset.id = 'art-' + artNumber;

        artPiece.innerHTML = `
            <div class="art-image">
                <img src="art/${file}" alt="Art ${artNumber}">
            </div>
            <div class="art-info">
                <div class="art-title">Art Piece ${artNumber}</div>
                <div class="art-price">$39.99</div>
                <button class="btn btn-buy">Buy</button>
                <button class="btn btn-bundle">Bundle</button>
            </div>
        `;

        artGalleryContainer.appendChild(artPiece);
    });
}

// ===== BUTTON HANDLERS =====
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-buy')) {
        const card = e.target.closest('.product-card, .art-piece');
        if (!card) return;
        const id = card.dataset.id;
        addToCart(id, 1);
        checkout();
    }
    if (e.target.classList.contains('btn-bundle')) {
        const card = e.target.closest('.product-card, .art-piece');
        if (!card) return;
        const id = card.dataset.id;
        addToCart(id, 1);
        alert("Added to cart for bundle! Click another item or cart icon to checkout.");
    }
});