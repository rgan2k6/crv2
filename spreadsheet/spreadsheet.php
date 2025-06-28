<?php
session_start();
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Location: login.html'); // Redirect to login if not authenticated
    exit();
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gun Sale Record</title>
<button onclick="window.location.href='logout.php'">Logout</button>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        td {
            background-color: #f9f9f9;
        }
        td:focus {
            outline: 2px solid #4CAF50;
            background-color: #e8f5e9;
        }
        button {
            margin: 5px;
        }
    </style>
</head>
<body>
    <h1>Gun Sale Record</h1>
    <div>
        <button id="addRow">Add Row</button>
        <button id="addColumn">Add Column</button>
        <button id="saveButton">Save</button>
    </div>
    <table id="spreadsheet" contenteditable="true">
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Row 1, Col 1</td>
                <td>Row 1, Col 2</td>
                <td>Row 1, Col 3</td>
            </tr>
        </tbody>
    </table>

    <script>
        const table = document.getElementById('spreadsheet');
        const addRowButton = document.getElementById('addRow');
        const addColumnButton = document.getElementById('addColumn');
        const saveButton = document.getElementById('saveButton');

        // Load saved data on page load
        window.addEventListener('DOMContentLoaded', () => {
            fetch('loadSpreadsheet.php')
                .then(response => response.json())
                .then(data => {
                    console.log('Loaded data:', data); // Debugging
                    populateTable(data);
                })
                .catch(error => {
                    console.error('Error loading spreadsheet:', error);
                });
        });

        // Populate the table with data
        function populateTable(data) {
            const tbody = table.querySelector('tbody');
            const thead = table.querySelector('thead');
            tbody.innerHTML = ''; // Clear existing rows

            // Populate header
            if (data.length > 0) {
                const headerRow = document.createElement('tr');
                data[0].forEach(header => {
                    const th = document.createElement('th');
                    th.contentEditable = true;
                    th.innerText = header;
                    headerRow.appendChild(th);
                });
                thead.innerHTML = '';
                thead.appendChild(headerRow);
            }

            // Populate rows
            for (let i = 1; i < data.length; i++) {
                const row = document.createElement('tr');
                data[i].forEach(cell => {
                    const td = document.createElement('td');
                    td.contentEditable = true;
                    td.innerText = cell;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
        }

        // Add a new row
        addRowButton.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            const columnCount = table.rows[0].cells.length;

            for (let i = 0; i < columnCount; i++) {
                const newCell = document.createElement('td');
                newCell.contentEditable = true;
                newCell.innerText = '';
                newRow.appendChild(newCell);
            }

            tbody.appendChild(newRow);
        });

        // Add a new column
        addColumnButton.addEventListener('click', () => {
            const rows = table.rows;

            for (let i = 0; i < rows.length; i++) {
                const newCell = document.createElement(i === 0 ? 'th' : 'td');
                newCell.contentEditable = true;
                newCell.innerText = '';
                rows[i].appendChild(newCell);
            }
        });

        // Save the spreadsheet
        saveButton.addEventListener('click', () => {
            const rows = table.rows;
            const data = [];

            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                const row = [];
                for (let j = 0; j < cells.length; j++) {
                    row.push(cells[j].innerText);
                }
                data.push(row);
            }

            // Send the data to the server
            fetch('saveSpreadsheet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.text())
            .then(result => {
                alert('Spreadsheet saved successfully!');
            })
            .catch(error => {
                console.error('Error saving spreadsheet:', error);
            });
        });
    </script>
</body>
</html>