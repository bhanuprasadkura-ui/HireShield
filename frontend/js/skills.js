(function () {

    const skillForm =
        document.getElementById("skillForm");

    const skillMessage =
        document.getElementById("skillMessage");

    const skillSelect =
        document.getElementById("skillName");

    const skillsList =
        document.getElementById("skillsList");

    const skillsCount =
        document.getElementById("skillsCount");


    const token = getToken();


    /* =========================================
       CHECK LOGIN
    ========================================= */

    if (!token) {

        window.location.href =
            "../login.html";

        return;
    }


    /* =========================================
       LOAD SKILL CATALOG
    ========================================= */

    async function loadSkillCatalog() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/skills`,
                {
                    method: "GET"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Could not load skills."
                );

            }


            const skills =
                await response.json();


            skillSelect.innerHTML =
                `<option value="">
                    Select a skill
                </option>`;


            skills.forEach(function (skill) {

                const option =
                    document.createElement("option");


                option.value =
                    skill.id;


                option.textContent =
                    skill.name;


                skillSelect.appendChild(option);

            });

        }

        catch (error) {

            skillMessage.textContent =
                error.message;

        }

    }


    /* =========================================
       LOAD CANDIDATE SKILLS
    ========================================= */

    async function loadMySkills() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/candidate/skills`,
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
                    "Could not load your skills."
                );

            }


            const skills =
                await response.json();


            displaySkills(skills);

        }

        catch (error) {

            skillsList.innerHTML =
                `<p class="empty-skills">
                    ${error.message}
                </p>`;

        }

    }


    /* =========================================
       DISPLAY SKILLS
    ========================================= */

    function displaySkills(skills) {

        skillsList.innerHTML = "";


        skillsCount.textContent =
            `${skills.length} Skill${skills.length === 1 ? "" : "s"}`;


        if (skills.length === 0) {

            skillsList.innerHTML =
                `<p class="empty-skills">
                    You haven't added any skills yet.
                </p>`;

            return;

        }


        skills.forEach(function (skill) {

            const skillItem =
                document.createElement("div");


            skillItem.className =
                "skill-item";


            skillItem.innerHTML = `

                <div class="skill-item-info">

                    <h3>
                        ${skill.skillName}
                    </h3>

                    <p>
                        Technical Skill
                    </p>

                </div>

                <span class="skill-proficiency">
                    ${skill.proficiency}
                </span>

            `;


            skillsList.appendChild(skillItem);

        });

    }


    /* =========================================
       ADD SKILL
    ========================================= */

    skillForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const skillId =
                skillSelect.value;


            const proficiency =
                document.getElementById(
                    "proficiency"
                ).value;


            if (!skillId || !proficiency) {

                skillMessage.textContent =
                    "Please select a skill and proficiency.";

                return;

            }


            skillMessage.textContent =
                "Adding skill...";


            try {

                const response = await fetch(

                    `${API_BASE_URL}/candidate/skills/${skillId}?proficiency=${encodeURIComponent(proficiency)}`,

                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }

                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not add skill."
                    );

                }


                skillMessage.textContent =
                    "Skill added successfully!";

                skillMessage.style.color =
                    "#16a34a";


                skillForm.reset();


                await loadMySkills();

            }

            catch (error) {

                skillMessage.textContent =
                    error.message;

                skillMessage.style.color =
                    "#dc2626";

            }

        }
    );


    /* =========================================
       LOGOUT
    ========================================= */

    const logoutBtn =
        document.getElementById("logoutBtn");


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


    /* =========================================
       START
    ========================================= */

    loadSkillCatalog();

    loadMySkills();

})();