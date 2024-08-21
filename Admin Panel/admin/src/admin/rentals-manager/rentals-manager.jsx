import React, { useEffect, useState } from 'react';
import {
    Accordion,
    Button,
    Row,
    Col,
    InputGroup,
    Form,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { fetchCars, fetchLocations, fetchReservations } from '../../hooks/useFetchData';
import { loadingContent } from '../../components/general/general-components';
import {
    Card, CardHeader, CardMedia, CardContent, CardActions,
    Collapse, Avatar, IconButton, Typography
} from '@mui/material';
import { red, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const RentalsManager = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cars, setCars] = useState(null);
    const [locations, setLocations] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const groupReservationsWithSameOwner = (allReservations) => {
        return allReservations.reduce((acc, curr) => {
            let key = curr['reservationOwner'];
            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);
            return acc;
        }, {});
    };

    useEffect(() => {
        Promise.all([
            fetchCars(),
            fetchLocations(),
            fetchReservations(),
        ]).then(responses => {
            setCars(responses[0]);
            setLocations(responses[1]);
            setReservations(responses[2] ? groupReservationsWithSameOwner(responses[2]) : responses[2]);
            setIsLoading(false);
        });
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleCancelSpecificReservation = async (documentId) => {
        Swal.fire({
            title: "Do you want to cancel this reservation?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: blue[500],
            cancelButtonColor: red[500],
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDoc(doc(db, "rentals", documentId))
                    .then(() => {
                        Swal.fire(
                            'Reservation Cancelled!',
                            'Selected car has been removed!',
                            'success'
                        ).then(() => {
                            window.location.reload();
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!"
                        });
                    });
            }
        });
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <h1 style={{ color: blue[700], marginBottom: '20px' }}>Rentals Management</h1>
            <div className="d-grid gap-2 p-3">
                {
                    !isLoading
                        ? reservations
                            ? <Accordion>
                                {Object.entries(reservations).map(([groupKey, reserveGroup], index) =>
                                    <Accordion.Item key={index} eventKey={index} style={{ borderRadius: '8px', border: `1px solid ${blue[200]}` }}>
                                        <Accordion.Header className="d-flex align-items-center" style={{ backgroundColor: blue[50], color: blue[700], padding: '10px 20px' }}>
                                            <h3 className="mb-0">
                                                <span>USER: </span>
                                                <span className="fw-bold">{groupKey}</span>
                                            </h3>
                                        </Accordion.Header>
                                        <Accordion.Body style={{ padding: '20px' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                flexWrap: 'wrap', 
                                                justifyContent: 'center', 
                                                gap: '16px'
                                            }}>
                                                {reserveGroup.map((reserveData, index) =>
                                                    <Card key={index} sx={{ maxWidth: 300, boxShadow: `0 4px 8px ${blue[200]}` }} style={{ flex: '1 1 calc(33.333% - 16px)', marginBottom: '16px', borderRadius: '8px' }}>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar sx={{ bgcolor: green[500] }} aria-label="car">
                                                                    {reserveData.carBrand[0]}
                                                                </Avatar>
                                                            }
                                                            action={
                                                                <IconButton aria-label="settings">
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                            }
                                                            title={`${reserveData.carBrand} / ${reserveData.carModel}`}
                                                            subheader={`${locations[reserveData.pickupLocation]} to ${locations[reserveData.dropoffLocation]}`}
                                                        />
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={cars[reserveData.carId].image}
                                                            alt={`${reserveData.carBrand} / ${reserveData.carModel}`}
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {`HP: ${cars[reserveData.carId].power}, Engine Size: ${cars[reserveData.carId].engineSize}, Gearbox: ${cars[reserveData.carId].gearbox}, Body Type: ${cars[reserveData.carId].bodyType}, Fuel Type: ${cars[reserveData.carId].fuelType}`}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions disableSpacing>
                                                            <IconButton aria-label="add to favorites">
                                                                <FavoriteIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="share">
                                                                <ShareIcon />
                                                            </IconButton>
                                                            <ExpandMore
                                                                expand={expanded}
                                                                onClick={handleExpandClick}
                                                                aria-expanded={expanded}
                                                                aria-label="show more"
                                                            >
                                                                <ExpandMoreIcon />
                                                            </ExpandMore>
                                                        </CardActions>
                                                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                            <CardContent>
                                                                <Row>
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
                                                                    <Col xs={12} md={6}>
                                                                        <InputGroup size="lg" className="my-2" style={{marginTop:"10px", marginBottom:'10px '}}>
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
                                                                <Button variant="danger" size="sm" onClick={() => handleCancelSpecificReservation(reserveData.documentId)} style={{ width: '200px', padding: '8px', fontSize: '14px' }}>
                                                                    Cancel Reservation
                                                                </Button>
                                                            </CardContent>
                                                        </Collapse>
                                                    </Card>
                                                )}
                                            </div>
                                            {/* <div className="text-center mt-3">
                                                <Button variant="danger" size="lg" style={{ width: '200px' }}>
                                                    Cancel Reservations
                                                </Button>
                                            </div> */}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}
                            </Accordion>
                            : <div className="text-center">
                                <h3 className="text-muted">There are no active reservations.</h3>
                            </div>
                        : loadingContent
                }
            </div>
        </div>
    );
};

export default RentalsManager;
