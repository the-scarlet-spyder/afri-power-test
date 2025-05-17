
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Access Code Management</CardTitle>
          <CardDescription>
            Generate and manage access codes for the Strength Discovery Test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Create new access codes, track usage, and export code lists.
          </p>
          <Button 
            onClick={() => navigate('/admin/codes')}
            className="bg-inuka-crimson hover:bg-inuka-crimson/90"
          >
            Manage Access Codes
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage user accounts and test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            This feature will be available in a future update.
          </p>
          <Button disabled variant="outline">
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
