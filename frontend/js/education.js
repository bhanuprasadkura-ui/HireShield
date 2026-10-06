const educationForm =
    document.getElementById("educationForm");

const educationMessage =
    document.getElementById("educationMessage");

const educationList =
    document.getElementById("educationList");

const educationCount =
    document.getElementById("educationCount");


const token = getToken();


/* =========================================
   CHECK LOGIN
========================================= */

if (!token) {

    window.location.href =
        "../login.html";

}


/* =========================================
   LOAD EDUCATION
========================================= */

async function loadEducation() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/education`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not load education."
            );

        }


        const education =
            await response.json();


        displayEducation(education);

    }

    catch (error) {

        educationList.innerHTML =
            `<p class="empty-education">
                ${error.message}
            </p>`;

    }

}


/* =========================================
   DISPLAY EDUCATION
========================================= */

function displayEducation(education) {

    educationList.innerHTML = "";


    educationCount.textContent =
        `${education.length} ${
            education.length === 1
                ? "Entry"
                : "Entries"
        }`;


    if (education.length === 0) {

        educationList.innerHTML =
            `<p class="empty-education">
                You haven't added any education yet.
            </p>`;

        return;

    }


    education.forEach(function (item) {

        const educationItem =
            document.createElement("div");


        educationItem.className =
            "education-item";


        const degree =
            item.degree || "Degree";


        const institution =
            item.institution || "Institution";


        const field =
            item.fieldOfStudy || "";


        const percentage =
            item.percentage != null
                ? `Percentage: ${item.percentage}%`
                : "";


        const cgpa =
            item.cgpa != null
                ? `CGPA: ${item.cgpa}`
                : "";


        const startDate =
            item.startDate || "";


        const endDate =
            item.endDate || "Present";


        educationItem.innerHTML = `

            <div class="education-item-header">

                <h3>
                    ${degree}
                </h3>

            </div>

            <p class="education-institution">
                ${institution}
            </p>

            ${
                field
                    ? `<p>${field}</p>`
                    : ""
            }

            <div class="education-details">

                ${
                    percentage
                        ? `<span class="education-detail">
                            ${percentage}
                           </span>`
                        : ""
                }

                ${
                    cgpa
                        ? `<span class="education-detail">
                            ${cgpa}
                           </span>`
                        : ""
                }

                ${
                    startDate
                        ? `<span class="education-detail">
                            ${startDate} - ${endDate}
                           </span>`
                        : ""
                }

            </div>

        `;


        educationList.appendChild(
            educationItem
        );

    });

}


/* =========================================
   ADD EDUCATION
========================================= */

educationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        educationMessage.textContent =
            "Adding education...";


        const educationData = {

            degree:
                document
                    .getElementById("degree")
                    .value
                    .trim(),

            institution:
                document
                    .getElementById("institution")
                    .value
                    .trim(),

            fieldOfStudy:
                document
                    .getElementById("fieldOfStudy")
                    .value
                    .trim(),

            percentage:
                document
                    .getElementById("percentage")
                    .value
                    ? Number(
                        document
                            .getElementById("percentage")
                            .value
                    )
                    : null,

            cgpa:
                document
                    .getElementById("cgpa")
                    .value
                    ? Number(
                        document
                            .getElementById("cgpa")
                            .value
                    )
                    : null,

            startDate:
                document
                    .getElementById("startDate")
                    .value || null,

            endDate:
                document
                    .getElementById("endDate")
                    .value || null

        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/candidate/education`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            educationData
                        )
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not add education."
                );

            }


            educationMessage.textContent =
                "Education added successfully!";

            educationMessage.style.color =
                "#16a34a";


            educationForm.reset();


            await loadEducation();

        }

        catch (error) {

            educationMessage.textContent =
                error.message;

            educationMessage.style.color =
                "#dc2626";

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

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


/* =========================================
   START
========================================= */

loadEducation();