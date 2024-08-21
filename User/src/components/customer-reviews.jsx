import React, {useRef} from 'react';

import {reviewsData} from "../DATA/data.jsx";

import {Button, Card, Carousel, Col, Container, Row} from "react-bootstrap";
import {GrNext, GrPrevious} from "react-icons/gr";
import {AiFillStar} from "react-icons/ai";


const CustomerReview = () => {

    const sliderRef = useRef(null);

    const onPrevClick = () => {
        sliderRef.current.prev();
    };
    const onNextClick = () => {
        sliderRef.current.next();
    };

    const resultsRender = [];
    for (let i = 0; i < reviewsData.length; i += 2) {
        resultsRender.push(
            <Carousel.Item key={`review_carousel_${i}`} interval={99999}>
                <Carousel.Caption className="carousel-caption text-dark text-start">
                    <Row>
                    {
                        reviewsData.slice(i, i + 2)
                            .map((review, index) => (
                                <Col xs={6} key={`review_${i+index}`} className="d-flex align-items-stretch">
                                    <Card>
                                        <Card.Img variant="top" src={review.customerImageUrl} className="image-fluid"/>
                                        <Card.Body>
                                            <Card.Title className="text-center">{review.customerName}</Card.Title>
                                            <Card.Text className="m-0">{review.customerReview}</Card.Text>
                                            <div className="review-star text-center">
                                                { Array.from({length: review.customerStar}).map((val, inx) => <AiFillStar key={`star_${inx}`} />) }
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                    }
                    </Row>
                </Carousel.Caption>
            </Carousel.Item>
        );
    }


    return (
    <div id="customer-reviews">
        
    </div>
    );
    };
    export default CustomerReview;