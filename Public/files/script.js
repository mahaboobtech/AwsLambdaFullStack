document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const paymentForm = document.getElementById('paymentForm');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        // Check if the contact form is valid
        if (contactForm.checkValidity()) {
            paymentForm.style.display = 'block';
        } else {
            alert('Please fill out all required fields.');
        }
    });

});

function markAsPaid() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const description = document.getElementById('message').value;
    const paymentId = document.getElementById('transactionId').value;

    // Create an object with the data you want to send
    const data = {
        name: name,
        email: email,
        description: description,
        paymentId: paymentId
    };

    // Convert the data to JSON
    const jsonData = JSON.stringify(data);

    console.log("Data has been created :");
    console.log(jsonData);

    // Set up the HTTP request
    const xhr = new XMLHttpRequest();
    const url = "https://yourapigatecode.execute-api.yourRegion.amazonaws.com/default/pythondynamodblambda"; // Replace with your Python Lambda endpoint URL

    // Open a POST request to your Lambda endpoint
    xhr.open("POST", url, true);

    // Set the content type to JSON
    xhr.setRequestHeader("Content-Type", "application/json");

    // Set CORS headers
    xhr.setRequestHeader("Access-Control-Allow-Origin", "https://yourapigatecode.execute-api.yourRegion.amazonaws.com"); // replace your api gate way as like this for allowing cors request
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "POST");

    // Send the request with the JSON data
    xhr.send(jsonData);

    // Handle the response from Lambda
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request successful
                console.log("Request successful!");
                console.log(xhr.responseText); // Response from Lambda
                alert("Data sent successfully!");
            } else {
                // Request failed
                console.error("Request failed:", xhr.status);
                alert("Failed to send data. Please try again later.");
            }
        }
    };
    setTimeout(function () {
        window.location.href = "index.html"; // Redirect to homepage after marking as paid
    }, 2000);
}
