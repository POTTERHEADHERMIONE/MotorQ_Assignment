import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Swal from 'sweetalert2';
import { fetchBrands, fetchModels } from '../../hooks/useFetchData';
import { loadingContent } from '../../components/general/general-components';
import './VehicleBrands.scss';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const VehicleModels = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [brands, setBrands] = useState(null);
    const [models, setModels] = useState(null);
    const [newModelBrandId, setNewModelBrandId] = useState("");
    const [newModel, setNewModel] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandsResponse = await fetchBrands();
                const modelsResponse = await fetchModels();
                setBrands(brandsResponse);
                setModels(modelsResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (event, brandKey, modelKey) => {
        const { name, value } = event.target;
        setModels(current => ({
            ...current,
            [brandKey]: {
                ...current[brandKey],
                models: {
                    ...current[brandKey].models,
                    [modelKey]: value
                }
            }
        }));
    };

    const handleAddNewButton = () => {
        if (newModelBrandId === "" || !newModel.trim().length) return;

        setModels(current => ({
            ...current,
            [newModelBrandId]: {
                ...current[newModelBrandId],
                models: {
                    ...current[newModelBrandId]?.models,
                    [Object.keys(current[newModelBrandId]?.models || {}).length]: newModel
                }
            }
        }));

        setNewModel("");
        setNewModelBrandId("");
    };

    const handleRemoveButton = (brandKey, modelKey) => {
        setModels(current => {
            const brandModels = { ...current[brandKey]?.models };
            delete brandModels[modelKey];

            return {
                ...current,
                [brandKey]: {
                    ...current[brandKey],
                    models: brandModels
                }
            };
        });
    };

    const handleSaveChangesSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await setDoc(doc(db, "vehicle", "models"), models);
            setIsLoading(false);
            Swal.fire({
                title: "Good job!",
                text: "All changes saved!",
                icon: "success"
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
            });
        }
    };

    return (
        <div className="container">
            <h1>Vehicle Models Management</h1>
            <Form onSubmit={handleSaveChangesSubmit}>
                <div className="form-container">
                    {isLoading ? (
                        <div className="loading-content">{loadingContent}</div>
                    ) : (
                        <>
                            {models && brands ? (
                                <>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Brand Name</th>
                                                <th>Model Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(models).map(([brandKey, brandValue]) => (
                                                <React.Fragment key={brandKey}>
                                                    {Object.entries(brandValue.models || {}).map(([modelKey, modelValue]) => (
                                                        <tr key={modelKey}>
                                                            {modelKey === '0' && (
                                                                <td rowSpan={Object.keys(brandValue.models || {}).length}>
                                                                    {brands[brandKey]}
                                                                </td>
                                                            )}
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    name={modelKey}
                                                                    value={modelValue}
                                                                    onChange={event => handleInputChange(event, brandKey, modelKey)}
                                                                    placeholder="Model..."
                                                                />
                                                            </td>
                                                            <td>
                                                                

                                                                <DeleteIcon style={{color:'#c53637'}} onClick={() => handleRemoveButton(brandKey, modelKey)} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                            <tr>
                                                <td>
                                                    <Form.Select
                                                        defaultValue=""
                                                        value={newModelBrandId}
                                                        onChange={e => setNewModelBrandId(e.target.value ? e.target.value : "")}
                                                    >
                                                        <option value="">Select a brand...</option>
                                                        {brands && Object.entries(brands)
                                                            .map(([key, value]) => (
                                                                <option key={key} value={key}>{value}</option>
                                                            ))}
                                                    </Form.Select>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={newModel}
                                                        onChange={e => setNewModel(e.target.value)}
                                                        placeholder="New Model Name..."
                                                    />
                                                </td>
                                                <td>
                                                   
                                                    <AddIcon style={{color:'#0b0e10'}} onClick={handleAddNewButton}/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Button className="btn-success" type="submit">
                                        Save All Changes
                                    </Button>
                                </>
                            ) : (
                                loadingContent
                            )}
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default VehicleModels;
