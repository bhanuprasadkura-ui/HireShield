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

    const assessmentSelect =
        document.getElementById("assessmentSelect");

    const resultList =
        document.getElementById("resultList");

    const resultCount =
        document.getElementById("resultCount");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // =========================================================
    // LOAD ASSESSMENTS
    // =========================================================

    async function loadAssessments() {

        if (!assessmentSelect) {
            console.error(
                "assessmentSelect element not found."
            );
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/assessments/my-assessments`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            console.log(
                "Assessments response status:",
                response.status
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    "You are not authorized to view assessments."
                );
            }


            if (!response.ok) {

                throw new Error(
                    "Could not load assessments."
                );
            }


            const assessments =
                await response.json();


            console.log(
                "Assessments received:",
                assessments
            );


            assessmentSelect.innerHTML =
                `<option value="">
                    Select an assessment
                </option>`;


            if (
                !Array.isArray(assessments) ||
                assessments.length === 0
            ) {

                assessmentSelect.innerHTML =
                    `<option value="">
                        No assessments found
                    </option>`;

                return;
            }


            assessments.forEach(
                function (assessment) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        assessment.id;


                    option.textContent =
                        assessment.title;


                    assessmentSelect.appendChild(
                        option
                    );
                }
            );


        } catch (error) {

            console.error(
                "Error loading assessments:",
                error
            );


            assessmentSelect.innerHTML =
                `<option value="">
                    Could not load assessments
                </option>`;
        }
    }


    // =========================================================
    // SELECT ASSESSMENT
    // =========================================================

    if (assessmentSelect) {

        assessmentSelect.addEventListener(
            "change",
            async function () {

                const assessmentId =
                    assessmentSelect.value;


                if (!assessmentId) {

                    if (resultList) {

                        resultList.innerHTML =
                            `<p class="empty-education">
                                Select an assessment to view results.
                            </p>`;
                    }


                    if (resultCount) {

                        resultCount.textContent =
                            "0 Results";
                    }


                    return;
                }


                await loadResults(
                    assessmentId
                );
            }
        );
    }


    // =========================================================
    // LOAD RESULTS
    // =========================================================

    async function loadResults(
        assessmentId
    ) {

        if (!resultList) {
            return;
        }


        resultList.innerHTML =
            `<p class="empty-education">
                Loading results...
            </p>`;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/recruiter/assessments/${assessmentId}/results`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            console.log(
                "Results response status:",
                response.status
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                throw new Error(
                    "You are not authorized to view these results."
                );
            }


            if (!response.ok) {

                throw new Error(
                    "Could not load results."
                );
            }


            const results =
                await response.json();


            console.log(
                "Results received:",
                results
            );


            displayResults(
                results
            );


        } catch (error) {

            console.error(
                "Error loading results:",
                error
            );


            resultList.innerHTML =
                `<p class="empty-education">
                    ${escapeHtml(error.message)}
                </p>`;

            if (resultCount) {

                resultCount.textContent =
                    "0 Results";
            }
        }
    }


    // =========================================================
    // DISPLAY RESULTS
    // =========================================================

    function displayResults(
        results
    ) {

        if (!resultList) {
            return;
        }


        resultList.innerHTML = "";


        if (resultCount) {

            resultCount.textContent =
                `${results.length} ${
                    results.length === 1
                        ? "Result"
                        : "Results"
                }`;
        }


        if (results.length === 0) {

            resultList.innerHTML =
                `<p class="empty-education">
                    No candidates have completed this assessment yet.
                </p>`;

            return;
        }


        results.forEach(
            function (result) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "education-item";


                item.innerHTML = `

                    <div class="education-item-header">

                        <div>

                            <h3>
                                Candidate #${escapeHtml(
                                    result.candidateId
                                )}
                            </h3>

                            <p class="education-institution">
                                ${escapeHtml(
                                    result.assessmentTitle ||
                                    "Assessment"
                                )}
                            </p>

                            <p>
                                <strong>
                                    Candidate:
                                </strong>

                                ${escapeHtml(
                                    result.candidateName ||
                                    "Unknown"
                                )}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>

                                ${escapeHtml(
                                    result.candidateEmail ||
                                    "Not available"
                                )}
                            </p>

                        </div>


                        <span
                            class="application-status status-selected"
                        >
                            ${escapeHtml(
                                result.status ||
                                "COMPLETED"
                            )}
                        </span>

                    </div>


                    <div class="education-details">

                        <span class="education-detail">

                            Score:

                            ${escapeHtml(
                                result.score
                            )}/
                            ${escapeHtml(
                                result.totalQuestions
                            )}

                        </span>


                        <span class="education-detail">

                            Percentage:

                            ${escapeHtml(
                                result.percentage
                            )}%

                        </span>

                    </div>

                `;


                resultList.appendChild(
                    item
                );
            }
        );
    }


    // =========================================================
    // HTML ESCAPE
    // =========================================================

    function escapeHtml(value) {

        const div =
            document.createElement(
                "div"
            );


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


    // =========================================================
    // START
    // =========================================================

    loadAssessments();

})();