// 1. Render Songs
// 2. Scroll top
// 3. play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Blue",
            singer: "Young Kai",
            path: "./assets/music/Blue.mp3",
            image: "./assets/images/Blue.jpg",
        },
        {
            name: "Phonecert",
            singer: "10cm",
            path: "./assets/music/phonecert.mp3",
            image: "./assets/images/phonecert.jpg",
        },
        {
            name: "Aya Nakamura - Copines (Lyrics)",
            singer: "10cm",
            path: "./assets/music/copines.mp3",
            image: "./assets/images/copines.jpg",
        },
        {
            name: "id thang máy (feat. 267)",
            singer: "W/N",
            path: "./assets/music/idThangMay.mp3",
            image: "./assets/images/idThangMay.jpg",
        },
        {
            name: "Anh sẽ đón em",
            singer: "Nguyên",
            path: "./assets/music/anhsedonem.mp3",
            image: "./assets/images/anhsedonem.jpg",
        },
        {
            name: "Bước nhẹ vào tim anh",
            singer: "Trúc Linh",
            path: "./assets/music/buocnhevaotimanh.mp3",
            image: "./assets/images/buocnhevaotimanh.jpg",
        },
        {
            name: "3 1 0 7 - 2 (Lofi Ver.)",
            singer: "Orinn",
            path: "./assets/music/3107.mp3",
            image: "./assets/images/3107.jpg",
        },
        {
            name: "Beautiful Scars",
            singer: "Kristel Fulgar",
            path: "./assets/music/BeautifulScars.mp3",
            image: "./assets/images/BeautifulScars.jpg",
        },
        {
            name: "Lan Man",
            singer: "Ronboogz",
            path: "./assets/music/LanMan.mp3",
            image: "./assets/images/LanMan.jpg",
        },
        {
            name: "Nếu Lúc Đó",
            singer: "tlinh",
            path: "./assets/music/NeuLucDo.mp3",
            image: "./assets/images/NeuLucDo.jpg",
        },
        {
            name: "Gokuraku Joudo",
            singer: "GARNiDELiA",
            path: "./assets/music/GokurakuJoudo.mp3",
            image: "./assets/images/GokurakuJoudo.jpg",
        },
        {
            name: "Kẻ Theo Đuổi Ánh Sáng",
            singer: "1 9 6 7",
            path: "./assets/music/KeTheoDuoiAS.mp3",
            image: "./assets/images/KeTheoDuoiAS.jpg",
        },
        {
            name: "Có Chàng Trai Viết Lên Cây",
            singer: "Phan Mạnh Quỳnh",
            path: "./assets/music/CoChangTraiVietLenCay.mp3",
            image: "./assets/images/CoChangTraiVietLenCay.jpg",
        },
        {
            name: "Drawer",
            singer: "10cm",
            path: "./assets/music/Drawer.mp3",
            image: "./assets/images/Drawer.jpg",
        },
        {
            name: "Đừng Xem Ai Đó Là Cả Thế Giới (Lofi Ver.)",
            singer: "Orinn",
            path: "./assets/music/DungXemAiDoLaCaTG.mp3",
            image: "./assets/images/DungXemAiDoLaCaTG.jpg",
        },
        {
            name: "Somewhere",
            singer: "JayM",
            path: "./assets/music/SomeWhere.mp3",
            image: "./assets/images/SomeWhere.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div
                class="thumb"
                style="background-image: url('${song.image}')"
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    // define app.currentSong == first song
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]; // first song
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lí CD rotate / pause
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10s
            iterations: Infinity, // lặp vô hạn
        });
        cdThumbAnimate.pause(); // default pause

        // xử lí play khi click
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // khi song được play
        audio.onplay = function () {
            _this.isPlaying = true; // đang play
            player.classList.add("playing"); // thêm class playing vào player
            cdThumbAnimate.play(); // play animation
        };
        // khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        // currentTime: thời gian hiện tại của bài hát
        // duration: thời gian của bài hát
        // ontimeupdate: sự kiện xảy ra khi thời gian của bài hát thay đổi
        audio.ontimeupdate = function () {
            // nếu có duration thì mới update progress bar
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // Xử lí khi tua bài hát
        // oninput: sự kiện xảy ra khi giá trị của input thay đổi
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value; //  thời gian cần tua đến
            audio.currentTime = seekTime;
        };

        // khi click next song
        nextSong.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollActiveSongIntoView();
        };

        // khi click prev song
        prevSong.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        };

        // Xử lí bật / tắt random song
        randomBtn.onclick = function (e) {
            if (_this.isRepeat) {
                _this.isRepeat = false;
                repeatBtn.classList.remove("active");
            }
            _this.isRandom = !_this.isRandom; // đảo ngược giá trị isRandom
            randomBtn.classList.toggle("active", _this.isRandom); // thêm class active nếu isRandom = true
            _this.randomSong();
            audio.play();
        };

        // Xử lí lặp lại một song
        repeatBtn.onclick = function (e) {
            if (_this.isRandom) {
                _this.isRandom = false;
                randomBtn.classList.remove("active");
            }
            _this.isRepeat = !_this.isRepeat; // đảo ngược giá trị isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat); // thêm class active nếu isRepeat = true
        };

        // Xử lí next song khi ended song
        audio.onended = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        };

        // xử lí phóng to, thu nhỏ đĩa cd khi scroll
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop; // tọa độ scroll hiện tại
            const newCdWidth = cdWidth - scrollTop; // kích thước mới của cd giảm dần
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0; // kích thướng mới nếu scroll top
            $(".cd").style.opacity = newCdWidth / cdWidth; // mờ dần
        };

        // Lắng nghe hành vi click vào playlist
        // closets : lấy phần tử cha gần nhất có class là song chua co class active(dang phat)
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                // xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index); // lấy index của bài hát
                    _this.loadCurrentSong(); // load bài hát hiện tại
                    _this.render(); // render lại playlist
                    audio.play(); // play bài hát
                }
                // xử lí khi click vào option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    // cuộn bài hát hiện tại vào view
    scrollActiveSongIntoView: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = "url(" + this.currentSong.image + ")";
        audio.src = this.currentSong.path;
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex); // nếu newIndex = currentIndex thì random lại
        this.currentIndex = newIndex; // cập nhật currentIndex
        this.loadCurrentSong(); // load bài hát mới
    },
    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe / xử lí các sự kiện
        this.handleEvents();
        // Tải thông tin bà hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
    },
};

app.start();
