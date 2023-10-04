// async function fetchData() {
//     const res = await fetch ("https://api.coronavirus.data.gov.uk/v1/data");
//     const record = await res.json();
//     console.log(record);
//     document.getElementById("date").innerHTML=record.data[0].date;
//     document.getElementById("areaName").innerHTML=record.data[0].areaName;
//     document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
//     document.getElementById("deathNew").innerHTML=record.data[0].deathNew;
// }
// fetchData();


async function checkUserStatus() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);

    if (userData && userData.name) {
        // Display user data in your popup HTML
        document.getElementById("namee").innerHTML = `Name: ${userData.name}`;
        document.getElementById("emaill").innerHTML = `Email: ${userData.email}`;
        document.getElementById("phonee").innerHTML = `Phone: ${userData.phone}`;
        document.getElementById("isAdminn").innerHTML = `Admin: ${userData.isAdmin ? 'Yes' : 'No'}`;
    }
    else {
        document.getElementById("loginMessage").style.display = "block";
    }
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Please fill in all the fields.');
        return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
        const response = await fetch('http://localhost:8800/api/auth/login', {
            method: "POST",
            body: formData,
            withCredentials: true,
            credentials: "include",
        });

        if (response.status === 200) {
            const userData = await response.json();
            console.log(userData);
            localStorage.setItem("userData", JSON.stringify(userData.userr));
            console.log("Login successful");
            // Hide the login form and display user data
            loginForm.style.display = "none";
            checkUserStatus();
        } else if (response.status === 401) {
            console.log('Authentication failed'); // Unauthorized
        } else {
            console.log('Login failed:', response.statusText);
        }
    } catch (error) {
        console.log(error.response);
    }
});


checkUserStatus();

// Check if the user is logged in and get user data
// async function checkUserStatus() {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     console.log(userData);

//     if (userData) {
//         // Display user data in your popup HTML
//         document.getElementById("name").innerHTML = `Name: ${userData.name}`;
//         document.getElementById("email").innerHTML = `Email: ${userData.email}`;
//         document.getElementById("phone").innerHTML = `Phone: ${userData.phone}`;
//         document.getElementById("isAdmin").innerHTML = `Admin: ${userData.isAdmin ? 'Yes' : 'No'}`;
//     }
//     else {
//         document.getElementById("loginMessage").style.display = "block";
//     }

//     // const res = await fetch("http://localhost:8800/api/auth/user", {
//     //     method: "GET",
//     //     withCredentials: true,
//     //     credentials: "include",
//     // });

//     // const data = await res.json();


//     // if (data.status) {
//     //     // User is logged in, display user data
//     //     document.getElementById("name").innerHTML = `Name: ${data.user.name}`;
//     //     document.getElementById("email").innerHTML = `Email: ${data.user.email}`;
//     //     document.getElementById("phone").innerHTML = `Phone: ${data.user.phone}`;
//     //     document.getElementById("isAdmin").innerHTML = `Admin: ${data.user.isAdmin ? 'Yes' : 'No'}`;
//     // } else {
//     //     // User is not logged in, display a message
//     //     document.getElementById("loginMessage").style.display = "block";
//     // }
//     // }

// Call functions
// checkUserStatus();
