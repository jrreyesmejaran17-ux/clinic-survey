/* =========================================
   BENEDICTO COLLEGE CLINIC SURVEY
========================================= */


/*
    IMPORTANT:

    Replace this URL with your actual backend,
    Google Apps Script Web App, Formspree endpoint,
    or other API endpoint.

    Example:

    const SUBMISSION_URL =
        "https://script.google.com/macros/s/YOUR_ID/exec";

*/

const SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbz29SMlxM6YxEBtqkeCkB2VJF122m8ya2o2NieiRWqo40x5Q8jypc3p6IFGByf5X71q/exec";


/* =========================================
   SURVEY VARIABLES
========================================= */

const slides =
    document.querySelectorAll(".survey-slide");

const totalSlides =
    slides.length;

const totalQuestions = 12;

let currentSlide = 0;

const surveyForm =
    document.getElementById("surveyForm");

const progressBar =
    document.getElementById("progressBar");

const slideCounter =
    document.getElementById("slideCounter");

const progressPercentage =
    document.getElementById("progressPercentage");

const answeredCount =
    document.getElementById("answeredCount");

const submitButton =
    document.getElementById("submitButton");


/* =========================================
   NOTIFICATION ELEMENTS
========================================= */

const notificationOverlay =
    document.getElementById("notificationOverlay");

const notificationBox =
    document.getElementById("notificationBox");

const notificationIcon =
    document.getElementById("notificationIcon");

const notificationTitle =
    document.getElementById("notificationTitle");

const notificationMessage =
    document.getElementById("notificationMessage");

const notificationButton =
    document.getElementById("notificationButton");


/* =========================================
   VALIDATION MESSAGE
========================================= */

const validationMessage =
    document.getElementById("validationMessage");


/* =========================================
   SHOW INITIAL SLIDE
========================================= */

updateSlide();


/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide() {

    /*
        If this is a question slide,
        make sure an answer was selected.
    */

    if (isQuestionSlide(currentSlide)) {

        const questionNumber =
            getQuestionNumber(currentSlide);

        const selectedAnswer =
            document.querySelector(
                `input[name="q${questionNumber}"]:checked`
            );

        if (!selectedAnswer) {

            showValidationMessage();

            return;
        }
    }


    /*
        Move to the next slide.
    */

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

    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    /*
        Calculate progress.
    */

    const progress =
        (currentSlide / (totalSlides - 1)) * 100;


    progressBar.style.width =
        `${progress}%`;


    progressPercentage.textContent =
        `${Math.round(progress)}%`;


    /*
        Update slide label.
    */

    if (currentSlide === 0) {

        slideCounter.textContent =
            "Introduction";

    } else if (currentSlide === 1) {

        slideCounter.textContent =
            "Instructions";

    } else if (currentSlide >= 2 && currentSlide <= 13) {

        const questionNumber =
            currentSlide - 1;

        slideCounter.textContent =
            `Question ${questionNumber} of ${totalQuestions}`;

    } else {

        slideCounter.textContent =
            "Submission";

    }


    /*
        Update answer counter.
    */

    updateAnsweredCount();

}


/* =========================================
   DETERMINE QUESTION SLIDE
========================================= */

function isQuestionSlide(slideIndex) {

    return (
        slideIndex >= 2 &&
        slideIndex <= 13
    );

}


/* =========================================
   GET QUESTION NUMBER
========================================= */

function getQuestionNumber(slideIndex) {

    return slideIndex - 1;

}


/* =========================================
   UPDATE ANSWERED COUNT
========================================= */

function updateAnsweredCount() {

    let answered = 0;

    for (
        let question = 1;
        question <= totalQuestions;
        question++
    ) {

        const answer =
            document.querySelector(
                `input[name="q${question}"]:checked`
            );

        if (answer) {

            answered++;

        }

    }


    answeredCount.textContent =
        `${answered} / ${totalQuestions} questions answered`;

}


/* =========================================
   VALIDATION MESSAGE
========================================= */

function showValidationMessage() {

    validationMessage.classList.add("show");

    setTimeout(
        () => {

            validationMessage.classList.remove("show");

        },
        2500
    );

}


/* =========================================
   CLOSE NOTIFICATION
========================================= */

function closeNotification() {

    notificationOverlay.classList.remove("show");

    notificationOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================
   SHOW SUCCESS NOTIFICATION
========================================= */

function showSuccessNotification() {

    notificationBox.classList.remove("failed");

    notificationIcon.textContent =
        "✓";

    notificationTitle.textContent =
        "Response Sent!";

    notificationMessage.textContent =
        "Your survey response has been successfully submitted. Thank you for sharing your experience with the Benedicto College Clinic.";

    notificationButton.textContent =
        "Finish";

    notificationButton.onclick =
        closeNotification;

    notificationOverlay.classList.add("show");

    notificationOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================
   SHOW FAILED NOTIFICATION
========================================= */

function showFailedNotification() {

    notificationBox.classList.add("failed");

    notificationIcon.textContent =
        "✕";

    notificationTitle.textContent =
        "Submission Failed";

    notificationMessage.textContent =
        "We were unable to send your response. Please check your internet connection and try again.";

    notificationButton.textContent =
        "Try Again";

    notificationButton.onclick =
        closeNotification;

    notificationOverlay.classList.add("show");

    notificationOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================
   COLLECT RESPONSES
========================================= */

function collectResponses() {

    const responses = {};

    for (
        let question = 1;
        question <= totalQuestions;
        question++
    ) {

        const selected =
            document.querySelector(
                `input[name="q${question}"]:checked`
            );

        responses[`question_${question}`] =
            selected
                ? selected.value
                : null;

    }


    return responses;

}


/* =========================================
   CHECK ALL QUESTIONS
========================================= */

function allQuestionsAnswered() {

    for (
        let question = 1;
        question <= totalQuestions;
        question++
    ) {

        const selected =
            document.querySelector(
                `input[name="q${question}"]:checked`
            );

        if (!selected) {

            return false;

        }

    }

    return true;

}


/* =========================================
   SUBMIT SURVEY
========================================= */

surveyForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        /*
            Make absolutely sure every question
            has an answer.
        */

        if (!allQuestionsAnswered()) {

            alert(
                "Please answer all 12 questions before submitting."
            );

            return;

        }


        /*
            Prevent multiple submissions.
        */

        submitButton.disabled = true;

        submitButton.textContent =
            "Sending Response...";


        /*
            Collect survey information.
        */

        const surveyData = {

            surveyTitle:
                "Benedicto College Clinic Area Survey",

            submittedAt:
                new Date().toISOString(),

            responses:
                collectResponses()

        };


        /*
            If no API URL has been configured,
            save a local backup instead.

            This is useful during development.
        */

        if (!SUBMISSION_URL) {

            try {

                localStorage.setItem(
                    "benedictoClinicSurveyResponse",
                    JSON.stringify(surveyData)
                );


                /*
                    Simulate successful submission
                    during local testing.
                */

                await new Promise(
                    resolve =>
                        setTimeout(resolve, 1000)
                );


                showSuccessNotification();

            } catch (error) {

                console.error(error);

                showFailedNotification();

            }


            submitButton.disabled = false;

            submitButton.textContent =
                "Submit Survey ✓";

            return;

        }


        /*
            ACTUAL SERVER SUBMISSION
        */

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


            /*
                Submission succeeded.
            */

            showSuccessNotification();


        } catch (error) {

            console.error(
                "Submission error:",
                error
            );

            showFailedNotification();

        }


        /*
            Re-enable submit button.
        */

        submitButton.disabled = false;

        submitButton.textContent =
            "Submit Survey ✓";

    }
);


/* =========================================
   UPDATE COUNTER WHEN ANSWER IS SELECTED
========================================= */

const allRadioButtons =
    document.querySelectorAll(
        'input[type="radio"]'
    );

allRadioButtons.forEach(
    radio => {

        radio.addEventListener(
            "change",
            function() {

                updateAnsweredCount();

            }
        );

    }
);


/* =========================================
   KEYBOARD NAVIGATION
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
            Do not interfere while typing
            in text fields.
        */

        if (
            event.target.tagName === "INPUT" &&
            event.target.type !== "radio"
        ) {

            return;

        }


        /*
            Arrow Right = Next
        */

        if (event.key === "ArrowRight") {

            nextSlide();

        }


        /*
            Arrow Left = Previous
        */

        if (event.key === "ArrowLeft") {

            previousSlide();

        }

    }
);


/* =========================================
   PREVENT ESCAPE FROM CLOSING NOTIFICATION
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            notificationOverlay.classList.contains("show")
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================
   VIDEO FALLBACK
========================================= */

const backgroundVideo =
    document.getElementById("backgroundVideo");

backgroundVideo.addEventListener(
    "error",
    function() {

        console.warn(
            "Background video could not be loaded. The background fallback will be used."
        );

    }
);