const jobSelect = document.getElementById("jobSelect");
const applicantList = document.getElementById("applicantList");
const applicantCount = document.getElementById("applicantCount");

const authToken = getToken();

let assessments = [];

if (!authToken) {
    window.location.href = "../login.html";
}


/* ================= LOAD MY JOBS ================= */

async function loadJobs() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/jobs/my-jobs`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load jobs.");
        }

        const jobs = await response.json();

        jobSelect.innerHTML =
            `<option value="">Select a job</option>`;

        jobs.forEach(function (job) {

            const option = document.createElement("option");

            option.value = job.id;

            option.textContent =
                `${job.title} - ${job.company}`;

            jobSelect.appendChild(option);

        });

    } catch (error) {

        console.error("Could not load jobs:", error);

        jobSelect.innerHTML =
            `<option value="">Could not load jobs</option>`;

    }
}


/* ================= LOAD MY ASSESSMENTS ================= */

async function loadAssessments() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/assessments/my-assessments`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load assessments.");
        }

        assessments = await response.json();

        console.log("Recruiter assessments:", assessments);

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

        const jobId = jobSelect.value;

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

        const response = await fetch(
            `${API_BASE_URL}/applications/job/${jobId}`,
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
                "Applicants API error:",
                response.status,
                errorText
            );

            throw new Error(
                "Could not load applicants."
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
                ${error.message}
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


    applicants.forEach(function (application) {

        const item =
            document.createElement("div");

        item.className =
            "education-item";


        /* Assessment dropdown */

        let assessmentOptions =
            `<option value="">
                Select an assessment
            </option>`;


        assessments.forEach(function (assessment) {

            const selected =
                application.assessmentId ===
                assessment.id
                    ? "selected"
                    : "";

            assessmentOptions += `
                <option
                    value="${assessment.id}"
                    ${selected}>
                    ${assessment.title}
                </option>
            `;

        });


        const currentStatus =
            application.status || "APPLIED";


        item.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${application.candidateName}
                    </h3>

                    <p class="education-institution">
                        ${application.candidateEmail}
                    </p>

                </div>

                <span
                    class="application-status status-${currentStatus.toLowerCase()}">

                    ${currentStatus}

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
                            ${application.assessmentTitle}

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

                        ${application.skillGap}

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
                        ${currentStatus === "APPLIED" ? "selected" : ""}>
                        Applied
                    </option>

                    <option
                        value="UNDER_REVIEW"
                        ${currentStatus === "UNDER_REVIEW" ? "selected" : ""}>
                        Under Review
                    </option>

                    <option
                        value="ASSESSMENT"
                        ${currentStatus === "ASSESSMENT" ? "selected" : ""}>
                        Assessment
                    </option>

                    <option
                        value="SHORTLISTED"
                        ${currentStatus === "SHORTLISTED" ? "selected" : ""}>
                        Shortlisted
                    </option>

                    <option
                        value="INTERVIEW"
                        ${currentStatus === "INTERVIEW" ? "selected" : ""}>
                        Interview
                    </option>

                    <option
                        value="SELECTED"
                        ${currentStatus === "SELECTED" ? "selected" : ""}>
                        Selected
                    </option>

                    <option
                        value="REJECTED"
                        ${currentStatus === "REJECTED" ? "selected" : ""}>
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

    });
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

        const response = await fetch(
            `${API_BASE_URL}/applications/${applicationId}/status?status=${status}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Status update error:",
                errorText
            );

            throw new Error(
                "Could not update status."
            );
        }

        alert("Application status updated successfully!");

        const jobId =
            jobSelect.value;

        await loadApplicants(jobId);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}


/* ================= ASSIGN ASSESSMENT ================= */

async function assignAssessment(applicationId) {

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

        const response = await fetch(
            `${API_BASE_URL}/applications/${applicationId}/assessment/${assessmentId}`,
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
                "Could not assign assessment."
            );
        }


        alert(
            "Assessment assigned successfully!"
        );


        const jobId =
            jobSelect.value;

        await loadApplicants(jobId);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}


/* ================= LOGOUT ================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
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


/* ================= INITIAL LOAD ================= */

async function initializePage() {

    await loadAssessments();

    await loadJobs();

}

initializePage();