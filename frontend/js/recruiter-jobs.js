```javascript
(function () {
    const authToken = getToken();

    if (!authToken) {
        window.location.href = "../login.html";
        return;
    }

    // Deployed HireShield backend on Render
    const API_BASE_URL = "https://hireshield-m5dh.onrender.com/api";

    // HTML elements
    const jobForm = document.getElementById("jobForm");
    const jobList = document.getElementById("jobList");
    const jobCount = document.getElementById("jobCount");
    const jobMessage = document.getElementById("jobMessage");
    const logoutBtn = document.getElementById("logoutBtn");

    // Load jobs belonging to the logged-in recruiter
    async function loadMyJobs() {
        if (!jobList) {
            console.error("jobList element not found.");
            return;
        }

        jobList.innerHTML = `
            <p class="empty-education">Loading jobs...</p>
        `;

        try {
            const response = await fetch(
                `${API_BASE_URL}/jobs/my-jobs`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                jobList.innerHTML = `
                    <p class="empty-education">
                        Your session has expired or you are not authorized.
                        Please log in again.
                    </p>
                `;
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    "Failed to load jobs:",
                    response.status,
                    errorText
                );

                jobList.innerHTML = `
                    <p class="empty-education">
                        Failed to load jobs. Server returned
                        ${response.status}.
                    </p>
                `;
                return;
            }

            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error("Error loading jobs:", error);

            jobList.innerHTML = `
                <p class="empty-education">
                    Unable to connect to the server.
                    Please try again.
                </p>
            `;
        }
    }

    // Display the recruiter's jobs
    function displayJobs(jobs) {
        if (!Array.isArray(jobs)) {
            console.error("Expected jobs array but received:", jobs);

            jobList.innerHTML = `
                <p class="empty-education">
                    Invalid job data received from server.
                </p>
            `;
            return;
        }

        if (jobCount) {
            jobCount.textContent = `${jobs.length} Jobs`;
        }

        if (jobs.length === 0) {
            jobList.innerHTML = `
                <div class="empty-education">
                    <h3>No Jobs Posted Yet</h3>
                    <p>Create your first job using the form above.</p>
                </div>
            `;
            return;
        }

        jobList.innerHTML = "";

        jobs.forEach(function (job) {
            const jobCard = document.createElement("div");
            jobCard.className = "education-item";

            jobCard.innerHTML = `
                <div class="education-item-content">
                    <h3>${escapeHtml(job.title || "Untitled Job")}</h3>

                    <p>
                        <strong>Company:</strong>
                        ${escapeHtml(job.company || "Not specified")}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHtml(job.location || "Not specified")}
                    </p>

                    <p>
                        <strong>Employment Type:</strong>
                        ${escapeHtml(job.employmentType || "Not specified")}
                    </p>

                    <p>
                        <strong>Required Skills:</strong>
                        ${escapeHtml(job.requiredSkills || "Not specified")}
                    </p>

                    <p>
                        <strong>Preferred Skills:</strong>
                        ${escapeHtml(job.preferredSkills || "Not specified")}
                    </p>

                    <p>
                        <strong>Eligibility:</strong>
                        ${escapeHtml(job.eligibility || "Not specified")}
                    </p>

                    <p>
                        <strong>Minimum Experience:</strong>
                        ${Number(job.minimumExperience ?? 0)} years
                    </p>

                    <p>
                        <strong>Salary Range:</strong>
                        ${escapeHtml(job.salaryRange || "Not specified")}
                    </p>

                    <p><strong>Description:</strong></p>
                    <p>
                        ${escapeHtml(
                            job.description || "No description provided."
                        )}
                    </p>

                    <button
                        type="button"
                        class="auth-btn delete-job-btn"
                        data-id="${escapeHtml(job.id)}"
                        style="margin-top: 10px;"
                    >
                        Delete Job
                    </button>
                </div>
            `;

            jobList.appendChild(jobCard);
        });

        document.querySelectorAll(".delete-job-btn").forEach(
            function (button) {
                button.addEventListener("click", function () {
                    deleteJob(this.dataset.id);
                });
            }
        );
    }

    // Create a new job
    if (jobForm) {
        jobForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const company = document.getElementById("company").value.trim();
            const location = document.getElementById("location").value.trim();
            const employmentType =
                document.getElementById("employmentType").value;
            const description =
                document.getElementById("description").value.trim();
            const requiredSkills =
                document.getElementById("requiredSkills").value.trim();
            const preferredSkills =
                document.getElementById("preferredSkills").value.trim();
            const eligibility =
                document.getElementById("eligibility").value.trim();
            const minimumExperience =
                document.getElementById("minimumExperience").value || "0";
            const salaryRange =
                document.getElementById("salaryRange").value.trim();

            if (
                !title ||
                !company ||
                !location ||
                !description ||
                !requiredSkills
            ) {
                showMessage("Please fill all required fields.", true);
                return;
            }

            const jobData = {
                title,
                company,
                location,
                employmentType,
                description,
                requiredSkills,
                preferredSkills,
                eligibility,
                minimumExperience: Number(minimumExperience),
                salaryRange
            };

            const submitButton = jobForm.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Creating...";
            }

            try {
                const response = await fetch(`${API_BASE_URL}/jobs`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jobData)
                });

                if (response.status === 401 || response.status === 403) {
                    showMessage(
                        "Your session has expired or you are not authorized. Please log in again.",
                        true
                    );
                    return;
                }

                if (!response.ok) {
                    const errorText = await response.text();

                    console.error(
                        "Create job failed:",
                        response.status,
                        errorText
                    );

                    showMessage(
                        `Failed to create job. Server returned ${response.status}.`,
                        true
                    );
                    return;
                }

                showMessage("Job created successfully!", false);
                jobForm.reset();

                await loadMyJobs();
            } catch (error) {
                console.error("Error creating job:", error);
                showMessage("Unable to connect to the server.", true);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Create Job";
                }
            }
        });
    }

    // Delete a job
    async function deleteJob(jobId) {
        if (!confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/jobs/${encodeURIComponent(jobId)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                alert("You are not authorized to delete this job.");
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Delete job failed:",
                    response.status,
                    errorText
                );

                alert(`Failed to delete job. Server returned ${response.status}.`);
                return;
            }

            alert("Job deleted successfully.");
            await loadMyJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Unable to connect to the server.");
        }
    }

    // Show success or error messages
    function showMessage(message, isError) {
        if (!jobMessage) {
            alert(message);
            return;
        }

        jobMessage.textContent = message;
        jobMessage.style.color = isError ? "red" : "green";
    }

    // Escape HTML to avoid inserting untrusted text as markup
    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value == null ? "" : String(value);
        return div.innerHTML;
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            removeToken();
            localStorage.removeItem("hireshield_role");
            localStorage.removeItem("hireshield_user");

            window.location.href = "../login.html";
        });
    }

    // Initial load
    loadMyJobs();
})();
```