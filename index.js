async function insertPatient() {
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;

    // Construct SQL query
    const sql = `INSERT INTO Patient (name, dateOfbirth) VALUES ('${name}', '${dob}')`; // Ensure the correct column name in the SQL statement
    console.log(sql);

    // Call executeQuery to handle the insertion
    const response = await fetch('https://comp4537-1.onrender.com/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql }) // Send the query in the body as an object with key 'query'
    });

    const result = await response.json();
    displayData(result); // Display the response from the server
}

async function executeQuery() {
    const query = document.getElementById('sqlQuery').value.trim();

    // Determine request method based on query type
    const isSelectQuery = query.toUpperCase().startsWith('SELECT');
    const method = isSelectQuery ? 'GET' : 'POST';

    // If it's a SELECT query, send the query as a URL parameter for GET requests
    const url = isSelectQuery 
        ? `https://comp4537-1.onrender.com/query?query=${encodeURIComponent(query)}`
        : 'https://comp4537-1.onrender.com/query';
    
    // Prepare the request body for POST requests
    const body = isSelectQuery ? null : JSON.stringify({ query });

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'x-requested-with': 'XMLHttpRequest'
        },
        body: body // Only include body for POST requests
    });

    const result = await response.json();
    displayData(result);
}



function displayData(result) {
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = ''; // Clear previous response

    if (result.success) {
        // If success, check if data exists
        if (result.data && result.data.length > 0) {
            let table = '<table><tr><th>Patient ID</th><th>Name</th><th>Date of Birth</th></tr>';
            result.data.forEach(patient => {
                table += `<tr>
                            <td>${patient.patientid}</td>
                            <td>${patient.name}</td>
                            <td>${new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                                </tr>`;
            });
            table += '</table>';
            responseDiv.innerHTML = table;
        } else {
            responseDiv.innerHTML = 'Query Successful';
        }
    } else {
        // If not successful, display the error message
        responseDiv.innerHTML = `<p style="color: red;">Error: ${result.error || "An unknown error occurred."}</p>`;
    }
}
