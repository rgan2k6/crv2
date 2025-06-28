<!-- filepath: c:\crv\logout.php -->
<?php
session_start();
session_destroy();
header('Location: login.html');
exit();
?>