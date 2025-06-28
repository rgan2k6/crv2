<!-- filepath: c:\crv\authenticate.php -->
<?php
session_start();

// Replace with your admin credentials
$admin_username = 'admin';
$admin_password_hash = password_hash('password123', PASSWORD_DEFAULT); // Use a hashed password

if ($_POST['username'] === $admin_username && password_verify($_POST['password'], $admin_password_hash)) {
    $_SESSION['logged_in'] = true;
    header('Location: admin.html');
    exit();
} else {
    echo "Invalid credentials. <a href='login.html'>Try again</a>";
}
?>