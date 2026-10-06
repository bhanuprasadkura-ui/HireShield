const assessmentForm =
    document.getElementById("assessmentForm");

const assessmentMessage =
    document.getElementById("assessmentMessage");

const assessmentList =
    document.getElementById("assessmentList");

const assessmentCount =
    document.getElementById("assessmentCount");


const authToken = getToken();


if (!authToken) {

    window.location.href =
        "../login.html";

}


/* ================= LOAD ASSESSMENTS ================= */

async function loadAssessments() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/assessments/my-assessments`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${authToken}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not load assessments."
            );

        }


        const assessments =
            await response.json();


        displayAssessments(assessments);

    }

    catch (error) {

        assessmentList.innerHTML =
            `<p class="empty-education">
                ${error.message}
            </p>`;

    }

}


/* ================= DISPLAY ================= */

function displayAssessments(assessments) {

    assessmentList.innerHTML = "";


    assessmentCount.textContent =
        `${assessments.length} ${
            assessments.length === 1
                ? "Assessment"
                : "Assessments"
        }`;


    if (assessments.length === 0) {

        assessmentList.innerHTML =
            `<p class="empty-education">
                You haven't created any assessments yet.
            </p>`;

        return;

    }


    assessments.forEach(function (assessment) {

        const item =
            document.createElement("div");


        item.className =
            "education-item";


        item.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${assessment.title}
                    </h3>

                    <p>
                        ${assessment.description || ""}
                    </p>

                </div>


                <button
                    class="delete-assessment-btn"
                    onclick="deleteAssessment(${assessment.id})">
                    Delete
                </button>

            </div>


            <div class="education-details">

                <span class="education-detail">
                    Duration: ${assessment.duration}
                </span>


                <span class="education-detail">
                    Questions: ${assessment.totalQuestions}
                </span>

            </div>


            <div class="education-details">

                <a
                    href="questions.html?assessmentId=${assessment.id}"
                    class="dashboard-btn">
                    Manage Questions
                </a>

            </div>

        `;


        assessmentList.appendChild(item);

    });

}


/* ================= CREATE ================= */

assessmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        assessmentMessage.textContent =
            "Creating assessment...";


        const assessmentData = {

            title:
                document
                    .getElementById("title")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            duration:
                document
                    .getElementById("duration")
                    .value
                    .trim(),

            totalQuestions:
                Number(
                    document
                        .getElementById("totalQuestions")
                        .value
                )

        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/assessments`,
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
                            assessmentData
                        )

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not create assessment."
                );

            }


            assessmentMessage.textContent =
                "Assessment created successfully!";


            assessmentMessage.style.color =
                "#16a34a";


            assessmentForm.reset();


            document
                .getElementById("totalQuestions")
                .value = 5;


            await loadAssessments();

        }

        catch (error) {

            assessmentMessage.textContent =
                error.message;


            assessmentMessage.style.color =
                "#dc2626";

        }

    }
);


/* ================= DELETE ================= */

async function deleteAssessment(
    assessmentId
) {

    if (
        !confirm(
            "Delete this assessment?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/assessments/${assessmentId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${authToken}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not delete assessment."
            );

        }


        await loadAssessments();

    }

    catch (error) {

        assessmentMessage.textContent =
            error.message;


        assessmentMessage.style.color =
            "#dc2626";

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


/* ================= START ================= */

loadAssessments();