<?php

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $fullName = $_POST["fullName"];
        $contactNumber = $_POST["contactNumber"];
        $emailAddress = $_POST["emailAddress"];
        $commentArea = $_POST["commentArea"];
        $experienceRating = $_POST["experienceRating"];

        $to = 'takirul321@gmail.com';
        $subject = 'New Feedback Received';
        $message = "Full Name: $fullName\nContact Number: $contactNumber\nEmail Address: $emailAddress\nComment: $commentArea\nExperience Rating: $experienceRating\n";
        $headers = 'From: webmaster@example.com';

        if (mail($to, $subject, $message, $headers)) {
            echo "Email successfully sent to $to";
        } else {
            echo "Email sending failed.";
        }

        echo "Successfully received the following feedback:\n";
        echo "Full Name: $fullName\n";
        echo "Contact Number: $contactNumber\n";
        echo "Email Address: $emailAddress\n";
        echo "Comment: $commentArea\n";
        echo "Experience Rating: $experienceRating\n";
    }
?>