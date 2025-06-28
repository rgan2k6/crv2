<!-- filepath: c:\crv\loadSpreadsheet.php -->
<?php
header('Content-Type: application/json');

if (file_exists('spreadsheet.json')) {
    $data = file_get_contents('spreadsheet.json');
    echo $data;
} else {
    // Return an empty spreadsheet if no data exists
    echo json_encode([["Column 1", "Column 2", "Column 3"]]);
}
?>