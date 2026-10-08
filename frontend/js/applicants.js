(function () {

    const API_BASE_URL_LOCAL =
        "http://localhost:8080/api";

    const jobSelect =
        document.getElementById("jobSelect");

    const applicantList =
        document.getElementById("applicantList");

    const applicantCount =
        document.getElementById("applicantCount");

    const authToken =
        getToken();

    let assessments = [];


    /* ================= AUTH ================= */

    if (!authToken) {

        window.location.href =
            "../login.html";

        return;
    }


    /* ================= LOAD MY JOBS ================= */

    async function loadJobs() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL_LOCAL}/jobs/my-jobs`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Jobs API error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not load jobs. Server returned ${response.status}.`
                );
            }


            const jobs =
                await response.json();


            jobSelect.innerHTML =
                `<option value="">
                    Select a job
                </option>`;


            jobs.forEach(function (job) {

                const option =
                    document.createElement("option");


                option.value =
                    job.id;


                option.textContent =
                    `${job.title} - ${job.company}`;


                jobSelect.appendChild(option);

            });


        } catch (error) {

            console.error(
                "Could not load jobs:",
                error
            );


            jobSelect.innerHTML =
                `<option value="">
                    Could not load jobs
                </option>`;
        }

    }


    /* ================= LOAD MY ASSESSMENTS ================= */

    async function loadAssessments() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL_LOCAL}/assessments/my-assessments`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Assessments API error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not load assessments. Server returned ${response.status}.`
                );
            }


            assessments =
                await response.json();


            console.log(
                "Recruiter assessments:",
                assessments
            );


        } catch (error) {

            console.error(
                "Could not load assessments:",
                error
            );


            assessments = [];
        }

    }


    /* ================= JOB CHANGE ================= */

    jobSelect.addEventListener(
        "change",
        async function () {

            const jobId =
                jobSelect.value;


            if (!jobId) {

                applicantList.innerHTML =
                    `<p class="empty-education">
                        Select a job to view applicants.
                    </p>`;


                applicantCount.textContent =
                    "0 Applicants";


                return;
            }


            await loadApplicants(jobId);

        }
    );


    /* ================= LOAD APPLICANTS ================= */

    async function loadApplicants(jobId) {

        applicantList.innerHTML =
            `<p class="empty-education">
                Loading applicants...
            </p>`;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL_LOCAL}/applications/job/${jobId}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Applicants API error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    `Could not load applicants. Server returned ${response.status}.`
                );
            }


            const applicants =
                await response.json();


            displayApplicants(applicants);


        } catch (error) {

            console.error(
                "Could not load applicants:",
                error
            );


            applicantList.innerHTML =
                `<p class="empty-education">
                    ${escapeHtml(error.message)}
                </p>`;

        }

    }


    /* ================= DISPLAY APPLICANTS ================= */

    function displayApplicants(applicants) {

        applicantList.innerHTML = "";


        applicantCount.textContent =
            `${applicants.length} ${
                applicants.length === 1
                    ? "Applicant"
                    : "Applicants"
            }`;


        if (applicants.length === 0) {

            applicantList.innerHTML =
                `<p class="empty-education">
                    No applicants for this job yet.
                </p>`;


            return;
        }


        applicants.forEach(
            function (application) {

                const item =
                    document.createElement("div");


                item.className =
                    "education-item";


                /* ================= ASSESSMENT OPTIONS ================= */

                let assessmentOptions =
                    `<option value="">
                        Select an assessment
                    </option>`;


                assessments.forEach(
                    function (assessment) {

                        const selected =
                            application.assessmentId ===
                            assessment.id
                                ? "selected"
                                : "";


                        assessmentOptions += `

                            <option
                                value="${assessment.id}"
                                ${selected}>

                                ${escapeHtml(
                                    assessment.title
                                )}

                            </option>

                        `;
                    }
                );


                /* ================= CURRENT STATUS ================= */

                const currentStatus =
                    application.status ||
                    "APPLIED";


                /* ================= APPLICANT CARD ================= */

                item.innerHTML = `

                    <div class="education-item-header">

                        <div>

                            <h3>
                                ${escapeHtml(
                                    application.candidateName
                                )}
                            </h3>

                            <p class="education-institution">

                                ${escapeHtml(
                                    application.candidateEmail
                                )}

                            </p>

                        </div>


                        <span
                            class="application-status status-${currentStatus.toLowerCase()}">

                            ${escapeHtml(
                                currentStatus
                            )}

                        </span>

                    </div>


                    <div class="education-details">

                        <span class="education-detail">

                            Match Score:
                            ${application.matchScore ?? 0}%

                        </span>


                        ${
                            application.assessmentTitle
                                ? `

                                    <span class="education-detail">

                                        Assessment:
                                        ${escapeHtml(
                                            application.assessmentTitle
                                        )}

                                    </span>

                                `
                                : ""
                        }

                    </div>


                    ${
                        application.skillGap
                            ? `

                                <p>

                                    <strong>
                                        Skill Gap:
                                    </strong>

                                    ${escapeHtml(
                                        application.skillGap
                                    )}

                                </p>

                            `
                            : ""
                    }


                    <div class="form-group">

                        <label>
                            Update Status
                        </label>


                        <select
                            id="status-${application.id}"
                            onchange="updateStatus(${application.id})">

                            <option
                                value="APPLIED"
                                ${
                                    currentStatus === "APPLIED"
                                        ? "selected"
                                        : ""
                                }>

                                Applied

                            </option>


                            <option
                                value="UNDER_REVIEW"
                                ${
                                    currentStatus === "UNDER_REVIEW"
                                        ? "selected"
                                        : ""
                                }>

                                Under Review

                            </option>


                            <option
                                value="ASSESSMENT"
                                ${
                                    currentStatus === "ASSESSMENT"
                                        ? "selected"
                                        : ""
                                }>

                                Assessment

                            </option>


                            <option
                                value="SHORTLISTED"
                                ${
                                    currentStatus === "SHORTLISTED"
                                        ? "selected"
                                        : ""
                                }>

                                Shortlisted

                            </option>


                            <option
                                value="INTERVIEW"
                                ${
                                    currentStatus === "INTERVIEW"
                                        ? "selected"
                                        : ""
                                }>

                                Interview

                            </option>


                            <option
                                value="SELECTED"
                                ${
                                    currentStatus === "SELECTED"
                                        ? "selected"
                                        : ""
                                }>

                                Selected

                            </option>


                            <option
                                value="REJECTED"
                                ${
                                    currentStatus === "REJECTED"
                                        ? "selected"
                                        : ""
                                }>

                                Rejected

                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Assign Assessment
                        </label>


                        <select
                            id="assessment-${application.id}">

                            ${assessmentOptions}

                        </select>

                    </div>


                    <button
                        type="button"
                        class="dashboard-btn"
                        onclick="assignAssessment(${application.id})">

                        Assign Assessment

                    </button>

                `;


                applicantList.appendChild(item);

            }
        );

    }


    /* ================= UPDATE STATUS ================= */

    async function updateStatus(applicationId) {

        const select =
            document.getElementById(
                `status-${applicationId}`
            );


        const status =
            select.value;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL_LOCAL}/applications/${applicationId}/status?status=${encodeURIComponent(status)}`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Status update error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    `Could not update status. Server returned ${response.status}.`
                );
            }


            alert(
                "Application status updated successfully!"
            );


            const jobId =
                jobSelect.value;


            await loadApplicants(jobId);


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );


            alert(
                error.message
            );

        }

    }


    /* ================= ASSIGN ASSESSMENT ================= */

    async function assignAssessment(
        applicationId
    ) {

        const select =
            document.getElementById(
                `assessment-${applicationId}`
            );


        const assessmentId =
            select.value;


        if (!assessmentId) {

            alert(
                "Please select an assessment first."
            );


            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL_LOCAL}/applications/${applicationId}/assessment/${assessmentId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${authToken}`
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Assessment assignment error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    `Could not assign assessment. Server returned ${response.status}.`
                );
            }


            alert(
                "Assessment assigned successfully!"
            );


            const jobId =
                jobSelect.value;


            await loadApplicants(jobId);


        } catch (error) {

            console.error(
                "Assessment assignment error:",
                error
            );


            alert(
                error.message
            );

        }

    }


    /* ================= LOGOUT ================= */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


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


    /* ================= HTML ESCAPE ================= */

    function escapeHtml(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value == null
                ? ""
                : String(value);


        return div.innerHTML;

    }


    /* ================= INITIAL LOAD ================= */

    async function initializePage() {

        await loadAssessments();

        await loadJobs();

    }


    initializePage();


    // Make these functions available to inline HTML onclick/onchange
    window.updateStatus =
        updateStatus;

    window.assignAssessment =
        assignAssessment;

})();