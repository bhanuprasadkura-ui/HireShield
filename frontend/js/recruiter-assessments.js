
"use strict";

/* ================= API CONFIGURATION ================= */

const ASSESSMENT_API_URL =
    "https://hireshield-m5dh.onrender.com/api/assessments";

/* ================= DOM ELEMENTS ================= */

const assessmentForm =
    document.getElementById("assessmentForm");

const assessmentMessage =
    document.getElementById("assessmentMessage");

const assessmentList =
    document.getElementById("assessmentList");

const assessmentCount =
    document.getElementById("assessmentCount");

const authToken = getToken();

/* ================= AUTHENTICATION ================= */

if (!authToken) {
    window.location.href = "../login.html";
}

/* ================= MESSAGE HELPER ================= */

function showAssessmentMessage(message, isError) {
    assessmentMessage.textContent = message;
    assessmentMessage.style.color = isError
        ? "#dc2626"
        : "#16a34a";
}

/* ================= LOAD ASSESSMENTS ================= */

async function loadAssessments() {
    assessmentList.textContent = "Loading assessments...";

    try {
        const response = await fetch(
            ASSESSMENT_API_URL + "/my-assessments",
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + authToken
                }
            }
        );

        if (!response.ok) {
            const responseText = await response.text();

            throw new Error(
                responseText ||
                "Could not load assessments. Server returned " +
                response.status + "."
            );
        }

        const assessments = await response.json();

        displayAssessments(assessments);

    } catch (error) {
        console.error("Load assessments error:", error);

        assessmentCount.textContent = "0 Assessments";
        assessmentList.textContent =
            error.message || "Failed to load assessments.";
    }
}

/* ================= DISPLAY ASSESSMENTS ================= */

function displayAssessments(assessments) {
    assessmentList.replaceChildren();

    if (!Array.isArray(assessments)) {
        assessmentCount.textContent = "0 Assessments";
        assessmentList.textContent =
            "Unexpected response from the server.";
        return;
    }

    assessmentCount.textContent =
        assessments.length + (
            assessments.length === 1
                ? " Assessment"
                : " Assessments"
        );

    if (assessments.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-education";
        emptyMessage.textContent =
            "You haven't created any assessments yet.";

        assessmentList.appendChild(emptyMessage);
        return;
    }

    assessments.forEach(function (assessment) {
        const item = document.createElement("div");
        item.className = "education-item";

        const header = document.createElement("div");
        header.className = "education-item-header";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = assessment.title || "Untitled Assessment";

        const description = document.createElement("p");
        description.textContent = assessment.description || "";

        details.appendChild(title);
        details.appendChild(description);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-assessment-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteAssessment(assessment.id);
        });

        header.appendChild(details);
        header.appendChild(deleteButton);

        const educationDetails = document.createElement("div");
        educationDetails.className = "education-details";

        const duration = document.createElement("span");
        duration.className = "education-detail";
        duration.textContent =
            "Duration: " + (assessment.duration || "Not specified");

        const questions = document.createElement("span");
        questions.className = "education-detail";
        questions.textContent =
            "Questions: " + (assessment.totalQuestions ?? 0);

        educationDetails.appendChild(duration);
        educationDetails.appendChild(questions);

        const actions = document.createElement("div");
        actions.className = "education-details";

        const manageLink = document.createElement("a");
        manageLink.href =
            "questions.html?assessmentId=" +
            encodeURIComponent(assessment.id);

        manageLink.className = "dashboard-btn";
        manageLink.textContent = "Manage Questions";

        actions.appendChild(manageLink);

        item.appendChild(header);
        item.appendChild(educationDetails);
        item.appendChild(actions);

        assessmentList.appendChild(item);
    });
}

/* ================= CREATE ASSESSMENT ================= */

assessmentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    showAssessmentMessage("Creating assessment...", false);

    const submitButton = assessmentForm.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
    }

    const assessmentData = {
        title: document.getElementById("title").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        duration:
            document.getElementById("duration").value.trim(),

        totalQuestions: Number(
            document.getElementById("totalQuestions").value
        )
    };

    if (
        !assessmentData.title ||
        !assessmentData.duration ||
        !Number.isInteger(assessmentData.totalQuestions) ||
        assessmentData.totalQuestions < 1
    ) {
        showAssessmentMessage(
            "Please enter a title, duration, and valid question count.",
            true
        );

        if (submitButton) {
            submitButton.disabled = false;
        }

        return;
    }

    try {
        const response = await fetch(ASSESSMENT_API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },

            body: JSON.stringify(assessmentData)
        });

        const responseText = await response.text();

        let data = {};

        if (responseText.trim() !== "") {
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                data = {};
            }
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.error ||
                responseText ||
                "Could not create assessment. Server returned " +
                response.status + "."
            );
        }

        showAssessmentMessage(
            "Assessment created successfully!",
            false
        );

        assessmentForm.reset();

        const questionInput =
            document.getElementById("totalQuestions");

        if (questionInput) {
            questionInput.value = 5;
        }

        await loadAssessments();

    } catch (error) {
        console.error("Create assessment error:", error);

        showAssessmentMessage(
            error.message || "Could not create assessment.",
            true
        );

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
});

/* ================= DELETE ASSESSMENT ================= */

async function deleteAssessment(assessmentId) {
    if (!confirm("Delete this assessment?")) {
        return;
    }

    try {
        const response = await fetch(
            ASSESSMENT_API_URL + "/" +
            encodeURIComponent(assessmentId),
            {
                method: "DELETE",

                headers: {
                    Authorization: "Bearer " + authToken
                }
            }
        );

        if (!response.ok) {
            const responseText = await response.text();

            throw new Error(
                responseText ||
                "Could not delete assessment. Server returned " +
                response.status + "."
            );
        }

        showAssessmentMessage(
            "Assessment deleted successfully.",
            false
        );

        await loadAssessments();

    } catch (error) {
        console.error("Delete assessment error:", error);

        showAssessmentMessage(
            error.message || "Could not delete assessment.",
            true
        );
    }
}

/* ================= LOGOUT ================= */

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        removeToken();

        localStorage.removeItem("hireshield_role");
        localStorage.removeItem("hireshield_user");

        window.location.href = "../login.html";
    });
}

/* ================= START ================= */

if (authToken) {
    loadAssessments();
}
