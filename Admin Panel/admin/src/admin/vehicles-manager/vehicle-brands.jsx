import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Table, Spinner } from 'react-bootstrap';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Swal from 'sweetalert2';
import { fetchBrands } from '../../hooks/useFetchData';
import './VehicleBrands.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const VehicleBrands = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetchBrands().then(response => {
            setBrands(response);
            setIsLoading(false);
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBrands((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddNewButton = () => {
        if (!newBrand.trim().length) return;

        setBrands((prevState) => ({
            ...prevState,
            [Object.keys(prevState).length]: newBrand,
        }));
        setNewBrand("");
    };

    const handleRemoveButton = (key) => {
        const updatedBrands = { ...brands };
        delete updatedBrands[key];
        setBrands(Object.keys(updatedBrands).reduce((acc, curr, idx) => {
            acc[idx] = updatedBrands[curr];
            return acc;
        }, {}));
    };

    const handleSaveChangesSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        setDoc(doc(db, 'vehicle', 'brands'), brands)
            .then(() => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Good job!',
                    text: 'All changes saved!',
                    icon: 'success',
                });
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            });
    };

    return (
        <div className="container">
            <h1>Vehicle Brands Management</h1>
            <Form onSubmit={handleSaveChangesSubmit}>
                <div className="form-container">
                    {isLoading ? (
                        <div className="loading-content">
                            <Spinner animation="border" variant="light" />
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover responsive className="table">
                                <thead>
                                    <tr>
                                        <th>Brand Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(brands).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    name={key}
                                                    value={value}
                                                    onChange={handleInputChange}
                                                    placeholder="Brand..."
                                                />
                                            </td>
                                            <td>
                                               
                                                <DeleteIcon style={{color:'#c53637'}}onClick={() => handleRemoveButton(key)}/>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={newBrand}
                                                onChange={e => setNewBrand(e.target.value)}
                                                placeholder="New Brand Name..."
                                            />
                                        </td>
                                        <td>
                                           

                                            <AddIcon style={{color:'#0b0e10'}}  onClick={handleAddNewButton}/>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Button className="btn-success" type="submit">
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default VehicleBrands;
