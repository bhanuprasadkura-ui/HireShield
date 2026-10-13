
const skillType = document.getElementById("skillType");
const skillName = document.getElementById("skillName");
const customSkillName = document.getElementById("customSkillName");
const existingSkillGroup = document.getElementById("existingSkillGroup");
const customSkillGroup = document.getElementById("customSkillGroup");
const proficiency = document.getElementById("proficiency");
const skillForm = document.getElementById("skillForm");
const skillsList = document.getElementById("skillsList");
const skillsCount = document.getElementById("skillsCount");
const skillMessage = document.getElementById("skillMessage");

let availableSkills = [];
let candidateSkills = [];

function showMessage(message, isError = false) {
    skillMessage.textContent = message;
    skillMessage.style.color = isError ? "#dc2626" : "#15803d";
}

function updateSkillType() {
    const isCustom = skillType.value === "custom";

    existingSkillGroup.hidden = isCustom;
    customSkillGroup.hidden = !isCustom;

    skillName.required = !isCustom;
    customSkillName.required = isCustom;
}

function renderSkillOptions() {
    skillName.innerHTML = "";

    if (availableSkills.length === 0) {
        skillName.add(new Option("No skills available", ""));
        return;
    }

    skillName.add(new Option("Choose a skill", ""));

    availableSkills.forEach((skill) => {
        skillName.add(
            new Option(skill.name, String(skill.id))
        );
    });
}

function renderCandidateSkills() {
    skillsList.innerHTML = "";
    skillsCount.textContent = `${candidateSkills.length} Skills`;

    if (candidateSkills.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-skills";
        emptyMessage.textContent = "You haven't added any skills yet.";
        skillsList.appendChild(emptyMessage);
        return;
    }

    candidateSkills.forEach((item) => {
        const card = document.createElement("div");
        card.className = "skill-item";

        const name = document.createElement("strong");
        name.textContent =
            item.skillName ||
            item.skill?.name ||
            item.name ||
            "Skill";

        const level = document.createElement("span");
        level.textContent =
            item.proficiency || "Proficiency not specified";

        card.appendChild(name);
        card.appendChild(level);
        skillsList.appendChild(card);
    });
}

async function loadAvailableSkills() {
    skillName.innerHTML = "";
    skillName.add(new Option("Loading skills...", ""));

    try {
        const response = await fetch(`${API_BASE_URL}/skills`);

        if (!response.ok) {
            throw new Error(`Skills request failed (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected skills response from server.");
        }

        availableSkills = data;
        renderSkillOptions();
    } catch (error) {
        console.error("Could not load skill catalog:", error);

        skillName.innerHTML = "";
        skillName.add(new Option("Could not load skills — retry", ""));

        showMessage(
            "Could not load the skill catalog. Please refresh the page.",
            true
        );
    }
}

async function loadCandidateSkills() {
    skillsList.innerHTML =
        '<p class="empty-skills">Loading skills...</p>';

    const authToken = getToken();

    if (!authToken) {
        skillsList.innerHTML =
            '<p class="empty-skills">Please log in again to view your skills.</p>';
        skillsCount.textContent = "0 Skills";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/candidate/skills`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Your skills request failed (${response.status})`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected candidate skills response.");
        }

        candidateSkills = data;
        renderCandidateSkills();
    } catch (error) {
        console.error("Could not load candidate skills:", error);

        skillsList.innerHTML =
            '<p class="empty-skills">Could not load your skills. Please refresh the page.</p>';
    }
}

async function addCustomSkill(skillNameValue, proficiencyValue) {
    const authToken = getToken();

    const response = await fetch(
        `${API_BASE_URL}/candidate/skills/custom?skillName=${encodeURIComponent(skillNameValue)}&proficiency=${encodeURIComponent(proficiencyValue)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Could not add custom skill. It may already exist in your skills."
        );
    }

    return data;
}

async function addExistingSkill(skillId, proficiencyValue) {
    const authToken = getToken();

    const response = await fetch(
        `${API_BASE_URL}/candidate/skills/${encodeURIComponent(skillId)}?proficiency=${encodeURIComponent(proficiencyValue)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || "Could not add the selected skill."
        );
    }

    return data;
}

skillType.addEventListener("change", updateSkillType);

skillForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const authToken = getToken();

    if (!authToken) {
        showMessage("Please log in again before adding a skill.", true);
        return;
    }

    const proficiencyValue = proficiency.value;

    if (!proficiencyValue) {
        showMessage("Please select your proficiency level.", true);
        return;
    }

    const submitButton = skillForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        if (skillType.value === "custom") {
            const name = customSkillName.value.trim();

            if (!name) {
                throw new Error("Please enter a skill name.");
            }

            await addCustomSkill(name, proficiencyValue);
        } else {
            const skillId = skillName.value;

            if (!skillId) {
                throw new Error("Please select a skill.");
            }

            await addExistingSkill(skillId, proficiencyValue);
        }

        showMessage("Skill added successfully!");
        customSkillName.value = "";
        skillName.value = "";

        await loadCandidateSkills();
    } catch (error) {
        console.error("Could not add skill:", error);
        showMessage(error.message || "Could not add skill.", true);
    } finally {
        submitButton.disabled = false;
    }
});

updateSkillType();

async function initializeSkillsPage() {
    await Promise.all([
        loadAvailableSkills(),
        loadCandidateSkills()
    ]);
}

initializeSkillsPage();
