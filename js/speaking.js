// scripts/speaking.js

let mediaRecorder;
let recordedChunks = [];
let timerInterval;
let seconds = 0;

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const finishBtn = document.getElementById("finishBtn");
const timerDisplay = document.getElementById("timer");
const recordingsList = document.getElementById("recordingsList");

startBtn.addEventListener("click", startRecording);
pauseBtn.addEventListener("click", pauseRecording);
resumeBtn.addEventListener("click", resumeRecording);
finishBtn.addEventListener("click", stopRecording);

function startRecording() {
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();
            startTimer();

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };

            startBtn.disabled = true;
            pauseBtn.disabled = false;
            finishBtn.disabled = false;
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Please allow microphone access.");
        });
}

function pauseRecording() {
    mediaRecorder.pause();
    pauseTimer();
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
}

function resumeRecording() {
    mediaRecorder.resume();
    startTimer();
    resumeBtn.disabled = true;
    pauseBtn.disabled = false;
}

function stopRecording() {
    mediaRecorder.stop();
    pauseTimer();
    resetTimer();

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        recordedChunks = [];

        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = url;

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "recording.webm";
        downloadLink.textContent = "Download recording";

        const listItem = document.createElement("div");
        listItem.appendChild(audio);
        listItem.appendChild(downloadLink);

        recordingsList.appendChild(listItem);
    };

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    finishBtn.disabled = true;
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = "00:00";
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
    )}`;
}