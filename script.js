const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const fullscreenBtn = document.querySelector(".fullscreen-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");

const title = document.querySelector(".title");

const currentTimeElem = document.querySelector(".current-time");
const totalTimeElem = document.querySelector(".total-time");

const timeline = document.querySelector(".timeline");
const buffered = document.querySelector(".buffered");
const duration = document.querySelector(".duration");
const timelineContainer = document.querySelector(".timeline-container");

const captionsBtn = document.querySelector(".captions-btn");
const speedBtn = document.querySelector(".speed-btn");

const volumeBtn = document.querySelector(".volume-btn");
const volumeSlider = document.querySelector(".volume-slider");

const video = document.querySelector(".video");
const videoContainer = document.querySelector(".video-container");

const videoControlsContainer = document.querySelector(".video-controls-container");

video.volume = 0.5;

document.addEventListener("keydown", (e) => {
    const tagName = document.activeElement.tagName.toLocaleLowerCase();

    if (tagName === "input" || tagName === "textarea") {
        return;
    }

    // if (e.key === " ") {
    //     if (document.activeElement.classList.contains("play-pause-btn")) {
    //         e.preventDefault();
    //     } else if (!document.activeElement.classList.contains("play-pause-btn")) {
    //         return
    //     }

    //     togglePlay();
    // }

    switch (e.key.toLocaleLowerCase()) {
        case " ":
            if (tagName === "button") return
            togglePlay();
            break;
        case "k":
            togglePlay();
            break;
        case "f":
            toogleFullscreenMode();
            break;
        case "i":
            toogleMiniPlayerMode();
            break;
        case "t":
            toogleTheaterMode();
            break;
        case "m":
            toggleMute();
            showControlsAndHideWithoutCondition();
            break;
        case "c":
            toogleCaptions();
            break;
    }

    switch (e.key) {
        case "l":
        case "ArrowRight":
            video.currentTime += 5;
            break;
        case "j":
        case "ArrowLeft":
            video.currentTime -= 5;
            break;
        case "ArrowUp":
            if (video.volume >= 0.95) {
                video.volume = 1;
                break
            }
            video.muted = false;
            video.volume += 0.05;
            break;
        case "ArrowDown":
            if (video.volume <= 0.15) {
                video.volume = 0;
                break
            }
            video.volume -= 0.05;
            break;
    }

})

// Timeline
video.addEventListener("timeupdate", updateProgress)

timelineContainer.addEventListener("click", setProgress);

function updateProgress() {
    const bufferedWidth = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
    buffered.style.width = `${bufferedWidth}%`;
    timeline.style.width = `${(video.currentTime / video.duration) * 100}%`;
}

function setProgress(e) {
    const newTime = (e.offsetX / e.target.offsetWidth) * video.duration;
    video.currentTime = newTime;
}

// Speed
speedBtn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
    let newPlaybackRate = video.playbackRate + 0.25;
    if (newPlaybackRate > 2) {
        newPlaybackRate = 0.25;
    }
    video.playbackRate = newPlaybackRate;
    speedBtn.textContent = `${newPlaybackRate}x`;
}

// Captions
const captions = video.textTracks[0];
captions.mode = "hidden"; //default value = "default"

captionsBtn.addEventListener("click", toogleCaptions);

function toogleCaptions() {
    const isHidden = captions.mode === "hidden";
    captions.mode = isHidden ? "showing" : "hidden";
    videoContainer.classList.toggle("captions", isHidden);
}

// Durations
video.addEventListener("loadedmetadata", () => {
    totalTimeElem.textContent = formatDuration(video.duration);
})

video.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatDuration(video.currentTime);
    // video.currentTime === video.duration ? videoContainer.classList.add("paused") : videoContainer.classList.remove("paused");
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    if (hours === 0) {
        return `${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    }

}

// Volume
volumeBtn.addEventListener("click", toggleMute);

volumeSlider.addEventListener("input", () => {
    video.volume = volumeSlider.value;
    video.muted = volumeSlider.value === 0;

})

function toggleMute() {
    video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
    volumeSlider.value = video.volume;
    let volumeLevel
    if (video.muted || video.volume === 0) {
        volumeLevel = "muted";
    } else if (video.volume <= 0.4) {
        volumeLevel = "low";
    } else {
        volumeLevel = "hight";
    }

    // videoContainer.setAttribute("data-volume-level", volumeLevel);
    videoContainer.dataset.volumeLevel = volumeLevel;
})

// View Mode
theaterBtn.addEventListener("click", toogleTheaterMode);
fullscreenBtn.addEventListener("click", toogleFullscreenMode);
miniPlayerBtn.addEventListener("click", toogleMiniPlayerMode);

function toogleTheaterMode() {
    videoContainer.classList.toggle("theater");
}

function toogleFullscreenMode() {

    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

    videoContainer.classList.toggle("fullscreen");
    videoContainer.classList.remove("theater");
}

function toogleMiniPlayerMode() {
    if (videoContainer.classList.contains("mini-player")) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture();
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("fullscreen", document.fullscreenElement);
})

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player");
})

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player");
})

// Toggle in theater Mode visability upper blocks
theaterBtn.addEventListener("click", toogleVisibiltyTitle);

function toogleVisibiltyTitle() {
    const isHidden = title.style.display === "none";
    title.style.display = isHidden ? "block" : "none";
    document.body.style.paddingTop = isHidden ? "40px" : "0";
}

// Toggle play video
playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("dblclick", toogleFullscreenMode)

function togglePlay() {
    video.paused ? video.play() : video.pause();
    video.paused ? videoContainer.classList.add("paused") : videoContainer.classList.remove("paused");
}

video.addEventListener("ended", () => {
    videoContainer.classList.add("paused");
})

// video.addEventListener("play", () => { videoContainer.classList.remove("paused") })

// video.addEventListener("pause", () => { videoContainer.classList.add("paused") })

// Toggle showing controls
let hideTimeout
video.addEventListener("play", showControlsAndHideWithoutCondition)

video.addEventListener("pause", showControlsAndHideIfFullscreenMode)

function showControlsAndHideIfFullscreenMode() {
    clearTimeout(hideTimeout);
    videoControlsContainer.style.opacity = "1";
    if (!document.fullscreenElement) return;
    hideTimeout = setTimeout(() => {
        videoControlsContainer.style.opacity = "0";
    }, 3000);
}

function showControlsAndHideWithoutCondition() {
    clearTimeout(hideTimeout);
    videoControlsContainer.style.opacity = "1";
    hideTimeout = setTimeout(() => {
        videoControlsContainer.style.opacity = "0";
    }, 3000);
}

videoContainer.addEventListener("mousemove", showControlsAndHideIfFullscreenMode)

videoContainer.addEventListener("mousedown", showControlsAndHideWithoutCondition)