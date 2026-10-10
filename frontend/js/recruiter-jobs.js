
(function () {
    "use strict";

    const API_BASE_URL = "https://hireshield-m5dh.onrender.com/api";

    const token = getToken();

    if (!token) {
        window.location.href = "../login.html";
        return;
    }

    const jobForm = document.getElementById("jobForm");
    const jobList = document.getElementById("jobList");
    const jobCount = document.getElementById("jobCount");
    const jobMessage = document.getElementById("jobMessage");
    const logoutBtn = document.getElementById("logoutBtn");

    function showMessage(message, isError) {
        if (!jobMessage) {
            alert(message);
            return;
        }

        jobMessage.textContent = message;
        jobMessage.style.color = isError ? "#dc2626" : "#16a34a";
    }

    function createTextElement(tag, label, value) {
        const element = document.createElement(tag);

        if (label) {
            const strong = document.createElement("strong");
            strong.textContent = label + " ";
            element.appendChild(strong);
        }

        element.appendChild(
            document.createTextNode(
                value == null || value === "" ? "Not specified" : String(value)
            )
        );

        return element;
    }

    function displayJobs(jobs) {
        if (!Array.isArray(jobs)) {
            console.error("Expected an array of jobs:", jobs);
            jobList.textContent = "Unexpected response from the server.";
            return;
        }

        jobCount.textContent = jobs.length + " Jobs";
        jobList.replaceChildren();

        if (jobs.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-education";
            empty.textContent = "No jobs posted yet. Create your first job above.";
            jobList.appendChild(empty);
            return;
        }

        jobs.forEach(function (job) {
            const card = document.createElement("div");
            card.className = "education-item";

            const content = document.createElement("div");
            content.className = "education-item-content";

            const heading = document.createElement("h3");
            heading.textContent = job.title || "Untitled Job";
            content.appendChild(heading);

            content.appendChild(createTextElement("p", "Company:", job.company));
            content.appendChild(createTextElement("p", "Location:", job.location));
            content.appendChild(
                createTextElement("p", "Employment Type:", job.employmentType)
            );
            content.appendChild(
                createTextElement("p", "Required Skills:", job.requiredSkills)
            );
            content.appendChild(
                createTextElement("p", "Preferred Skills:", job.preferredSkills)
            );
            content.appendChild(
                createTextElement("p", "Eligibility:", job.eligibility)
            );
            content.appendChild(
                createTextElement(
                    "p",
                    "Minimum Experience:",
                    Number(job.minimumExperience || 0) + " years"
                )
            );
            content.appendChild(
                createTextElement("p", "Salary Range:", job.salaryRange)
            );
            content.appendChild(
                createTextElement("p", "Description:", job.description)
            );

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "auth-btn delete-job-btn";
            deleteButton.textContent = "Delete Job";

            deleteButton.addEventListener("click", function () {
                deleteJob(job.id);
            });

            content.appendChild(deleteButton);
            card.appendChild(content);
            jobList.appendChild(card);
        });
    }

    async function loadMyJobs() {
        jobList.textContent = "Loading jobs...";

        try {
            const response = await fetch(
                API_BASE_URL + "/jobs/my-jobs",
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Load jobs failed:", response.status, errorText);

                jobList.textContent =
                    response.status === 401 || response.status === 403
                        ? "Your session is invalid or you are not authorized. Please log in again."
                        : "Could not load jobs. Server returned " + response.status + ".";

                return;
            }

            displayJobs(await response.json());
        } catch (error) {
            console.error("Error loading jobs:", error);
            jobList.textContent = "Unable to connect to the server.";
        }
    }

    if (jobForm) {
        jobForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const jobData = {
                title: document.getElementById("title").value.trim(),
                company: document.getElementById("company").value.trim(),
                location: document.getElementById("location").value.trim(),
                employmentType: document.getElementById("employmentType").value,
                description: document.getElementById("description").value.trim(),
                requiredSkills: document.getElementById("requiredSkills").value.trim(),
                preferredSkills: document.getElementById("preferredSkills").value.trim(),
                eligibility: document.getElementById("eligibility").value.trim(),
                minimumExperience: Number(
                    document.getElementById("minimumExperience").value || 0
                ),
                salaryRange: document.getElementById("salaryRange").value.trim()
            };

            if (
                !jobData.title ||
                !jobData.company ||
                !jobData.location ||
                !jobData.description ||
                !jobData.requiredSkills
            ) {
                showMessage("Please fill in all required fields.", true);
                return;
            }

            const submitButton = jobForm.querySelector(
                'button[type="submit"]'
            );

            submitButton.disabled = true;
            submitButton.textContent = "Creating...";

            try {
                const response = await fetch(API_BASE_URL + "/jobs", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jobData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Create job failed:", response.status, errorText);

                    showMessage(
                        "Failed to create job. Server returned " +
                            response.status + ".",
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
                submitButton.disabled = false;
                submitButton.textContent = "Create Job";
            }
        });
    }

    async function deleteJob(jobId) {
        if (jobId == null) {
            alert("This job has no ID and cannot be deleted.");
            return;
        }

        if (!confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            const response = await fetch(
                API_BASE_URL + "/jobs/" + encodeURIComponent(jobId),
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Delete job failed:", response.status, errorText);
                alert("Failed to delete job. Server returned " + response.status + ".");
                return;
            }

            alert("Job deleted successfully.");
            await loadMyJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Unable to connect to the server.");
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            removeToken();
            localStorage.removeItem("hireshield_role");
            localStorage.removeItem("hireshield_user");
            window.location.href = "../login.html";
        });
    }

    loadMyJobs();
})();
