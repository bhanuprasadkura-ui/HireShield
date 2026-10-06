(function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const profileForm =
        document.getElementById("profileForm");

    const profileMessage =
        document.getElementById("profileMessage");

    const profileStatus =
        document.getElementById("profileStatus");


    // ==========================================
    // AUTH TOKEN
    // ==========================================

    const authToken = getToken();

    if (!authToken) {

        window.location.href = "../login.html";

        return;
    }


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    async function loadProfile() {

        try {

            profileStatus.textContent =
                "Loading...";

            const response = await fetch(
                `${API_BASE_URL}/candidate/profile`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${authToken}`
                    }
                }
            );


            // ==================================
            // PROFILE DOES NOT EXIST YET
            // ==================================

            if (response.status === 404) {

                profileStatus.textContent =
                    "Create your profile";

                profileMessage.textContent = "";

                return;
            }


            // ==================================
            // OTHER SERVER ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    `Server error: ${response.status}`
                );
            }


            // ==================================
            // PROFILE EXISTS
            // ==================================

            const profile =
                await response.json();


            fillProfileForm(profile);

            profileStatus.textContent =
                "Profile loaded";


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            profileStatus.textContent =
                "Unable to load profile";

            profileMessage.textContent =
                "Unable to connect to the server.";

            profileMessage.style.color =
                "#dc2626";
        }
    }


    // ==========================================
    // FILL PROFILE FORM
    // ==========================================

    function fillProfileForm(profile) {

        const phone =
            document.getElementById("phone");

        const location =
            document.getElementById("location");

        const githubUrl =
            document.getElementById("githubUrl");

        const linkedinUrl =
            document.getElementById("linkedinUrl");

        const resumeUrl =
            document.getElementById("resumeUrl");

        const bio =
            document.getElementById("bio");


        if (phone) {

            phone.value =
                profile.phone || "";
        }


        if (location) {

            location.value =
                profile.location || "";
        }


        if (githubUrl) {

            githubUrl.value =
                profile.githubUrl || "";
        }


        if (linkedinUrl) {

            linkedinUrl.value =
                profile.linkedinUrl || "";
        }


        if (resumeUrl) {

            resumeUrl.value =
                profile.resumeUrl || "";
        }


        if (bio) {

            bio.value =
                profile.bio || "";
        }


        profileStatus.textContent =
            "Profile loaded";
    }


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            profileMessage.textContent =
                "Saving profile...";

            profileMessage.style.color =
                "";


            // ==================================
            // GET FORM DATA
            // ==================================

            const profileData = {

                phone:
                    document
                        .getElementById("phone")
                        .value
                        .trim(),

                location:
                    document
                        .getElementById("location")
                        .value
                        .trim(),

                githubUrl:
                    document
                        .getElementById("githubUrl")
                        .value
                        .trim() || null,

                linkedinUrl:
                    document
                        .getElementById("linkedinUrl")
                        .value
                        .trim() || null,

                resumeUrl:
                    document
                        .getElementById("resumeUrl")
                        .value
                        .trim() || null,

                bio:
                    document
                        .getElementById("bio")
                        .value
                        .trim()
            };


            try {

                // ==================================
                // CREATE PROFILE
                // ==================================

                const response = await fetch(
                    `${API_BASE_URL}/candidate/profile`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${authToken}`
                        },

                        body:
                            JSON.stringify(profileData)
                    }
                );


                // ==================================
                // SUCCESS
                // ==================================

                if (response.ok) {

                    const data =
                        await response.json();

                    profileMessage.textContent =
                        "Profile saved successfully!";

                    profileMessage.style.color =
                        "#16a34a";

                    profileStatus.textContent =
                        "Profile completed";

                    return;
                }


                // ==================================
                // PROFILE ALREADY EXISTS
                // ==================================

                if (response.status === 400) {

                    profileMessage.textContent =
                        "Profile already exists.";

                    profileMessage.style.color =
                        "#dc2626";

                    profileStatus.textContent =
                        "Profile already created";

                    return;
                }


                // ==================================
                // OTHER ERROR
                // ==================================

                const errorText =
                    await response.text();

                console.error(
                    "Profile save failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Server error: ${response.status}`
                );


            } catch (error) {

                console.error(
                    "Profile save error:",
                    error
                );

                profileMessage.textContent =
                    "Failed to save profile.";

                profileMessage.style.color =
                    "#dc2626";
            }

        }
    );


    // ==========================================
    // LOGOUT
    // ==========================================

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


    // ==========================================
    // LOAD PROFILE WHEN PAGE OPENS
    // ==========================================

    loadProfile();

})();