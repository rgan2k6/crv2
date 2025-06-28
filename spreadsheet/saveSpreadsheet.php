<!-- filepath: c:\crv\saveSpreadsheet.php -->
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $decodedData = json_decode($data, true);

    if ($decodedData) {
        // Save the data to a file (e.g., spreadsheet.json)
        file_put_contents('spreadsheet.json', json_encode($decodedData, JSON_PRETTY_PRINT));
        echo "Spreadsheet saved successfully!";
    } else {
        http_response_code(400);
        echo "Invalid data received.";
    }
} else {
    http_response_code(405);
    echo "Method not allowed.";
}
?>