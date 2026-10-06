(function () {

    // =========================================================
    // AUTH
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


    // =========================================================
    // CHECK ASSESSMENT
    // =========================================================

    if (!assessmentId) {

        if (questionList) {

            questionList.innerHTML = `
                <p class="empty-education">
                    Assessment not found.
                </p>
            `;
        }

    } else {

        loadAssessment();
        loadQuestions();
    }


    // =========================================================
    // LOAD ASSESSMENT
    // =========================================================

    async function loadAssessment() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/assessments/${assessmentId}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    "You are not authorized to view this assessment."
                );
            }


            if (!response.ok) {

                throw new Error(
                    "Could not load assessment."
                );
            }


            const assessment =
                await response.json();


            const assessmentTitle =
                document.getElementById(
                    "assessmentTitle"
                );

            const assessmentDescription =
                document.getElementById(
                    "assessmentDescription"
                );


            if (assessmentTitle) {

                assessmentTitle.textContent =
                    assessment.title || "";
            }


            if (assessmentDescription) {

                assessmentDescription.textContent =
                    assessment.description || "";
            }


        } catch (error) {

            const assessmentDescription =
                document.getElementById(
                    "assessmentDescription"
                );


            if (assessmentDescription) {

                assessmentDescription.textContent =
                    error.message;
            }


            console.error(
                "Error loading assessment:",
                error
            );
        }
    }


    // =========================================================
    // LOAD QUESTIONS
    // =========================================================

    async function loadQuestions() {

        if (!questionList) {

            console.error(
                "questionList element not found."
            );

            return;
        }


        questionList.innerHTML = `
            <p class="empty-education">
                Loading questions...
            </p>
        `;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/assessments/${assessmentId}/questions`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            console.log(
                "Questions response status:",
                response.status
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    "You are not authorized to view these questions."
                );
            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Load questions failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    "Could not load questions."
                );
            }


            const questions =
                await response.json();


            console.log(
                "Questions received:",
                questions
            );


            displayQuestions(questions);


        } catch (error) {

            console.error(
                "Error loading questions:",
                error
            );


            questionList.innerHTML = `
                <p class="empty-education">
                    ${escapeHtml(error.message)}
                </p>
            `;
        }
    }


    // =========================================================
    // DISPLAY QUESTIONS
    // =========================================================

    function displayQuestions(questions) {

        if (!Array.isArray(questions)) {

            console.error(
                "Expected an array of questions:",
                questions
            );

            questionList.innerHTML = `
                <p class="empty-education">
                    Invalid question data received.
                </p>
            `;

            return;
        }


        questionList.innerHTML = "";


        if (questionCount) {

            questionCount.textContent =
                `${questions.length} ${
                    questions.length === 1
                        ? "Question"
                        : "Questions"
                }`;
        }


        // =====================================================
        // NO QUESTIONS
        // =====================================================

        if (questions.length === 0) {

            questionList.innerHTML = `
                <p class="empty-education">
                    No questions added yet.
                </p>
            `;

            return;
        }


        // =====================================================
        // DISPLAY QUESTIONS
        // =====================================================

        questions.forEach(
            function (question, index) {

                const item =
                    document.createElement("div");

                item.className =
                    "education-item";


                item.innerHTML = `

                    <div class="education-item-header">

                        <h3>
                            ${index + 1}.
                            ${escapeHtml(
                                question.questionText
                            )}
                        </h3>

                        <button
                            type="button"
                            class="delete-question-btn"
                            data-question-id="${question.id}">
                            Delete
                        </button>

                    </div>


                    <p>
                        A.
                        ${escapeHtml(
                            question.optionA
                        )}
                    </p>


                    <p>
                        B.
                        ${escapeHtml(
                            question.optionB
                        )}
                    </p>


                    <p>
                        C.
                        ${escapeHtml(
                            question.optionC
                        )}
                    </p>


                    <p>
                        D.
                        ${escapeHtml(
                            question.optionD
                        )}
                    </p>


                    <p>
                        <strong>
                            Correct Answer:
                        </strong>

                        ${escapeHtml(
                            question.correctAnswer
                        )}
                    </p>

                `;


                questionList.appendChild(item);
            }
        );


        // =====================================================
        // DELETE BUTTONS
        // =====================================================

        const deleteButtons =
            questionList.querySelectorAll(
                ".delete-question-btn"
            );


        deleteButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const questionId =
                            this.dataset.questionId;

                        deleteQuestion(questionId);
                    }
                );
            }
        );
    }


    // =========================================================
    // ADD QUESTION
    // =========================================================

    if (questionForm) {

        questionForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (!assessmentId) {

                    showMessage(
                        "Assessment not found.",
                        true
                    );

                    return;
                }


                showMessage(
                    "Adding question...",
                    false
                );


                const questionData = {

                    questionText:
                        document
                            .getElementById(
                                "questionText"
                            )
                            ?.value
                            .trim() || "",


                    optionA:
                        document
                            .getElementById(
                                "optionA"
                            )
                            ?.value
                            .trim() || "",


                    optionB:
                        document
                            .getElementById(
                                "optionB"
                            )
                            ?.value
                            .trim() || "",


                    optionC:
                        document
                            .getElementById(
                                "optionC"
                            )
                            ?.value
                            .trim() || "",


                    optionD:
                        document
                            .getElementById(
                                "optionD"
                            )
                            ?.value
                            .trim() || "",


                    correctAnswer:
                        document
                            .getElementById(
                                "correctAnswer"
                            )
                            ?.value || ""
                };


                // =================================================
                // VALIDATION
                // =================================================

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


                console.log(
                    "Adding question:",
                    questionData
                );


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/assessments/${assessmentId}/questions`,
                            {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${authToken}`
                                },

                                body:
                                    JSON.stringify(
                                        questionData
                                    )
                            }
                        );


                    console.log(
                        "Add question status:",
                        response.status
                    );


                    // =================================================
                    // READ RESPONSE SAFELY
                    // =================================================

                    const responseText =
                        await response.text();


                    let data = {};

                    if (responseText) {

                        try {

                            data =
                                JSON.parse(
                                    responseText
                                );

                        } catch (parseError) {

                            console.warn(
                                "Response was not JSON:",
                                responseText
                            );
                        }
                    }


                    // =================================================
                    // ERROR
                    // =================================================

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            responseText ||
                            "Could not add question."
                        );
                    }


                    // =================================================
                    // SUCCESS
                    // =================================================

                    showMessage(
                        "Question added successfully!",
                        false
                    );


                    questionForm.reset();


                    // Reload question list

                    await loadQuestions();


                } catch (error) {

                    console.error(
                        "Error adding question:",
                        error
                    );


                    showMessage(
                        error.message,
                        true
                    );
                }
            }
        );
    }


    // =========================================================
    // DELETE QUESTION
    // =========================================================

    async function deleteQuestion(questionId) {

        if (
            !confirm(
                "Delete this question?"
            )
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/assessments/${assessmentId}/questions/${questionId}`,
                    {
                        method: "DELETE",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    "You are not authorized to delete this question."
                );
            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Delete question failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    "Could not delete question."
                );
            }


            showMessage(
                "Question deleted successfully.",
                false
            );


            await loadQuestions();


        } catch (error) {

            console.error(
                "Error deleting question:",
                error
            );


            showMessage(
                error.message,
                true
            );
        }
    }


    // =========================================================
    // MESSAGE
    // =========================================================

    function showMessage(
        message,
        isError
    ) {

        if (!questionMessage) {
            return;
        }


        questionMessage.textContent =
            message;


        questionMessage.style.color =
            isError
                ? "#dc2626"
                : "#16a34a";
    }


    // =========================================================
    // HTML ESCAPE
    // =========================================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
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