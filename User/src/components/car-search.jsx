import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button } from "react-bootstrap";
import { fetchBrands, fetchCars, fetchModels } from "../hooks/useFetchData";
import './CarSearch.css';

const CarSearch = () => {
    const [cars, setCars] = useState(null);
    const [brands, setBrands] = useState(null);
    const [models, setModels] = useState(null);
    const [brandModelIds, setBrandModelIds] = useState(null);
    const [fuelTypes, setFuelTypes] = useState(null);
    const [rentRange, setRentRange] = useState(["1 day", "2 days", "3 days"]);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [selectedRentRange, setSelectedRentRange] = useState("");
    const [carResults, setCarResults] = useState([]);

    const handleBrandChange = e => {
        let value = e.target.value ? parseInt(e.target.value) || 0 : "";
        setSelectedBrand(value);
        if (value === "") setSelectedModel("");
    }

    const handleModelChange = e => {
        let value = e.target.value ? parseInt(e.target.value) || 0 : "";
        setSelectedModel(value);
    }

    const filterCars = () => {
        if (!cars) return;
    
        let filteredCars = Object.entries(cars).filter(([id, car]) =>
            (selectedBrand === "" || car.brandId === selectedBrand) &&
            (selectedModel === "" || car.modelId === selectedModel) &&
            (selectedFuel === "" || car.fuelType === selectedFuel) &&
            (selectedRentRange === "" || car.rentRange === selectedRentRange)
        );
    
        // Map filtered results to include model names
        const resultsWithModels = filteredCars.map(([id, car]) => {
            // Find the model associated with the car
            const model = Object.values(models).find(model => model.brandId === car.brandId);
            // Get the model name if it exists, otherwise default to 'Unknown Model'
            const modelName = model ? (model.models[car.modelId] || 'Unknown Model') : 'Unknown Model';
            return { id, modelName };
        });
    
        setCarResults(resultsWithModels);

        // Log selected criteria and search results to the console
        console.log("Selected Criteria:");
        console.log(`Brand: ${brands && brands[selectedBrand] ? brands[selectedBrand] : 'Any'}`);
        console.log(`Model: ${selectedModel ? 
            (Object.values(models).find(model => model.brandId === selectedBrand) &&
            Object.values(models).find(model => model.brandId === selectedBrand).models[selectedModel]) || 'Any' 
            : 'Any'
        }`);
        console.log(`Fuel Type: ${selectedFuel || 'Any'}`);
        console.log(`Rent Range: ${selectedRentRange || 'Any'}`);
        console.log("Search Results:");
        console.log(carResults);
    }

    useEffect(() => {
        Promise.all([
            fetchBrands(),
            fetchModels(),
            fetchCars()
        ]).then(([brandResponse, modelResponse, carResponse]) => {
            setBrands(brandResponse);
            setModels(modelResponse);
            setCars(carResponse);

            const fuelTypes = [...new Set(Object.values(carResponse).map(car => car.fuelType))];
            setFuelTypes(fuelTypes);

            const brandIds = Object.values(carResponse).map(item => ({ brandId: item.brandId, modelId: item.modelId }));
            const brandModelIds = Object.values(brandIds.reduce((acc, obj) => {
                acc[obj.brandId] = acc[obj.brandId] || { brandId: obj.brandId, modelId: [] };
                if (!acc[obj.brandId].modelId.includes(obj.modelId))
                    acc[obj.brandId].modelId.push(obj.modelId);
                return acc;
            }, {}));

            setBrandModelIds(brandModelIds);
        });
    }, []);

    return (
        <div id="car-search" className="pb-1">
            <Container className="py-5">
                <Row>
                    <Col>
                        <h1 style = {{color:'black'}} className="quinary-color fs-2 p-0 mb-2">
                           Search for your travel partners
                        </h1>
                        <p style = {{color:'black'}}className="quinary-color fs-5 p-0 m-0 mb-5">
                            Select from a group of amazing cars
                        </p>
                        <Container>
                            <Row>
                                <Col xs={12} md={3} className="my-2">
                                    <Form.Select
                                        size="lg"
                                        value={selectedBrand}
                                        onChange={handleBrandChange}
                                    >

                                        <option value="">Choose a Brand</option>
                                        {brandModelIds && brandModelIds.map(item =>
                                            <option key={`brand_${item.brandId}`} value={item.brandId}>
                                                {brands[item.brandId]}
                                            </option>
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col xs={12} md={3} className="my-2">
                                    <Form.Select
                                        size="lg"
                                        value={selectedModel}
                                        onChange={handleModelChange}
                                    >
                                        <option value="">{selectedBrand ? "Choose a Model" : "---"}</option>
                                        {selectedBrand !== "" && brandModelIds && brandModelIds
                                            .filter(i => i.brandId === selectedBrand)
                                            .map(item =>
                                                item.modelId.map(i =>
                                                    <option key={`model_${i}`} value={i}>
                                                        {Object.values(models).find(model => model.brandId === selectedBrand).models[i]}
                                                    </option>
                                                )
                                            )
                                        }
                                    </Form.Select>
                                </Col>
                                <Col xs={12} md={3} className="my-2">
                                    <Form.Select
                                        size="lg"
                                        value={selectedFuel}
                                        onChange={e => setSelectedFuel(e.target.value)}
                                    >
                                        <option value="">Choose a Fuel Type</option>
                                        {fuelTypes && fuelTypes.map(fuelType =>
                                            <option key={`fuel_${fuelType}`} value={fuelType}>
                                                {fuelType}
                                            </option>
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col xs={12} md={3} className="my-2">
                                    <Form.Select
                                        size="lg"
                                        value={selectedRentRange}
                                        onChange={e => setSelectedRentRange(e.target.value)}
                                    >
                                        <option value="">Choose Rent Range</option>
                                        {rentRange.map(range =>
                                            <option key={`rent_${range}`} value={range}>
                                                {range}
                                            </option>
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col xs={12} className="my-2 d-flex justify-content-center">
                                    <Button
                                        style={{ width: "300px" }}
                                        variant="primary"
                                        className="search-btn"
                                        onClick={() => {
                                            filterCars();
                                        }}
                                    >
                                        Search Now
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CarSearch;
