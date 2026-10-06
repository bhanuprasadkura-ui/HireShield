(function () {

    const authToken = getToken();

    if (!authToken) {
        window.location.href = "../login.html";
        return;
    }

    const API_BASE_URL = "http://localhost:8080/api";

    // =========================================================
    // HTML ELEMENTS
    // =========================================================

    const jobForm = document.getElementById("jobForm");
    const jobList = document.getElementById("jobList");
    const jobCount = document.getElementById("jobCount");
    const jobMessage = document.getElementById("jobMessage");
    const logoutBtn = document.getElementById("logoutBtn");


    // =========================================================
    // LOAD MY JOBS
    // =========================================================

    async function loadMyJobs() {

        if (!jobList) {
            console.error("jobList element not found.");
            return;
        }

        jobList.innerHTML = `
            <p class="empty-education">
                Loading jobs...
            </p>
        `;

        try {

            const response = await fetch(
                `${API_BASE_URL}/jobs/my-jobs`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            console.log(
                "My Jobs response status:",
                response.status
            );


            // =================================================
            // AUTH ERROR
            // =================================================

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                console.error(
                    "Authentication/authorization failed:",
                    response.status
                );

                jobList.innerHTML = `
                    <p class="empty-education">
                        Your session has expired. Please login again.
                    </p>
                `;

                return;
            }


            // =================================================
            // OTHER SERVER ERROR
            // =================================================

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Failed to load jobs:",
                    response.status,
                    errorText
                );

                jobList.innerHTML = `
                    <p class="empty-education">
                        Failed to load jobs.
                    </p>
                `;

                return;
            }


            // =================================================
            // READ RESPONSE
            // =================================================

            const jobs = await response.json();

            console.log(
                "My jobs received:",
                jobs
            );


            displayJobs(jobs);


        } catch (error) {

            console.error(
                "Error loading jobs:",
                error
            );

            jobList.innerHTML = `
                <p class="empty-education">
                    Unable to connect to the server.
                </p>
            `;
        }
    }


    // =========================================================
    // DISPLAY JOBS
    // =========================================================

    function displayJobs(jobs) {

        if (!Array.isArray(jobs)) {

            console.error(
                "Expected jobs array but received:",
                jobs
            );

            jobList.innerHTML = `
                <p class="empty-education">
                    Invalid job data received from server.
                </p>
            `;

            return;
        }


        // Update job count

        if (jobCount) {

            jobCount.textContent =
                `${jobs.length} Jobs`;
        }


        // No jobs

        if (jobs.length === 0) {

            jobList.innerHTML = `
                <div class="empty-education">

                    <h3>No Jobs Posted Yet</h3>

                    <p>
                        Create your first job using the form above.
                    </p>

                </div>
            `;

            return;
        }


        // Clear loading message

        jobList.innerHTML = "";


        // Display every job

        jobs.forEach(function (job) {

            const jobCard =
                document.createElement("div");

            jobCard.className =
                "education-item";


            jobCard.innerHTML = `

                <div class="education-item-content">

                    <h3>
                        ${escapeHtml(
                            job.title || "Untitled Job"
                        )}
                    </h3>


                    <p>
                        <strong>Company:</strong>
                        ${escapeHtml(
                            job.company || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Location:</strong>
                        ${escapeHtml(
                            job.location || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Employment Type:</strong>
                        ${escapeHtml(
                            job.employmentType || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Required Skills:</strong>
                        ${escapeHtml(
                            job.requiredSkills || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Preferred Skills:</strong>
                        ${escapeHtml(
                            job.preferredSkills || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Eligibility:</strong>
                        ${escapeHtml(
                            job.eligibility || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Minimum Experience:</strong>
                        ${job.minimumExperience ?? 0}
                        years
                    </p>


                    <p>
                        <strong>Salary Range:</strong>
                        ${escapeHtml(
                            job.salaryRange || "Not specified"
                        )}
                    </p>


                    <p>
                        <strong>Description:</strong>
                    </p>

                    <p>
                        ${escapeHtml(
                            job.description ||
                            "No description provided."
                        )}
                    </p>


                    <button
                        type="button"
                        class="auth-btn delete-job-btn"
                        data-id="${job.id}"
                        style="margin-top: 10px;"
                    >
                        Delete Job
                    </button>

                </div>
            `;


            jobList.appendChild(jobCard);
        });


        // =====================================================
        // DELETE BUTTONS
        // =====================================================

        const deleteButtons =
            document.querySelectorAll(
                ".delete-job-btn"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        this.dataset.id;

                    deleteJob(jobId);
                }
            );
        });
    }


    // =========================================================
    // CREATE JOB
    // =========================================================

    if (jobForm) {

        jobForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const title =
                    document
                        .getElementById("title")
                        ?.value
                        .trim() || "";


                const company =
                    document
                        .getElementById("company")
                        ?.value
                        .trim() || "";


                const location =
                    document
                        .getElementById("location")
                        ?.value
                        .trim() || "";


                const employmentType =
                    document
                        .getElementById("employmentType")
                        ?.value || "Full-Time";


                const description =
                    document
                        .getElementById("description")
                        ?.value
                        .trim() || "";


                const requiredSkills =
                    document
                        .getElementById("requiredSkills")
                        ?.value
                        .trim() || "";


                const preferredSkills =
                    document
                        .getElementById("preferredSkills")
                        ?.value
                        .trim() || "";


                const eligibility =
                    document
                        .getElementById("eligibility")
                        ?.value
                        .trim() || "";


                const minimumExperience =
                    document
                        .getElementById("minimumExperience")
                        ?.value || "0";


                const salaryRange =
                    document
                        .getElementById("salaryRange")
                        ?.value
                        .trim() || "";


                // =================================================
                // VALIDATION
                // =================================================

                if (
                    !title ||
                    !company ||
                    !location ||
                    !description ||
                    !requiredSkills
                ) {

                    showMessage(
                        "Please fill all required fields.",
                        true
                    );

                    return;
                }


                const jobData = {

                    title: title,

                    company: company,

                    location: location,

                    employmentType:
                        employmentType,

                    description: description,

                    requiredSkills:
                        requiredSkills,

                    preferredSkills:
                        preferredSkills,

                    eligibility:
                        eligibility,

                    minimumExperience:
                        Number(minimumExperience),

                    salaryRange:
                        salaryRange
                };


                console.log(
                    "Creating job:",
                    jobData
                );


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/jobs`,
                            {
                                method: "POST",

                                headers: {
                                    "Authorization":
                                        `Bearer ${authToken}`,

                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(jobData)
                            }
                        );


                    console.log(
                        "Create job status:",
                        response.status
                    );


                    // =================================================
                    // AUTH ERROR
                    // =================================================

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        showMessage(
                            "Your recruiter session has expired. Please login again.",
                            true
                        );

                        return;
                    }


                    // =================================================
                    // SERVER ERROR
                    // =================================================

                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        console.error(
                            "Create job failed:",
                            response.status,
                            errorText
                        );

                        showMessage(
                            "Failed to create job.",
                            true
                        );

                        return;
                    }


                    // =================================================
                    // SUCCESS
                    // =================================================

                    const createdJob =
                        await response.json();

                    console.log(
                        "Job created successfully:",
                        createdJob
                    );


                    showMessage(
                        "Job created successfully!",
                        false
                    );


                    jobForm.reset();


                    // =================================================
                    // VERY IMPORTANT
                    // Reload jobs after creation
                    // =================================================

                    await loadMyJobs();

                } catch (error) {

                    console.error(
                        "Error creating job:",
                        error
                    );

                    showMessage(
                        "Unable to connect to the server.",
                        true
                    );
                }

            }
        );
    }


    // =========================================================
    // DELETE JOB
    // =========================================================

    async function deleteJob(jobId) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this job?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/jobs/${jobId}`,
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

                alert(
                    "You are not authorized to delete this job."
                );

                return;
            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Delete job failed:",
                    response.status,
                    errorText
                );

                alert(
                    "Failed to delete job."
                );

                return;
            }


            alert(
                "Job deleted successfully."
            );


            await loadMyJobs();

        } catch (error) {

            console.error(
                "Error deleting job:",
                error
            );

            alert(
                "Unable to connect to the server."
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

        if (!jobMessage) {
            alert(message);
            return;
        }


        jobMessage.textContent =
            message;


        jobMessage.style.color =
            isError
                ? "red"
                : "green";
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


    // =========================================================
    // START
    // =========================================================

    loadMyJobs();

})();