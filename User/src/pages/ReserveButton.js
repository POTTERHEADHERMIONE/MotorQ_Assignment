import React from 'react';
import { Button } from 'react-bootstrap';
import emailjs from 'emailjs-com'; // Import EmailJS

const ReserveButton = ({ carId, userEmail, cars }) => {
    const handleReserveButtonClick = () => {
        // Check if carId is valid and exists in the cars data
        if (cars && cars[carId]) {
            const carDetails = cars[carId];

            // Define email details using the car details
            const emailParams = {
                to_email: userEmail, // User's email from props
                car_name: carDetails.name, // Car name from cars data
                car_model: carDetails.model, // Car model from cars data
                start_date: carDetails.startDate, // Start date (should be passed from somewhere)
                end_date: carDetails.endDate // End date (should be passed from somewhere)
            };

            // Send booking confirmation email
            emailjs.send('service_ldyz4v3', 'template_66ggs3a', emailParams, 'YOd0AFi1fEuhIRbI3kO')
                .then((response) => {
                    console.log('Email sent successfully:', response);
                }, (error) => {
                    console.log('Failed to send email:', error);
                });
        } else {
            console.error('Car details are not available.');
        }
    };

    return (
        <Button
            variant="success"
            size="lg"
            className="w-100 fs-4 fw-bold"
            type="button"
            onClick={handleReserveButtonClick}
            disabled={!cars || !cars[carId] || cars[carId].carCount <= 0}
        >
            Reserve Now!
        </Button>
    );
};

export default ReserveButton;
