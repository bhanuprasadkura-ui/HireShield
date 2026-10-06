(function () {

    const questionsContainer =
        document.getElementById("questionsContainer");

    const submitButton =
        document.getElementById("submitAssessmentBtn");

    const assessmentMessage =
        document.getElementById("assessmentMessage");

    const assessmentTitle =
        document.getElementById("assessmentTitle");

    const assessmentDescription =
        document.getElementById("assessmentDescription");

    const assessmentDuration =
        document.getElementById("assessmentDuration");

    const questionCount =
        document.getElementById("questionCount");

    const authToken = getToken();

    if (!authToken) {
        window.location.href = "../login.html";
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const assessmentId =
        params.get("assessmentId");


    /* ================= CHECK ASSESSMENT ID ================= */

    if (!assessmentId) {

        questionsContainer.innerHTML =
            `<p class="empty-education">
                Assessment not found.
            </p>`;

    } else {

        loadAssessment();

    }


    /* ================= LOAD ASSESSMENT ================= */

    async function loadAssessment() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/candidate/assessments/${assessmentId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Assessment loading error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    "Could not load assessment."
                );
            }


            const assessment =
                await response.json();


            console.log(
                "Assessment loaded:",
                assessment
            );


            assessmentTitle.textContent =
                assessment.title || "Assessment";


            assessmentDescription.textContent =
                assessment.description || "";


            assessmentDuration.textContent =
                `Duration: ${assessment.duration || "Not specified"}`;


            questionCount.textContent =
                `${assessment.totalQuestions || 0} Questions`;


            displayQuestions(
                assessment.questions
            );


        } catch (error) {

            console.error(
                "Could not load assessment:",
                error
            );

            questionsContainer.innerHTML =
                `<p class="empty-education">
                    ${error.message}
                </p>`;
        }
    }


    /* ================= DISPLAY QUESTIONS ================= */

    function displayQuestions(questions) {

        questionsContainer.innerHTML = "";


        if (!questions || questions.length === 0) {

            questionsContainer.innerHTML =
                `<p class="empty-education">
                    No questions available.
                </p>`;

            return;
        }


        questions.forEach(function (question, index) {

            const questionBox =
                document.createElement("div");


            questionBox.className =
                "assessment-question";


            questionBox.innerHTML = `

                <h3>
                    ${index + 1}. ${question.questionText}
                </h3>


                <label class="assessment-option">

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="A">

                    <span>
                        A. ${question.optionA}
                    </span>

                </label>


                <label class="assessment-option">

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="B">

                    <span>
                        B. ${question.optionB}
                    </span>

                </label>


                <label class="assessment-option">

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="C">

                    <span>
                        C. ${question.optionC}
                    </span>

                </label>


                <label class="assessment-option">

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="D">

                    <span>
                        D. ${question.optionD}
                    </span>

                </label>

            `;


            questionsContainer.appendChild(
                questionBox
            );

        });


        submitButton.style.display =
            "block";
    }


    /* ================= SUBMIT ASSESSMENT ================= */

    submitButton.addEventListener(
        "click",
        async function () {

            const selectedAnswers = {};


            const questionElements =
                document.querySelectorAll(
                    ".assessment-question"
                );


            questionElements.forEach(
                function (questionBox) {

                    const selected =
                        questionBox.querySelector(
                            "input[type='radio']:checked"
                        );


                    if (selected) {

                        const questionId =
                            selected.name.replace(
                                "question-",
                                ""
                            );


                        selectedAnswers[questionId] =
                            selected.value;
                    }

                }
            );


            if (
                Object.keys(selectedAnswers).length === 0
            ) {

                assessmentMessage.textContent =
                    "Please answer at least one question.";

                assessmentMessage.style.color =
                    "#dc2626";

                return;
            }


            submitButton.disabled =
                true;


            assessmentMessage.textContent =
                "Submitting assessment...";


            assessmentMessage.style.color =
                "";


            try {

                const response = await fetch(
                    `${API_BASE_URL}/candidate/assessments/submit`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${authToken}`
                        },

                        body: JSON.stringify({
                            assessmentId:
                                Number(assessmentId),

                            answers:
                                selectedAnswers
                        })
                    }
                );


                const responseText =
                    await response.text();


                let data = {};

                if (responseText) {

                    try {

                        data =
                            JSON.parse(responseText);

                    } catch (parseError) {

                        console.error(
                            "Invalid server response:",
                            responseText
                        );
                    }
                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not submit assessment."
                    );
                }


                assessmentMessage.innerHTML = `

                    Assessment submitted successfully!<br>

                    Score:
                    <strong>
                        ${data.score}/${data.totalQuestions}
                    </strong>
                    <br>

                    Percentage:
                    <strong>
                        ${data.percentage}%
                    </strong>

                `;


                assessmentMessage.style.color =
                    "#16a34a";


                submitButton.style.display =
                    "none";


            } catch (error) {

                console.error(
                    "Assessment submission error:",
                    error
                );


                assessmentMessage.textContent =
                    error.message;


                assessmentMessage.style.color =
                    "#dc2626";


                submitButton.disabled =
                    false;
            }

        }
    );


    /* ================= LOGOUT ================= */

    const logoutButton =
        document.getElementById("logoutBtn");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                removeToken();


                localStorage.removeItem(
                    "hireshield_role"
                );


                localStorage.removeItem(
                    "hireshield_user"
                );


                window.location.href =
                    "../login.html";

            }
        );

    }

})();