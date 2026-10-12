
(function () {
    "use strict";

    // =========================================================
    // API CONFIGURATION
    // =========================================================

    const QUESTIONS_API_URL =
        "https://hireshield-m5dh.onrender.com/api";

    // =========================================================
    // AUTHENTICATION
    // =========================================================

    const authToken = getToken();

    if (!authToken) {
        window.location.href = "../login.html";
        return;
    }

    // =========================================================
    // HTML ELEMENTS
    // =========================================================

    const questionForm =
        document.getElementById("questionForm");

    const questionMessage =
        document.getElementById("questionMessage");

    const questionList =
        document.getElementById("questionList");

    const questionCount =
        document.getElementById("questionCount");

    const logoutBtn =
        document.getElementById("logoutBtn");

    // =========================================================
    // ASSESSMENT ID
    // =========================================================

    const params =
        new URLSearchParams(window.location.search);

    const assessmentId =
        params.get("assessmentId");

    if (!assessmentId || !/^\d+$/.test(assessmentId)) {
        if (questionList) {
            questionList.textContent =
                "Assessment not found. Please open an assessment from your assessments page.";
        }
        return;
    }

    // =========================================================
    // LOAD ASSESSMENT AND QUESTIONS
    // =========================================================

    loadAssessment();
    loadQuestions();

    // =========================================================
    // LOAD ASSESSMENT DETAILS
    // =========================================================

    async function loadAssessment() {
        try {
            const response = await fetch(
                QUESTIONS_API_URL +
                    "/assessments/" +
                    encodeURIComponent(assessmentId),
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    response.status === 401 ||
                    response.status === 403
                        ? "You are not authorized to view this assessment. Please log in again."
                        : "Could not load assessment. Server returned " +
                              response.status +
                              "."
                );
            }

            const assessment = await response.json();

            const assessmentTitle =
                document.getElementById("assessmentTitle");

            const assessmentDescription =
                document.getElementById("assessmentDescription");

            if (assessmentTitle) {
                assessmentTitle.textContent =
                    assessment.title || "";
            }

            if (assessmentDescription) {
                assessmentDescription.textContent =
                    assessment.description || "";
            }
        } catch (error) {
            console.error("Error loading assessment:", error);

            const assessmentDescription =
                document.getElementById("assessmentDescription");

            if (assessmentDescription) {
                assessmentDescription.textContent =
                    error.message || "Could not load assessment.";
            }
        }
    }

    // =========================================================
    // LOAD QUESTIONS
    // =========================================================

    async function loadQuestions() {
        if (!questionList) {
            console.error("questionList element not found.");
            return;
        }

        questionList.textContent = "Loading questions...";

        try {
            const response = await fetch(
                QUESTIONS_API_URL +
                    "/assessments/" +
                    encodeURIComponent(assessmentId) +
                    "/questions",
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Load questions failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    response.status === 401 ||
                    response.status === 403
                        ? "You are not authorized to view these questions. Please log in again."
                        : "Could not load questions. Server returned " +
                              response.status +
                              "."
                );
            }

            const questions = await response.json();

            displayQuestions(questions);
        } catch (error) {
            console.error("Error loading questions:", error);

            questionList.textContent =
                error.message || "Could not load questions.";

            if (questionCount) {
                questionCount.textContent = "0 Questions";
            }
        }
    }

    // =========================================================
    // DISPLAY QUESTIONS
    // =========================================================

    function displayQuestions(questions) {
        if (!Array.isArray(questions)) {
            questionList.textContent =
                "Invalid question data received.";
            return;
        }

        questionList.replaceChildren();

        if (questionCount) {
            questionCount.textContent =
                questions.length +
                (questions.length === 1
                    ? " Question"
                    : " Questions");
        }

        if (questions.length === 0) {
            questionList.textContent =
                "No questions added yet.";
            return;
        }

        questions.forEach(function (question, index) {
            const item = document.createElement("div");
            item.className = "education-item";

            const header = document.createElement("div");
            header.className = "education-item-header";

            const heading = document.createElement("h3");
            heading.textContent =
                (index + 1) + ". " +
                (question.questionText || "");

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-question-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                deleteQuestion(question.id);
            });

            header.appendChild(heading);
            header.appendChild(deleteButton);
            item.appendChild(header);

            ["A", "B", "C", "D"].forEach(function (letter) {
                const paragraph = document.createElement("p");
                const optionValue =
                    question["option" + letter] || "";

                paragraph.textContent =
                    letter + ". " + optionValue;

                item.appendChild(paragraph);
            });

            const answer = document.createElement("p");
            const answerLabel = document.createElement("strong");

            answerLabel.textContent = "Correct Answer: ";
            answer.appendChild(answerLabel);
            answer.appendChild(
                document.createTextNode(
                    question.correctAnswer || ""
                )
            );

            item.appendChild(answer);
            questionList.appendChild(item);
        });
    }

    // =========================================================
    // ADD QUESTION
    // =========================================================

    if (questionForm) {
        questionForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const questionData = {
                    questionText:
                        document.getElementById("questionText")
                            ?.value.trim() || "",

                    optionA:
                        document.getElementById("optionA")
                            ?.value.trim() || "",

                    optionB:
                        document.getElementById("optionB")
                            ?.value.trim() || "",

                    optionC:
                        document.getElementById("optionC")
                            ?.value.trim() || "",

                    optionD:
                        document.getElementById("optionD")
                            ?.value.trim() || "",

                    correctAnswer:
                        document.getElementById("correctAnswer")
                            ?.value || ""
                };

                if (
                    !questionData.questionText ||
                    !questionData.optionA ||
                    !questionData.optionB ||
                    !questionData.optionC ||
                    !questionData.optionD ||
                    !questionData.correctAnswer
                ) {
                    showMessage(
                        "Please fill all question fields and select the correct answer.",
                        true
                    );
                    return;
                }

                showMessage("Adding question...", false);

                const submitButton =
                    questionForm.querySelector(
                        'button[type="submit"]'
                    );

                if (submitButton) {
                    submitButton.disabled = true;
                }

                try {
                    const response = await fetch(
                        QUESTIONS_API_URL +
                            "/assessments/" +
                            encodeURIComponent(assessmentId) +
                            "/questions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization:
                                    "Bearer " + authToken
                            },
                            body: JSON.stringify(questionData)
                        }
                    );

                    const responseText =
                        await response.text();

                    let data = {};

                    if (responseText) {
                        try {
                            data = JSON.parse(responseText);
                        } catch (parseError) {
                            data = {};
                        }
                    }

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            responseText ||
                            "Could not add question. Server returned " +
                                response.status +
                                "."
                        );
                    }

                    showMessage(
                        "Question added successfully!",
                        false
                    );

                    questionForm.reset();

                    await loadQuestions();
                } catch (error) {
                    console.error("Error adding question:", error);

                    showMessage(
                        error.message || "Could not add question.",
                        true
                    );
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }
        );
    }

    // =========================================================
    // DELETE QUESTION
    // =========================================================

    async function deleteQuestion(questionId) {
        if (!confirm("Delete this question?")) {
            return;
        }

        try {
            const response = await fetch(
                QUESTIONS_API_URL +
                    "/assessments/" +
                    encodeURIComponent(assessmentId) +
                    "/questions/" +
                    encodeURIComponent(questionId),
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText ||
                    "Could not delete question. Server returned " +
                        response.status +
                        "."
                );
            }

            showMessage(
                "Question deleted successfully.",
                false
            );

            await loadQuestions();
        } catch (error) {
            console.error("Error deleting question:", error);

            showMessage(
                error.message || "Could not delete question.",
                true
            );
        }
    }

    // =========================================================
    // DISPLAY MESSAGES
    // =========================================================

    function showMessage(message, isError) {
        if (!questionMessage) {
            return;
        }

        questionMessage.textContent = message;
        questionMessage.style.color =
            isError ? "#dc2626" : "#16a34a";
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            removeToken();

            localStorage.removeItem("hireshield_role");
            localStorage.removeItem("hireshield_user");

            window.location.href = "../login.html";
        });
    }
})();
