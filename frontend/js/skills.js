
(function () {
    "use strict";

    const skillForm = document.getElementById("skillForm");
    const skillMessage = document.getElementById("skillMessage");
    const skillType = document.getElementById("skillType");
    const skillSelect = document.getElementById("skillName");
    const customSkillInput = document.getElementById("customSkillName");
    const existingSkillGroup = document.getElementById("existingSkillGroup");
    const customSkillGroup = document.getElementById("customSkillGroup");
    const proficiencySelect = document.getElementById("proficiency");
    const skillsList = document.getElementById("skillsList");
    const skillsCount = document.getElementById("skillsCount");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = getToken();

    let skillCatalog = [];

    if (!token) {
        window.location.href = "../login.html";
        return;
    }

    function showMessage(message, success) {
        skillMessage.textContent = message;
        skillMessage.style.color = success ? "#16a34a" : "#dc2626";
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function updateSkillInput() {
        const customMode = skillType.value === "custom";

        existingSkillGroup.hidden = customMode;
        customSkillGroup.hidden = !customMode;

        skillSelect.required = !customMode;
        customSkillInput.required = customMode;

        showMessage("", true);
    }

    skillType.addEventListener("change", updateSkillInput);

    async function loadSkillCatalog() {
        try {
            const response = await fetch(`${API_BASE_URL}/skills`);

            if (!response.ok) {
                throw new Error("Could not load the skill catalog.");
            }

            skillCatalog = await response.json();

            skillSelect.innerHTML =
                '<option value="">Select a skill</option>';

            skillCatalog.forEach(function (skill) {
                const option = document.createElement("option");
                option.value = skill.id;
                option.textContent = skill.name;
                skillSelect.appendChild(option);
            });

            if (skillCatalog.length === 0) {
                skillSelect.innerHTML =
                    '<option value="">No catalog skills available</option>';
            }
        } catch (error) {
            skillSelect.innerHTML =
                '<option value="">Could not load skills</option>';

            showMessage(error.message, false);
        }
    }

    async function loadMySkills() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/candidate/skills`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Could not load your skills.");
            }

            const skills = await response.json();
            displaySkills(skills);
        } catch (error) {
            skillsList.textContent = "";
            const message = document.createElement("p");
            message.className = "empty-skills";
            message.textContent = error.message;
            skillsList.appendChild(message);
        }
    }

    function displaySkills(skills) {
        skillsList.innerHTML = "";

        skillsCount.textContent =
            `${skills.length} Skill${skills.length === 1 ? "" : "s"}`;

        if (skills.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-skills";
            emptyMessage.textContent = "You haven't added any skills yet.";
            skillsList.appendChild(emptyMessage);
            return;
        }

        skills.forEach(function (skill) {
            const item = document.createElement("div");
            item.className = "skill-item";

            const info = document.createElement("div");
            info.className = "skill-item-info";

            const name = document.createElement("h3");
            name.textContent = skill.skillName || skill.name || "Unnamed skill";

            const description = document.createElement("p");
            description.textContent = "Technical Skill";

            const proficiency = document.createElement("span");
            proficiency.className = "skill-proficiency";
            proficiency.textContent = skill.proficiency || "Not specified";

            info.appendChild(name);
            info.appendChild(description);
            item.appendChild(info);
            item.appendChild(proficiency);
            skillsList.appendChild(item);
        });
    }

    async function addExistingSkill(skillId, proficiency) {
        const response = await fetch(
            `${API_BASE_URL}/candidate/skills/${encodeURIComponent(skillId)}?proficiency=${encodeURIComponent(proficiency)}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || "Could not add skill.");
        }
    }

    async function addCustomSkill(skillName, proficiency) {
        /*
         * IMPORTANT:
         * The existing backend code provided so far only confirms
         * the catalog-ID endpoint:
         * POST /api/candidate/skills/{skillId}?proficiency=...
         *
         * A custom skill needs a backend endpoint that creates or
         * resolves the skill and associates it with the candidate.
         * Do not pretend the skill was saved if that endpoint is absent.
         */
        const matchingSkill = skillCatalog.find(function (skill) {
            return String(skill.name).trim().toLowerCase() ===
                skillName.trim().toLowerCase();
        });

        if (matchingSkill) {
            await addExistingSkill(matchingSkill.id, proficiency);
            return;
        }

        throw new Error(
            "The custom-skill backend endpoint is not implemented yet. " +
            "Your skill has not been saved. The backend must support " +
            "creating a custom skill before this feature can work."
        );
    }

    skillForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const proficiency = proficiencySelect.value;

        if (!proficiency) {
            showMessage("Please select a proficiency level.", false);
            return;
        }

        const customMode = skillType.value === "custom";
        const skillId = skillSelect.value;
        const customSkillName = customSkillInput.value.trim();

        if (customMode && !customSkillName) {
            showMessage("Please enter a skill name.", false);
            customSkillInput.focus();
            return;
        }

        if (!customMode && !skillId) {
            showMessage("Please select a skill.", false);
            skillSelect.focus();
            return;
        }

        const submitButton = skillForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        showMessage("Adding skill...", true);

        try {
            if (customMode) {
                await addCustomSkill(customSkillName, proficiency);
            } else {
                await addExistingSkill(skillId, proficiency);
            }

            showMessage("Skill added successfully!", true);
            skillForm.reset();
            proficiencySelect.value = "Intermediate";
            skillType.value = "existing";
            updateSkillInput();

            await loadMySkills();
        } catch (error) {
            showMessage(error.message, false);
        } finally {
            submitButton.disabled = false;
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            removeToken();
            localStorage.removeItem("hireshield_role");
            localStorage.removeItem("hireshield_user");

            window.location.href = "../login.html";
        });
    }

    updateSkillInput();
    loadSkillCatalog();
    loadMySkills();
})();
