
async function addCustomSkill(skillName, proficiency) {
    const response = await fetch(
        `${API_BASE_URL}/candidate/skills/custom?skillName=${encodeURIComponent(skillName)}&proficiency=${encodeURIComponent(proficiency)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || "Could not add custom skill. It may already exist in your skills."
        );
    }

    return data;
}
