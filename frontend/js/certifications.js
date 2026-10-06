const certificationForm =
    document.getElementById("certificationForm");

const certificationMessage =
    document.getElementById("certificationMessage");

const certificationList =
    document.getElementById("certificationList");

const certificationCount =
    document.getElementById("certificationCount");


const authToken = getToken();


/* =========================================
   CHECK LOGIN
========================================= */

if (!authToken) {

    window.location.href =
        "../login.html";

}


/* =========================================
   LOAD CERTIFICATIONS
========================================= */

async function loadCertifications() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/certifications`,
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
                "Could not load certifications."
            );

        }


        const certifications =
            await response.json();


        displayCertifications(certifications);

    }

    catch (error) {

        certificationList.innerHTML =
            `<p class="empty-education">
                ${error.message}
            </p>`;

    }

}


/* =========================================
   DISPLAY CERTIFICATIONS
========================================= */

function displayCertifications(certifications) {

    certificationList.innerHTML = "";


    certificationCount.textContent =
        `${certifications.length} ${
            certifications.length === 1
                ? "Certification"
                : "Certifications"
        }`;


    if (certifications.length === 0) {

        certificationList.innerHTML =
            `<p class="empty-education">
                You haven't added any certifications yet.
            </p>`;

        return;

    }


    certifications.forEach(function (certification) {

        const certificationItem =
            document.createElement("div");


        certificationItem.className =
            "education-item";


        const name =
            certification.name ||
            "Certification";


        const organization =
            certification.issuingOrganization ||
            "";


        const issueDate =
            certification.issueDate ||
            "";


        const credentialId =
            certification.credentialId ||
            "";


        const credentialUrl =
            certification.credentialUrl ||
            "";


        certificationItem.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${name}
                    </h3>

                    ${
                        organization
                            ? `<p class="education-institution">
                                ${organization}
                               </p>`
                            : ""
                    }

                </div>


                <button
                    type="button"
                    class="job-apply-btn"
                    onclick="deleteCertification(${certification.id})">
                    Delete
                </button>

            </div>


            <div class="education-details">

                ${
                    issueDate
                        ? `<span class="education-detail">
                            Issue Date: ${issueDate}
                           </span>`
                        : ""
                }


                ${
                    credentialId
                        ? `<span class="education-detail">
                            Credential ID: ${credentialId}
                           </span>`
                        : ""
                }

            </div>


            ${
                credentialUrl
                    ? `<p>
                        <a
                            href="${credentialUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="education-detail">
                            View Credential
                        </a>
                       </p>`
                    : ""
            }

        `;


        certificationList.appendChild(
            certificationItem
        );

    });

}


/* =========================================
   ADD CERTIFICATION
========================================= */

certificationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        certificationMessage.textContent =
            "Adding certification...";


        certificationMessage.style.color =
            "";


        const certificationData = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),


            issuingOrganization:
                document
                    .getElementById("issuingOrganization")
                    .value
                    .trim(),


            issueDate:
                document
                    .getElementById("issueDate")
                    .value || null,


            credentialId:
                document
                    .getElementById("credentialId")
                    .value
                    .trim() || null,


            credentialUrl:
                document
                    .getElementById("credentialUrl")
                    .value
                    .trim() || null

        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/candidate/certifications`,
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
                            certificationData
                        )
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not add certification."
                );

            }


            certificationMessage.textContent =
                "Certification added successfully!";


            certificationMessage.style.color =
                "#16a34a";


            certificationForm.reset();


            await loadCertifications();

        }

        catch (error) {

            certificationMessage.textContent =
                error.message;


            certificationMessage.style.color =
                "#dc2626";

        }

    }
);


/* =========================================
   DELETE CERTIFICATION
========================================= */

async function deleteCertification(
    certificationId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this certification?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/certifications/${certificationId}`,
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
                "Could not delete certification."
            );

        }


        await loadCertifications();

    }

    catch (error) {

        alert(error.message);

    }

}


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

loadCertifications();