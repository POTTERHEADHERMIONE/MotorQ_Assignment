import React, { useEffect, useRef, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { fetchUsers } from '../../hooks/useFetchData';
import { loadingContent } from '../../components/general/general-components';
import { UserRoles, isAdmin } from '../../config/general';

const UsersManager = () => {
    const user = useSelector(({ UserSlice }) => UserSlice.user);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const refs = useRef([]);

    useEffect(() => {
        fetchUsers().then(response => setUsers(response));
    }, []);

    const handleUpdateButton = async key => {
        let role = refs.current[key].value;

        setIsLoading(true);

        const userRef = doc(db, 'users', users[key].id);

        updateDoc(userRef, { role })
            .then(() => {
                setIsLoading(false);
                Swal.fire({
                    title: 'Good job!',
                    text: 'All changes saved!',
                    icon: 'success',
                    showConfirmButton: true
                }).then(result => {
                    if (result.isConfirmed) window.location.reload();
                });
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!'
                });
            });
    };

    const handleDeleteButton = async key => {
        const userToDelete = users[key];

        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${userToDelete.email}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            setIsLoading(true);

            const userRef = doc(db, 'users', userToDelete.id);

            deleteDoc(userRef)
                .then(() => {
                    setUsers(prevUsers => {
                        const updatedUsers = { ...prevUsers };
                        delete updatedUsers[key];
                        return updatedUsers;
                    });
                    setIsLoading(false);
                    Swal.fire(
                        'Deleted!',
                        'The user has been deleted.',
                        'success'
                    );
                })
                .catch(err => {
                    setIsLoading(false);
                    console.log(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!'
                    });
                });
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h4" gutterBottom>Users Management</Typography>
            {users && !isLoading ? (
                <>
                    <Typography variant="h6" gutterBottom>Edit Users</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(users).map(([key, value]) => {
                                    let isAnAdmin = isAdmin(value.role);
                                    let isCurrentUser = value.email === user.email;
                                    let isDefaultAdmin = value.userUID === '3M9LJ5nz2PTj5I4OtHffMoa2oAD3';
                                    let isDefaultUser = value.userUID === '3fDiITFpHLf4Vgio1VBN0jUZGy52';

                                    return (
                                        <TableRow key={key}>
                                            <TableCell>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    value={value.email}
                                                    disabled
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    id={`role-select-${key}`}
                                                    select
                                                    label="Role"
                                                    defaultValue={value.role}
                                                    inputRef={ref => (refs.current[key] = ref)}
                                                    fullWidth
                                                    SelectProps={{
                                                        disabled: (isAnAdmin && isCurrentUser) || isDefaultAdmin || isDefaultUser
                                                    }}
                                                    helperText="Please select a role"
                                                    InputLabelProps={{ shrink: true }}
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select a role...</em>
                                                    </MenuItem>
                                                    {Object.keys(UserRoles).map(roleKey => (
                                                        <MenuItem key={roleKey} value={roleKey}>
                                                            {UserRoles[roleKey]}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleUpdateButton(key)}
                                                    disabled={(isAnAdmin && isCurrentUser) || isDefaultAdmin || isDefaultUser}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDeleteButton(key)}
                                                    style={{ marginLeft: '8px' }}
                                                    disabled={isCurrentUser || isDefaultAdmin || isDefaultUser}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                loadingContent
            )}
        </div>
    );
};

export default UsersManager;
