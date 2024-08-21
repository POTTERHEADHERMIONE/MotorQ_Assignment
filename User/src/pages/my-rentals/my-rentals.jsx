import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, ListGroup, InputGroup, Form, Spinner } from 'react-bootstrap';
import { TbEngine, TbManualGearbox } from 'react-icons/tb';
import { BsCarFront, BsFillCarFrontFill, BsFillFuelPumpFill } from 'react-icons/bs';
import { PiEngineFill } from 'react-icons/pi';
import Swal from 'sweetalert2';

import { fetchCars, fetchLocations, fetchReservations } from '../../hooks/useFetchData';

const MyRentals = () => {
    const locale = 'en';
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(({ UserSlice }) => UserSlice.user);
    const [cars, setCars] = useState(null);
    const [locations, setLocations] = useState(null);
    const [reservations, setReservations] = useState(null);

    useEffect(() => {
        setInterval(() => {
            setDate(new Date());
        }, 60 * 1000);

        Promise.all([
            fetchCars(),
            fetchLocations(),
            fetchReservations(user.email),
        ])
        .then(responses => {
            setCars(responses[0]);
            setLocations(responses[1]);
            setReservations(responses[2]);
            setIsLoading(false);
        });
    }, [user.email]);

    const handleCancelReservation = (reservationId, carId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to cancel this reservation?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReservation(reservationId, carId)
                    .then(() => {
                        setReservations(reservations.filter(reservation => reservation.id !== reservationId));
                        Swal.fire(
                            'Cancelled!',
                            'Your reservation has been cancelled.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error("Error cancelling reservation:", error);
                        Swal.fire(
                            'Error!',
                            `There was an issue cancelling your reservation. ${error.message}`,
                            'error'
                        );
                    });
            }
        });
    };
    
    const deleteReservation = async (reservationId, carId) => {
        try {
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete reservation: ${errorMessage}`);
            }
    
            // After successfully deleting the reservation, update the car availability
            await updateCarAvailability(carId);
    
            return response.json();
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    };
    
    const updateCarAvailability = async (carId) => {
        try {
            const response = await fetch(`/api/cars/${carId}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ available: true }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update car availability: ${errorMessage}`);
            }
    
            return response.json();
        } catch (error) {
            console.error('Error updating car availability:', error);
            throw error;
        }
    };
    
    const welcomeMessage = () => {
        let day = `${date.toLocaleDateString(locale, { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleDateString(locale, { month: 'long' })}`;
        let hour = date.getHours();
        let wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
        let time = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });
        return (
            <h4 className="mb-1">
                {day} <span className="text-black-50">|</span> {time}
                <hr className="my-1"/>
                {wish} <span className="fw-600">{user.email}</span>
            </h4>
        );
    };

    return (
        <div id="my-rentals">
            <Container className="py-4">
                <Row className="mb-5">
                    <Col>
                        <h1 className="fs-1 text-center text-uppercase">My Rentals</h1>
                    </Col>
                </Row>
                {user.email && (
                    <div className="d-flex justify-content-center mb-1">
                        {welcomeMessage()}
                    </div>
                )}
                <Row>
                    {!isLoading
                        ? reservations && reservations.length > 0
                            ? reservations.map(reserveData => (
                                <Col xs={{ span: 10, offset: 1 }} key={reserveData.id}>
                                    <Card className="my-2">
                                        <Row>
                                            <Col xs={12}>
                                                <ListGroup variant="flush" className="text-center">
                                                    <ListGroup.Item variant="secondary" action>
                                                        <BsFillCarFrontFill size="2em" className="me-2" style={{ marginTop: "-10px" }} />
                                                        <span className="fs-5 fw-bold">{`${reserveData.carBrand} / ${reserveData.carModel}`}</span>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <img src={cars[reserveData.carId].image} alt={`${reserveData.carBrand} / ${reserveData.carModel}`} />
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item>
                                                        <TbEngine size="2em" className="me-2" style={{ marginTop: "-8px" }} />
                                                        <span className="fs-6">HP:</span> &nbsp;
                                                        <span className="fs-5 fw-bold">{cars[reserveData.carId].power}</span>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <PiEngineFill size="2em" className="me-2" style={{ marginTop: "-8px" }} />
                                                        <span className="fs-6">Engine Size:</span> &nbsp;
                                                        <span className="fs-5 fw-bold">{cars[reserveData.carId].engineSize}</span>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <TbManualGearbox size="2em" className="me-2" style={{ marginTop: "-8px" }} />
                                                        <span className="fs-6">Gear Box:</span> &nbsp;
                                                        <span className="fs-5 fw-bold">{cars[reserveData.carId].gearbox}</span>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <BsCarFront size="2em" className="me-2" style={{ marginTop: "-10px" }} />
                                                        <span className="fs-6">Body Type:</span> &nbsp;
                                                        <span className="fs-5 fw-bold">{cars[reserveData.carId].bodyType}</span>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <BsFillFuelPumpFill size="2em" className="me-2" style={{ marginTop: "-10px" }} />
                                                        <span className="fs-6">Fuel Type:</span> &nbsp;
                                                        <span className="fs-5 fw-bold">{cars[reserveData.carId].fuelType}</span>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <InputGroup size="lg" className="my-2">
                                                            <InputGroup.Text id="pick-up-locations">Pick-up Location</InputGroup.Text>
                                                            <Form.Select size="lg" disabled>
                                                                <option value={reserveData.pickupLocation}>{locations[reserveData.pickupLocation]}</option>
                                                            </Form.Select>
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <InputGroup size="lg" className="my-2">
                                                            <InputGroup.Text id="start-date">Start Date</InputGroup.Text>
                                                            <Form.Control
                                                                type="date"
                                                                min={reserveData.startDate}
                                                                value={reserveData.startDate}
                                                                disabled
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <InputGroup size="lg" className="my-2">
                                                            <InputGroup.Text id="drop-off-locations">Drop-off Location</InputGroup.Text>
                                                            <Form.Select size="lg" disabled>
                                                                <option value={reserveData.dropoffLocation}>{locations[reserveData.dropoffLocation]}</option>
                                                            </Form.Select>
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <InputGroup size="lg" className="my-2">
                                                            <InputGroup.Text id="end-date">End Date</InputGroup.Text>
                                                            <Form.Control
                                                                type="date"
                                                                min={reserveData.endDate}
                                                                value={reserveData.endDate}
                                                                disabled
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <Button
                                                    className="m-2"
                                                    variant="danger"
                                                    onClick={() => handleCancelReservation(reserveData.id, reserveData.carId)}
                                                >
                                                    Cancel Reservation
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))
                            : <div>No reservations found.</div>
                        : <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                            <span className="ms-2">Loading...</span>
                          </div>
                    }
                </Row>
                <Row>
                    <Col>
                        <div className="text-center mt-5">
                            <Link to="/" className="btn btn-outline-dark text-uppercase px-5">Back</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyRentals;
