import React from 'react';
import {Link} from "react-router-dom";
import AdminHeader from './admin-header';

import AdminLayout from './admin-layout';
const Admin = () => {
    return (
        <div>
            <h1>Admin Management</h1>
            <div className="p-4">
               
              
              
                <AdminLayout/>

            </div>
        </div>
    );
};

export default Admin;