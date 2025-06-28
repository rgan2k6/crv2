<?php
// Get form data
$name = $_POST['name'];
$number = $_POST['number'];
$address = $_POST['address'];
$country = $_POST['country'];
$city = $_POST['city'];
$state = $_POST['state'];
$zip = $_POST['zip'];
$paymentType = $_POST['paymentType'];
$cartData = json_decode($_POST['cartData'], true);

// Validate input
if (empty($name) || empty($number) || empty($address) || empty($country) || empty($city) || empty($state) || empty($zip) || empty($paymentType)) {
    die("All fields are required.");
}

// Prepare email content
$subject = "New Order from CRV Custom Arms";
$message = "Contact Information:\n";
$message .= "Name: $name\n";
$message .= "Phone Number: $number\n";
$message .= "Address: $address\n";
$message .= "Country: $country\n";
$message .= "City: $city\n";
$message .= "State: $state\n";
$message .= "Zip Code: $zip\n";
$message .= "Payment Type: $paymentType\n\n";

// Add payment details based on the selected payment method
if ($paymentType === 'card') {
    $cardNumber = $_POST['cardNumber'];
    $expirationDate = $_POST['expirationDate'];
    $cvc = $_POST['cvc'];
    $nameOnCard = $_POST['nameOnCard'];

    $message .= "Card Details:\n";
    $message .= "Card Number: $cardNumber\n";
    $message .= "Expiration Date: $expirationDate\n";
    $message .= "CVC: $cvc\n";
    $message .= "Name on Card: $nameOnCard\n\n";
} elseif ($paymentType === 'check') {
    $message .= "Payment Method: Check\n";
    $message .= "Note: Please ensure the check is mailed to the following address:\n";
    $message .= "CRV Custom Arms\n";
    $message .= "1234 Main St\n";
    $message .= "City, State, ZIP\n\n";
}

$message .= "Cart Items:\n";
$total = 0;
foreach ($cartData as $item) {
    $message .= "{$item['name']} (Ref: {$item['refNumber']}) - Quantity: {$item['quantity']} - Total: $" . number_format($item['price'] * $item['quantity'], 2) . "\n";
    $total += $item['price'] * $item['quantity'];
}
$message .= "\nTotal: $" . number_format($total, 2);

// Send email
$to = "skylander1019@gmail.com";
$headers = "From: no-reply@crvcustomarms.com";

if (mail($to, $subject, $message, $headers)) {
    echo "Order submitted successfully!";
} else {
    echo "Error sending email.";
}
?>