"use strict";

// IIFE - Immediately Invoked Function Expression.
// AKA - Anonymous Self-Executing Function.
(function(){

    // Functions that run when the user is on that page.
    function DisplayHomePage() {
        console.log("Home Page");
    }

    function DisplayAboutPage(){
        console.log("About Page");
    }

    function DisplayPortfolioPage(){
        console.log("Portfolio Page");
    }

    function DisplayContactPage(){
        console.log("Contact Page");
    }

    function Start()
    {
        console.log("App Started!");

        // Detect what page the user is on based on the HTML title tag.
        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Portfolio":
                DisplayPortfolioPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();
