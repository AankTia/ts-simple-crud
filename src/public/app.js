document.addEventListener("DOMContentLoaded", () => {
    const userForm = document.getElementById("user-form");
    const formTitle = document.getElementById("form-title");
    const userIdInput = document.getElementById("user-id");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const usersList = document.getElementById("users-list");

    // Load all users on page load
    fetchUsers();

    // Form submission handler
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = {
            name: nameInput.value,
            email: emailInput.value,
        };

        const userId = userIdInput.value;

        if (userId) {
            // Update existing user
            await updateUser(userId, user);
        } else {
            // Create new user
            await createUser(user);
        }

        // Reset form and realod users
        resetForm();
        fetchUsers();
    });

    // Cancel button handler
    cancelBtn.addEventListener("click", resetForm);

    // Fetch all users from the API
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            displayUsers(users);
        } catch (error) {
            console.error("Error fetchig users:", error);
            alert("Failed to load users");
        }
    }

    // Display users in the list
    function displayUsers(users) {
        usersList.innerHTML = "";

        if (users.lenght == 0) {
            usersList.innerHTML = "<p>No users found</p>";
            return;
        }

        users.forEach((user) => {
            const userCard = document.createElement("div");
            userCard.className = "user-card";

            userCard.innerHTML = `
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    <small>
                        Created: ${new Date(user.created_at).toLocaleString()}
                    </small>
                </div>
                <div class="user-actions">
                    <button class="edit-btn" data-id=${user.id}>Edit</button>
                    <button class="delete-btn" data-id=${user.id}>Delete</button>
                </div>
            `;

            usersList.append(userCard);

        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", () => editUser(btn.dataset.id));
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => deleteUser(btn.dataset.id));
        });
    }

    // Create a new user
    async function createUser(user) {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create user");
            }

            alert("User created successfully!");
        } catch (error) {
            console.error("Error creating user:", error);
            alert(error.message);
        }
    }

    // Load user data for editing
    async function editUser(id) {
        try {
            const response = await fetch(`/api/users/${id}`);
            const user = await response.json();

            // Populate the form
            userIdInput.value = user.id;
            nameInput.value = user.name;
            emailInput.value = user.email;

            // Update form UI
            formTitle.textContent = 'Edit User';
            submitBtn.textContent = "Update User";
            cancelBtn.style.display = "block";

            // Scroll to form
            document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error("Error loading user data:", error);
            alert("Failed to load user data for editing")
        }

    }

    // Update an existing user
    async function updateUser(id, user) {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update user");
            }

            alert("User update successfully!");
        } catch (error) {
            console.error("Error updating users:", error);
            alert(error.message);
        }
    }

    // Delete a user
    async function deleteUser(id) {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete user");
            }

            alert("user deleted successfully!");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error.message);
        }
    }

    // Reset the form to its initial state
    function resetForm() {
        userForm.reset();
        userIdInput.value = "";
        formTitle.textContent = "Add New User";
        submitBtn.textContent = "Add User";
        cancelBtn.style.display = "none";
    }
});