const jobList = document.getElementById("jobList");
const jobCount = document.getElementById("jobCount");

const authToken = getToken();

if (!authToken) {
    window.location.href = "../login.html";
}

async function loadJobs() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/jobs`,
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

        displayJobs(jobs);

    } catch (error) {

        jobList.innerHTML =
            `<p class="empty-education">${error.message}</p>`;
    }
}


function displayJobs(jobs) {

    jobList.innerHTML = "";

    jobCount.textContent =
        `${jobs.length} ${jobs.length === 1 ? "Job" : "Jobs"}`;

    if (jobs.length === 0) {

        jobList.innerHTML =
            `<p class="empty-education">
                No jobs are currently available.
            </p>`;

        return;
    }

    jobs.forEach(function (job) {

        const jobItem = document.createElement("div");

        jobItem.className = "education-item";

        jobItem.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${job.title}
                    </h3>

                    <p class="education-institution">
                        ${job.company}
                    </p>

                </div>

                <span class="education-detail">
                    ${job.employmentType || "Full-Time"}
                </span>

            </div>


            <p>
                ${job.description || ""}
            </p>


            <div class="education-details">

                ${
                    job.location
                    ? `<span class="education-detail">
                        📍 ${job.location}
                       </span>`
                    : ""
                }

                ${
                    job.salaryRange
                    ? `<span class="education-detail">
                        💰 ${job.salaryRange}
                       </span>`
                    : ""
                }

                ${
                    job.minimumExperience != null
                    ? `<span class="education-detail">
                        Experience: ${job.minimumExperience} years
                       </span>`
                    : ""
                }

            </div>


            <p>
                <strong>Required Skills:</strong>
                ${job.requiredSkills || "Not specified"}
            </p>


            ${
                job.preferredSkills
                ? `<p>
                    <strong>Preferred Skills:</strong>
                    ${job.preferredSkills}
                   </p>`
                : ""
            }


            <div class="education-details">

                <button
                    class="job-match-btn"
                    onclick="checkMatch(${job.id})">
                    Check Match
                </button>

                <button
                    class="job-apply-btn"
                    onclick="applyForJob(${job.id})">
                    Apply
                </button>

            </div>


            <div
                id="match-${job.id}"
                class="job-match-result">
            </div>

        `;

        jobList.appendChild(jobItem);
    });
}


async function checkMatch(jobId) {

    const result =
        document.getElementById(`match-${jobId}`);

    result.textContent = "Calculating match...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/jobs/${jobId}/match`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not calculate match.");
        }

        const data = await response.json();

        result.innerHTML = `

            <strong>
                Job Match Score: ${data.matchScore}%
            </strong>

            <p>
                <strong>Matched Skills:</strong>
                ${
                    data.matchedSkills?.length
                    ? data.matchedSkills.join(", ")
                    : "None"
                }
            </p>

            <p>
                <strong>Missing Skills:</strong>
                ${
                    data.missingSkills?.length
                    ? data.missingSkills.join(", ")
                    : "None"
                }
            </p>

        `;

    } catch (error) {

        result.textContent = error.message;
    }
}


async function applyForJob(jobId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/applications/apply/${jobId}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not apply for this job."
            );
        }

        alert("Application submitted successfully!");

    } catch (error) {

        alert(error.message);
    }
}


document
    .getElementById("logoutBtn")
    .addEventListener("click", function (event) {

        event.preventDefault();

        removeToken();

        localStorage.removeItem("hireshield_role");
        localStorage.removeItem("hireshield_user");

        window.location.href = "../login.html";

    });


loadJobs();