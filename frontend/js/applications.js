const applicationList =
    document.getElementById("applicationList");

const applicationCount =
    document.getElementById("applicationCount");

const authToken = getToken();

if (!authToken) {
    window.location.href = "../login.html";
}


// ======================================================
// LOAD MY APPLICATIONS
// ======================================================

async function loadApplications() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/applications/my-applications`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load applications.");
        }

        const applications = await response.json();

        displayApplications(applications);

    } catch (error) {

        applicationList.innerHTML =
            `<p class="empty-education">
                ${error.message}
            </p>`;
    }
}


// ======================================================
// DISPLAY APPLICATIONS
// ======================================================

function displayApplications(applications) {

    applicationList.innerHTML = "";

    applicationCount.textContent =
        `${applications.length} ${
            applications.length === 1
                ? "Application"
                : "Applications"
        }`;


    if (applications.length === 0) {

        applicationList.innerHTML =
            `<p class="empty-education">
                You haven't applied for any jobs yet.
            </p>`;

        return;
    }


    applications.forEach(function (application) {

        const item = document.createElement("div");

        item.className = "education-item";


        const status =
            application.status || "APPLIED";


        // ==================================================
        // ASSESSMENT SECTION
        // ==================================================

        let assessmentSection = "";


        if (application.assessmentId) {

            assessmentSection = `

                <div
                    class="education-details"
                    style="margin-top: 15px;"
                >

                    <span class="education-detail">

                        Assessment:
                        <strong>
                            ${application.assessmentTitle || "Assigned"}
                        </strong>

                    </span>

                </div>


                <div
                    class="education-details"
                    style="margin-top: 10px;"
                >

                    <a
                        href="assessment.html?assessmentId=${application.assessmentId}"
                        class="dashboard-btn"
                    >
                        Take Assessment
                    </a>

                </div>

            `;
        }


        // ==================================================
        // APPLICATION CARD
        // ==================================================

        item.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${application.jobTitle}
                    </h3>

                    <p class="education-institution">
                        ${application.company}
                    </p>

                </div>


                <span
                    class="application-status status-${status.toLowerCase()}"
                >
                    ${status}
                </span>

            </div>


            <div class="education-details">

                <span class="education-detail">

                    Match Score:
                    ${application.matchScore ?? 0}%

                </span>

            </div>


            ${
                application.skillGap
                ? `
                    <p>
                        <strong>Skill Gap:</strong>
                        ${application.skillGap}
                    </p>
                  `
                : ""
            }


            ${assessmentSection}

        `;


        applicationList.appendChild(item);

    });
}


// ======================================================
// LOGOUT
// ======================================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function (event) {

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

    });


// ======================================================
// START
// ======================================================

loadApplications();