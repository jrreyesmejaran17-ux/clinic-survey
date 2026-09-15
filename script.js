/* =========================================
   BENEDICTO COLLEGE CLINIC SURVEY
========================================= */

const SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbxdHfBfhz98GV6pVgKrLxGFGCi2YV3t_xf-S-Ip6YLgw87facj49mpPzaKch-tobn4R/exec";


/* =========================================
   SURVEY VARIABLES
========================================= */

const slides = document.querySelectorAll(".survey-slide");
const totalSlides = slides.length;
const totalQuestions = 12;
const currentRatings = Array(totalQuestions + 1).fill(null);

let currentSlide = 0;

const surveyForm = document.getElementById("surveyForm");
const progressBar = document.getElementById("progressBar");
const slideCounter = document.getElementById("slideCounter");
const progressPercentage = document.getElementById("progressPercentage");
const answeredCount = document.getElementById("answeredCount");
const submitButton = document.getElementById("submitButton");


/* =========================================
   NOTIFICATION ELEMENTS
========================================= */

const notificationOverlay = document.getElementById("notificationOverlay");
const notificationBox = document.getElementById("notificationBox");
const notificationIcon = document.getElementById("notificationIcon");
const notificationTitle = document.getElementById("notificationTitle");
const notificationMessage = document.getElementById("notificationMessage");
const notificationButton = document.getElementById("notificationButton");


/* =========================================
   VALIDATION MESSAGE
========================================= */

const validationMessage = document.getElementById("validationMessage");


/* =========================================
   INITIALIZE
========================================= */

updateSlide();


/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide() {

    if (isQuestionSlide(currentSlide)) {
        const unansweredQuestions = getUnansweredQuestionsOnCurrentSlide();

        if (unansweredQuestions.length > 0) {
            showValidationMessage(unansweredQuestions);
            return;
        }
    }

    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
    }
}


/* =========================================
   PREVIOUS SLIDE
========================================= */

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}


/* =========================================
   UPDATE SLIDE
========================================= */

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlide);
    });

    const progress = (currentSlide / (totalSlides - 1)) * 100;

    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;

    if (currentSlide === 0) {
        slideCounter.textContent = "Introduction";
    } else if (currentSlide === 1) {
        slideCounter.textContent = "Instructions";
    } else if (currentSlide >= 2 && currentSlide <= 5) {
        const firstQuestion = ((currentSlide - 2) * 3) + 1;
        const lastQuestion = firstQuestion + 2;
        slideCounter.textContent = `Questions ${firstQuestion}–${lastQuestion} of ${totalQuestions}`;
    } else {
        slideCounter.textContent = "Thank You";
    }

    updateAnsweredCount();
}


/* =========================================
   DETERMINE QUESTION SLIDE
========================================= */

function isQuestionSlide(slideIndex) {
    return slideIndex >= 2 && slideIndex <= 5;
}


/* =========================================
   GET QUESTIONS ON CURRENT SLIDE
========================================= */

function getQuestionNumbersOnSlide(slideIndex) {
    if (!isQuestionSlide(slideIndex)) {
        return [];
    }

    const questionItems = slides[slideIndex].querySelectorAll(".question-item");

    return Array.from(questionItems).map(item =>
        Number(item.dataset.question)
    );
}


/* =========================================
   GET UNANSWERED QUESTIONS
========================================= */

function getUnansweredQuestionsOnCurrentSlide() {
    return getQuestionNumbersOnSlide(currentSlide).filter(questionNumber =>
        currentRatings[questionNumber] === null
    );
}


/* =========================================
   UPDATE ANSWER COUNTER
========================================= */

function updateAnsweredCount() {
    let answered = 0;

    for (let question = 1; question <= totalQuestions; question++) {
        if (currentRatings[question] !== null) {
            answered++;
        }
    }

    answeredCount.textContent = `${answered} / ${totalQuestions} questions answered`;
}


/* =========================================
   SET RATING
========================================= */

function setRating(questionNumber, rating) {
    if (rating < 1 || rating > 5) {
        return;
    }

    currentRatings[questionNumber] = rating;

    const display = document.getElementById(`ratingDisplay${questionNumber}`);
    const input = document.querySelector(`input[name="q${questionNumber}"]`);
    const questionItem = document.querySelector(`.question-item[data-question="${questionNumber}"]`);

    if (display) {
        display.textContent = `[${rating}]`;
        display.classList.add("has-rating");
    }

    if (input) {
        input.value = String(rating);
        input.checked = true;
    }

    if (questionItem) {
        questionItem.classList.add("answered");
    }

    updateAnsweredCount();
}


/* =========================================
   CHANGE RATING

   Empty -> 1 -> 2 -> 3 -> 4 -> 5
   5 stays at 5 when increased.
   1 stays at 1 when decreased.
========================================= */

function changeRating(questionNumber, direction) {
    const currentRating = currentRatings[questionNumber];

    if (currentRating === null) {
        if (direction > 0) {
            setRating(questionNumber, 1);
        }
        return;
    }

    const newRating = currentRating + direction;

    if (newRating >= 1 && newRating <= 5) {
        setRating(questionNumber, newRating);
    }
}


/* =========================================
   RATING BUTTON EVENTS
========================================= */

document.querySelectorAll(".rating-button").forEach(button => {
    button.addEventListener("click", function() {
        const questionNumber = Number(this.dataset.question);
        const direction = this.dataset.action === "increase" ? 1 : -1;

        changeRating(questionNumber, direction);
    });
});


/* =========================================
   VALIDATION MESSAGE
========================================= */

function showValidationMessage(unansweredQuestions = []) {
    if (unansweredQuestions.length > 0) {
        validationMessage.textContent =
            `⚠️ Please answer question${unansweredQuestions.length > 1 ? "s" : ""} ${unansweredQuestions.join(", ")} before continuing.`;
    } else {
        validationMessage.textContent =
            "⚠️ Please answer all questions on this page before continuing.";
    }

    validationMessage.classList.add("show");

    setTimeout(() => {
        validationMessage.classList.remove("show");
    }, 2500);
}


/* =========================================
   CLOSE NOTIFICATION
========================================= */

function closeNotification() {
    notificationOverlay.classList.remove("show");
    notificationOverlay.setAttribute("aria-hidden", "true");
}


/* =========================================
   SHOW SUCCESS NOTIFICATION
========================================= */

function showSuccessNotification() {
    notificationBox.classList.remove("failed");

    notificationIcon.textContent = "✓";
    notificationTitle.textContent = "Response Sent!";
    notificationMessage.textContent =
        "Your survey response has been successfully submitted. Thank you for sharing your experience with the Benedicto College Clinic.";
    notificationButton.textContent = "Finish";
    notificationButton.onclick = closeNotification;

    notificationOverlay.classList.add("show");
    notificationOverlay.setAttribute("aria-hidden", "false");
}


/* =========================================
   SHOW FAILED NOTIFICATION
========================================= */

function showFailedNotification() {
    notificationBox.classList.add("failed");

    notificationIcon.textContent = "✕";
    notificationTitle.textContent = "Submission Failed";
    notificationMessage.textContent =
        "We were unable to send your response. Please check your internet connection and try again.";
    notificationButton.textContent = "Close";
    notificationButton.onclick = closeNotification;

    notificationOverlay.classList.add("show");
    notificationOverlay.setAttribute("aria-hidden", "false");
}


/* =========================================
   COLLECT RESPONSES
========================================= */

function collectResponses () {
    const responses = {};

    for (let question = 1; question <= totalQuestions; question++) {
        responses[`question_${question}`] = currentRatings[question];
    }

    return responses;
}


/* =========================================
   CHECK ALL QUESTIONS
========================================= */

function allQuestionsAnswered() {
    for (let question = 1; question <= totalQuestions; question++) {
        if (currentRatings[question] === null) {
            return false;
        }
    }

    return true;
}


/* =========================================
   SUBMIT SURVEY
========================================= */

surveyForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!allQuestionsAnswered()) {
        alert("Please answer all 12 questions before submitting.");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending Response...";

    const surveyData = {
        surveyTitle: "Benedicto College Clinic Area Survey",
        submittedAt: new Date().toISOString(),
        responses: collectResponses()
    };

    if (!SUBMISSION_URL) {
        try {
            localStorage.setItem(
                "benedictoClinicSurveyResponse",
                JSON.stringify(surveyData)
            );

            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccessNotification();
        } catch (error) {
            console.error(error);
            showFailedNotification();
        }

        submitButton.disabled = false;
        submitButton.textContent = "Submit My Response ✓";
        return;
    }

    try {
        const form = document.createElement("form");

        form.method = "POST";
        form.action = SUBMISSION_URL;
        form.target = "hiddenSubmitFrame";

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = "payload";
        input.value = JSON.stringify(surveyData);

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        form.remove();

        showSuccessNotification();
    } catch (error) {
        console.error("Submission error:", error);
        showFailedNotification();
    }

    submitButton.disabled = false;
    submitButton.textContent = "Submit My Response ✓";
});


/* =========================================
   KEYBOARD NAVIGATION
========================================= */

document.addEventListener("keydown", function(event) {
    if (
        event.target.tagName === "INPUT" &&
        event.target.type !== "radio"
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextSlide();
    }

    if (event.key === "ArrowLeft") {
        previousSlide();
    }
});


/* =========================================
   PREVENT ESCAPE FROM CLOSING NOTIFICATION
========================================= */

document.addEventListener("keydown", function(event) {
    if (
        event.key === "Escape" &&
        notificationOverlay.classList.contains("show")
    ) {
        event.preventDefault();
    }
});


/* =========================================
   BACKGROUND VIDEO FALLBACK
========================================= */

const backgroundVideo = document.getElementById("backgroundVideo");

if (backgroundVideo) {
    backgroundVideo.addEventListener("error", function() {
        console.warn(
            "Background video is hidden because the survey uses the requested light gray background."
        );
    });
}
