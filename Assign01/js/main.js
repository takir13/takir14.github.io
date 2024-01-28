"use strict";

(function(){
    function Start(){
        console.log("App Started...");

        let footerNavBar = document.getElementById('footer-nav-bar');
        footerNavBar.innerHTML = `
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="privacy.html">Privacy Policy</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="terms.html">Terms of Service</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="contact.html">Contact</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }

    const projects = [
        {
            title: "Harmony Hub",
            description: "A social networking platform that connects people with similar interests and hobbies.",
            image: "images/harmony-hub.png"
        },
        {
            title: "Todo List",
            description: "A simple web app that lets you create and manage your tasks.",
            image: "images/todo-list.png"
        },
        {
            title: "Calculator",
            description: "A basic calculator that performs arithmetic operations.",
            image: "images/calculator.png"
        },
        {
            title: "Weather App",
            description: "A web app that shows the current weather and forecast for any location.",
            image: "images/weather-app.png"
        },
        {
            title: "Quiz App",
            description: "A web app that tests your knowledge on various topics.",
            image: "images/quiz-app.png"
        },
        {
            title: "Memory Game",
            description: "A fun game that challenges your memory skills.",
            image: "images/memory-game.png"
        }
    ];

// Variables for the project list and the load more button
    const projectList = document.getElementById("project-list");
    const loadMoreButton = document.getElementById("load-more-button");

// Variables for the pagination logic
    const pageSize = 3; // Number of projects to show per page
    let currentPage = 1; // Current page number
    let totalPage = Math.ceil(projects.length / pageSize); // Total number of pages

// Function to create a project card element
    function createProjectCard(project) {
        // Create a div element with the project-card class
        let projectCard = document.createElement("div");
        projectCard.className = "project-card col-md-4 col-sm-6 col-xs-12";

        // Create an img element with the project image
        let projectImage = document.createElement("img");
        projectImage.src = project.image;
        projectImage.alt = project.title;

        // Create a div element with the project-card-body class
        let projectCardBody = document.createElement("div");
        projectCardBody.className = "project-card-body";

        // Create an h3 element with the project-card-title class and the project title
        let projectCardTitle = document.createElement("h3");
        projectCardTitle.className = "project-card-title";
        projectCardTitle.textContent = project.title;

        // Create a p element with the project-card-description class and the project description
        let projectCardDescription = document.createElement("p");
        projectCardDescription.className = "project-card-description";
        projectCardDescription.textContent = project.description;

        // Append the elements to the project card body
        projectCardBody.appendChild(projectCardTitle);
        projectCardBody.appendChild(projectCardDescription);

        // Append the elements to the project card
        projectCard.appendChild(projectImage);
        projectCard.appendChild(projectCardBody);

        // Return the project card element
        return projectCard;
    }

// Function to show the projects for the current page
    function showProjects() {
        // Clear the project list
        projectList.innerHTML = "";

        // Loop through the projects array from the start index to the end index
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize, projects.length);
        for (let i = startIndex; i < endIndex; i++) {
            // Create a project card element for each project
            let projectCard = createProjectCard(projects[i]);

            // Append the project card element to the project list
            projectList.appendChild(projectCard);
        }
    }

// Function to handle the click event of the load more button
    function loadMore() {
        // Increment the current page number
        currentPage++;

        // Show the projects for the current page
        showProjects();

        // Disable the load more button if the current page is the last page
        if (currentPage === totalPage) {
            loadMoreButton.disabled = true;
        }
    }

// Show the projects for the first page when the page loads
    showProjects();

// Add an event listener to the load more button
    loadMoreButton.addEventListener("click", loadMore);

    window.addEventListener("load", Start);
})();