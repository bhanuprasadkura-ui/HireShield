
(function () {
    "use strict";

    // API CONFIGURATION
    const API_BASE_URL_LOCAL =
        "https://hireshield-m5dh.onrender.com/api";

    // HTML ELEMENTS
    const jobSelect = document.getElementById("jobSelect");
    const applicantList = document.getElementById("applicantList");
    const applicantCount = document.getElementById("applicantCount");
    const logoutBtn = document.getElementById("logoutBtn");

    const authToken = getToken();
    let assessments = [];

    // AUTHENTICATION
    if (!authToken) {
        window.location.href = "../login.html";
        return;
    }

    // LOAD RECRUITER JOBS
    async function loadJobs() {
        try {
            const response = await fetch(
                `${API_BASE_URL_LOCAL}/jobs/my-jobs`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Jobs API error:", response.status, errorText);
                throw new Error(
                    `Could not load jobs. Server returned ${response.status}.`
                );
            }

            const jobs = await response.json();

            jobSelect.replaceChildren();

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a job";
            jobSelect.appendChild(defaultOption);

            jobs.forEach(function (job) {
                const option = document.createElement("option");
                option.value = job.id;
                option.textContent = `${job.title} - ${job.company}`;
                jobSelect.appendChild(option);
            });

            if (jobs.length === 0) {
                applicantList.textContent = "No jobs posted yet.";
                applicantCount.textContent = "0 Applicants";
            }
        } catch (error) {
            console.error("Could not load jobs:", error);

            jobSelect.replaceChildren();

            const option = document.createElement("option");
            option.value = "";
            option.textContent = error.message || "Could not load jobs";
            jobSelect.appendChild(option);
        }
    }

    // LOAD RECRUITER ASSESSMENTS
    async function loadAssessments() {
        try {
            const response = await fetch(
                `${API_BASE_URL_LOCAL}/assessments/my-assessments`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Assessments API error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not load assessments. Server returned ${response.status}.`
                );
            }

            assessments = await response.json();

            if (!Array.isArray(assessments)) {
                assessments = [];
            }

            console.log("Recruiter assessments:", assessments);
        } catch (error) {
            console.error("Could not load assessments:", error);
            assessments = [];
        }
    }

    // JOB SELECTION
    jobSelect.addEventListener("change", async function () {
        const jobId = jobSelect.value;

        if (!jobId) {
            applicantList.textContent =
                "Select a job to view applicants.";

            applicantCount.textContent = "0 Applicants";
            return;
        }

        await loadApplicants(jobId);
    });

    // LOAD APPLICANTS FOR A JOB
    async function loadApplicants(jobId) {
        applicantList.textContent = "Loading applicants...";

        try {
            const response = await fetch(
                `${API_BASE_URL_LOCAL}/applications/job/${encodeURIComponent(jobId)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Applicants API error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not load applicants. Server returned ${response.status}.`
                );
            }

            const applicants = await response.json();
            displayApplicants(applicants);
        } catch (error) {
            console.error("Could not load applicants:", error);
            applicantList.textContent =
                error.message || "Could not load applicants.";
        }
    }

    // DISPLAY APPLICANTS
    function displayApplicants(applicants) {
        applicantList.replaceChildren();

        if (!Array.isArray(applicants)) {
            applicantCount.textContent = "0 Applicants";
            applicantList.textContent = "Invalid applicant data received.";
            return;
        }

        applicantCount.textContent =
            `${applicants.length} ${
                applicants.length === 1 ? "Applicant" : "Applicants"
            }`;

        if (applicants.length === 0) {
            applicantList.textContent = "No applicants for this job yet.";
            return;
        }

        applicants.forEach(function (application) {
            const item = document.createElement("div");
            item.className = "education-item";

            const header = document.createElement("div");
            header.className = "education-item-header";

            const details = document.createElement("div");

            const name = document.createElement("h3");
            name.textContent = application.candidateName || "Candidate";

            const email = document.createElement("p");
            email.className = "education-institution";
            email.textContent = application.candidateEmail || "";

            details.appendChild(name);
            details.appendChild(email);

            const currentStatus = application.status || "APPLIED";

            const statusBadge = document.createElement("span");
            statusBadge.className =
                `application-status status-${currentStatus.toLowerCase()}`;
            statusBadge.textContent = currentStatus;

            header.appendChild(details);
            header.appendChild(statusBadge);
            item.appendChild(header);

            const educationDetails = document.createElement("div");
            educationDetails.className = "education-details";

            const matchScore = document.createElement("span");
            matchScore.className = "education-detail";
            matchScore.textContent =
                `Match Score: ${application.matchScore ?? 0}%`;

            educationDetails.appendChild(matchScore);

            if (application.assessmentTitle) {
                const assessmentTitle = document.createElement("span");
                assessmentTitle.className = "education-detail";
                assessmentTitle.textContent =
                    `Assessment: ${application.assessmentTitle}`;

                educationDetails.appendChild(assessmentTitle);
            }

            item.appendChild(educationDetails);

            if (application.skillGap) {
                const skillGap = document.createElement("p");
                const label = document.createElement("strong");

                label.textContent = "Skill Gap: ";
                skillGap.appendChild(label);
                skillGap.appendChild(
                    document.createTextNode(application.skillGap)
                );

                item.appendChild(skillGap);
            }

            // UPDATE APPLICATION STATUS
            const statusGroup = document.createElement("div");
            statusGroup.className = "form-group";

            const statusLabel = document.createElement("label");
            statusLabel.textContent = "Update Status";

            const statusSelect = document.createElement("select");
            statusSelect.id = `status-${application.id}`;

            const statuses = [
                ["APPLIED", "Applied"],
                ["UNDER_REVIEW", "Under Review"],
                ["ASSESSMENT", "Assessment"],
                ["SHORTLISTED", "Shortlisted"],
                ["INTERVIEW", "Interview"],
                ["SELECTED", "Selected"],
                ["REJECTED", "Rejected"]
            ];

            statuses.forEach(function ([value, labelText]) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = labelText;
                option.selected = currentStatus === value;
                statusSelect.appendChild(option);
            });

            statusSelect.addEventListener("change", function () {
                updateStatus(application.id);
            });

            statusGroup.appendChild(statusLabel);
            statusGroup.appendChild(statusSelect);
            item.appendChild(statusGroup);

            // ASSIGN ASSESSMENT
            const assessmentGroup = document.createElement("div");
            assessmentGroup.className = "form-group";

            const assessmentLabel = document.createElement("label");
            assessmentLabel.textContent = "Assign Assessment";

            const assessmentSelect = document.createElement("select");
            assessmentSelect.id = `assessment-${application.id}`;

            const defaultAssessment = document.createElement("option");
            defaultAssessment.value = "";
            defaultAssessment.textContent = "Select an assessment";
            assessmentSelect.appendChild(defaultAssessment);

            assessments.forEach(function (assessment) {
                const option = document.createElement("option");
                option.value = assessment.id;
                option.textContent = assessment.title || "Assessment";
                option.selected =
                    String(application.assessmentId) ===
                    String(assessment.id);

                assessmentSelect.appendChild(option);
            });

            assessmentGroup.appendChild(assessmentLabel);
            assessmentGroup.appendChild(assessmentSelect);
            item.appendChild(assessmentGroup);

            const assignButton = document.createElement("button");
            assignButton.type = "button";
            assignButton.className = "dashboard-btn";
            assignButton.textContent = "Assign Assessment";

            assignButton.addEventListener("click", function () {
                assignAssessment(application.id);
            });

            item.appendChild(assignButton);
            applicantList.appendChild(item);
        });
    }

    // UPDATE APPLICATION STATUS
    async function updateStatus(applicationId) {
        const select = document.getElementById(
            `status-${applicationId}`
        );

        if (!select) {
            return;
        }

        const status = select.value;

        try {
            const response = await fetch(
                `${API_BASE_URL_LOCAL}/applications/${encodeURIComponent(applicationId)}/status?status=${encodeURIComponent(status)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Status update error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not update status. Server returned ${response.status}.`
                );
            }

            alert("Application status updated successfully!");

            if (jobSelect.value) {
                await loadApplicants(jobSelect.value);
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert(error.message || "Could not update application status.");
        }
    }

    // ASSIGN ASSESSMENT
    async function assignAssessment(applicationId) {
        const select = document.getElementById(
            `assessment-${applicationId}`
        );

        if (!select || !select.value) {
            alert("Please select an assessment first.");
            return;
        }

        const assessmentId = select.value;

        try {
            const response = await fetch(
                `${API_BASE_URL_LOCAL}/applications/${encodeURIComponent(applicationId)}/assessment/${encodeURIComponent(assessmentId)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Assessment assignment error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Could not assign assessment. Server returned ${response.status}.`
                );
            }

            alert("Assessment assigned successfully!");

            if (jobSelect.value) {
                await loadApplicants(jobSelect.value);
            }
        } catch (error) {
            console.error("Assessment assignment error:", error);
            alert(error.message || "Could not assign assessment.");
        }
    }

    // LOGOUT
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            removeToken();

            localStorage.removeItem("hireshield_role");
            localStorage.removeItem("hireshield_user");

            window.location.href = "../login.html";
        });
    }

    // INITIALIZE PAGE
    async function initializePage() {
        await loadAssessments();
        await loadJobs();
    }

    initializePage();

    // Keep these functions available if other page code uses them.
    window.updateStatus = updateStatus;
    window.assignAssessment = assignAssessment;
})();
