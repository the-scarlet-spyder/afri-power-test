
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { generateAccessCodes, getAllAccessCodes, checkIsAdmin } from '@/lib/access-code-service';
import { Loader2, Check, X, Copy, Download } from 'lucide-react';
import Papa from 'papaparse';

interface AccessCode {
  id: string;
  code: string;
  used: boolean;
  batch_name: string | null;
  assigned_to: { email: string } | null;
  used_at: string | null;
  created_at: string;
}

const CodesManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<AccessCode[]>([]);
  const [filter, setFilter] = useState('all');
  const [codeCount, setCodeCount] = useState(10);
  const [batchName, setBatchName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is admin and redirect if not
    const checkAdmin = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }
      
      try {
        const admin = await checkIsAdmin(user.id);
        setIsAdmin(admin);
        
        if (!admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate('/');
        } else {
          // Load codes if admin
          loadCodes();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [user, navigate]);

  // Load all access codes
  const loadCodes = async () => {
    setIsLoading(true);
    try {
      const allCodes = await getAllAccessCodes();
      setCodes(allCodes);
      filterCodes(allCodes, filter);
    } catch (error) {
      console.error("Error loading access codes:", error);
      toast({
        title: "Error",
        description: "Failed to load access codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter codes based on selected filter
  const filterCodes = (allCodes: AccessCode[], filterValue: string) => {
    let filtered;
    switch (filterValue) {
      case 'used':
        filtered = allCodes.filter(code => code.used);
        break;
      case 'unused':
        filtered = allCodes.filter(code => !code.used);
        break;
      default:
        filtered = allCodes;
    }
    
    // Apply search if there is a search query
    if (searchQuery) {
      filtered = filtered.filter(code => 
        code.code.includes(searchQuery) || 
        code.batch_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredCodes(filtered);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
    filterCodes(codes, value);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCodes(codes, filter);
  };

  // Generate new access codes
  const handleGenerateCodes = async () => {
    if (!user?.id) return;
    
    if (codeCount <= 0 || codeCount > 100) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      await generateAccessCodes(codeCount, batchName || null, user.id);
      toast({
        title: "Success",
        description: `Generated ${codeCount} new access codes${batchName ? ` for batch ${batchName}` : ''}`,
      });
      // Reload codes after generating
      await loadCodes();
    } catch (error) {
      console.error("Error generating codes:", error);
      toast({
        title: "Error",
        description: "Failed to generate access codes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: `Code ${code} copied to clipboard`,
    });
  };

  // Export codes as CSV
  const exportCodes = () => {
    const dataToExport = filteredCodes.map(code => ({
      Code: code.code,
      Status: code.used ? 'Used' : 'Unused',
      'Assigned To': code.assigned_to?.email || '',
      'Used At': code.used_at ? new Date(code.used_at).toLocaleString() : '',
      'Batch Name': code.batch_name || '',
      'Created At': new Date(code.created_at).toLocaleString()
    }));
    
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `access-codes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-inuka-crimson" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-xl font-bold mb-2">Access Denied</h1>
        <p>You don't have permission to access this page</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-inuka-crimson">Access Code Management</h1>
      
      <Tabs defaultValue="codes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="codes">Access Codes</TabsTrigger>
          <TabsTrigger value="generate">Generate Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="codes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Codes</CardTitle>
              <CardDescription>
                Manage and monitor all access codes
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code or batch name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Codes</SelectItem>
                      <SelectItem value="used">Used Codes</SelectItem>
                      <SelectItem value="unused">Unused Codes</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={exportCodes}
                    className="whitespace-nowrap"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Used At</TableHead>
                      <TableHead>Batch Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCodes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                          No access codes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono">{code.code}</TableCell>
                          <TableCell>
                            {code.used ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <X className="h-3 w-3 mr-1" /> Used
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" /> Available
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {code.assigned_to?.email || '-'}
                          </TableCell>
                          <TableCell>
                            {code.used_at ? new Date(code.used_at).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            {code.batch_name || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code.code)}
                              disabled={code.used}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredCodes.length} of {codes.length} codes
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Access Codes</CardTitle>
              <CardDescription>
                Create new access codes for users
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Number of Codes
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={codeCount}
                  onChange={(e) => setCodeCount(parseInt(e.target.value) || 0)}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generate between 1 and 100 codes at once
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">
                  Batch Name (Optional)
                </label>
                <Input
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g., UNILAG BATCH 1"
                  className="max-w-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a label to help identify this group of codes
                </p>
              </div>
              
              <Button
                onClick={handleGenerateCodes}
                disabled={isGenerating || codeCount <= 0 || codeCount > 100}
                className="bg-inuka-crimson hover:bg-inuka-crimson/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${codeCount} Codes`
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodesManagement;
