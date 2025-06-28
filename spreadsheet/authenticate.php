<!-- filepath: authenticate.php -->
<?php
session_start();

// Define the correct password
$correct_password = 'crv2025'; // Replace with your desired password

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'];

    if ($password === $correct_password) {
        // Password is correct, start a session
        $_SESSION['authenticated'] = true;
        header('Location: spreadsheet.php'); // Redirect to the spreadsheet
        exit();
    } else {
        // Password is incorrect
        echo "<script>alert('Incorrect password!'); window.location.href='login.html';</script>";
    }
} else {
    header('Location: login.html');
    exit();
}
?>