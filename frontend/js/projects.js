const projectForm =
    document.getElementById("projectForm");

const projectMessage =
    document.getElementById("projectMessage");

const projectList =
    document.getElementById("projectList");

const projectCount =
    document.getElementById("projectCount");


const authToken = getToken();


/* =========================================
   CHECK LOGIN
========================================= */

if (!authToken) {

    window.location.href =
        "../login.html";

}


/* =========================================
   LOAD PROJECTS
========================================= */

async function loadProjects() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/projects`,
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
                "Could not load projects."
            );

        }


        const projects =
            await response.json();


        displayProjects(projects);

    }

    catch (error) {

        projectList.innerHTML =
            `<p class="empty-education">
                ${error.message}
            </p>`;

    }

}


/* =========================================
   DISPLAY PROJECTS
========================================= */

function displayProjects(projects) {

    projectList.innerHTML = "";


    projectCount.textContent =
        `${projects.length} ${
            projects.length === 1
                ? "Project"
                : "Projects"
        }`;


    if (projects.length === 0) {

        projectList.innerHTML =
            `<p class="empty-education">
                You haven't added any projects yet.
            </p>`;

        return;

    }


    projects.forEach(function (project) {

        const projectItem =
            document.createElement("div");


        projectItem.className =
            "education-item";


        const title =
            project.title || "Project";


        const technologies =
            project.technologies || "";


        const description =
            project.description || "";


        const projectUrl =
            project.projectUrl || "";


        const githubUrl =
            project.githubUrl || "";


        projectItem.innerHTML = `

            <div class="education-item-header">

                <div>

                    <h3>
                        ${title}
                    </h3>

                    ${
                        technologies
                            ? `<p class="education-institution">
                                Technologies: ${technologies}
                               </p>`
                            : ""
                    }

                </div>

                <button
                    type="button"
                    class="job-apply-btn"
                    onclick="deleteProject(${project.id})">
                    Delete
                </button>

            </div>


            ${
                description
                    ? `<p>
                        ${description}
                       </p>`
                    : ""
            }


            <div class="education-details">

                ${
                    projectUrl
                        ? `<a
                            href="${projectUrl}"
                            target="_blank"
                            class="education-detail">
                            Project Link
                           </a>`
                        : ""
                }


                ${
                    githubUrl
                        ? `<a
                            href="${githubUrl}"
                            target="_blank"
                            class="education-detail">
                            GitHub
                           </a>`
                        : ""
                }

            </div>

        `;


        projectList.appendChild(
            projectItem
        );

    });

}


/* =========================================
   ADD PROJECT
========================================= */

projectForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        projectMessage.textContent =
            "Adding project...";


        projectMessage.style.color =
            "";


        const projectData = {

            title:
                document
                    .getElementById("title")
                    .value
                    .trim(),


            technologies:
                document
                    .getElementById("technologies")
                    .value
                    .trim(),


            projectUrl:
                document
                    .getElementById("projectUrl")
                    .value
                    .trim() || null,


            githubUrl:
                document
                    .getElementById("githubUrl")
                    .value
                    .trim() || null,


            description:
                document
                    .getElementById("description")
                    .value
                    .trim()

        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/candidate/projects`,
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
                            projectData
                        )
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not add project."
                );

            }


            projectMessage.textContent =
                "Project added successfully!";


            projectMessage.style.color =
                "#16a34a";


            projectForm.reset();


            await loadProjects();

        }

        catch (error) {

            projectMessage.textContent =
                error.message;


            projectMessage.style.color =
                "#dc2626";

        }

    }
);


/* =========================================
   DELETE PROJECT
========================================= */

async function deleteProject(projectId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this project?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/projects/${projectId}`,
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
                "Could not delete project."
            );

        }


        await loadProjects();

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

loadProjects();