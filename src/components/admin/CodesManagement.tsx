
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  Trash2, 
  RefreshCcw,
  Loader2, 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AccessCode {
  id: string;
  code: string;
  created_at: string;
  created_by: string;
  used: boolean;
  used_at: string | null;
  assigned_to: string | null;
  batch_name: string | null;
}

const CodesManagement = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [batchName, setBatchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creatingCode, setCreatingCode] = useState(false);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [activeTab, setActiveTab] = useState('valid');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, [activeTab]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const isValid = activeTab === 'valid';
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('used', !isValid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCodes(data || []);
    } catch (error: any) {
      console.error('Error fetching access codes:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch access codes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCode = async () => {
    if (!newCode || newCode.trim().length !== 8) {
      toast({
        title: "Invalid Code Format",
        description: "Please enter an 8-digit code.",
        variant: "destructive"
      });
      return;
    }

    setCreatingCode(true);
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .insert({
          code: newCode.trim(),
          created_by: user?.id,
          batch_name: batchName.trim() || null
        })
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error("This code already exists.");
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Access code created successfully."
      });
      
      setNewCode('');
      fetchCodes();
    } catch (error: any) {
      console.error('Error creating access code:', error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to create access code.",
        variant: "destructive"
      });
    } finally {
      setCreatingCode(false);
    }
  };

  const deleteCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCodes(codes.filter(code => code.id !== id));
      toast({
        title: "Success",
        description: "Access code deleted successfully."
      });
    } catch (error: any) {
      console.error('Error deleting access code:', error.message);
      toast({
        title: "Error",
        description: "Failed to delete access code.",
        variant: "destructive"
      });
    }
  };

  const generateRandomCodes = async () => {
    setGeneratingCodes(true);
    try {
      // Generate 5 random 8-digit codes
      const newCodes = Array.from({ length: 5 }, () => 
        Math.floor(10000000 + Math.random() * 90000000).toString()
      );
      
      const newBatch = `Batch ${new Date().toISOString().slice(0, 10)}`;
      
      const codesForInsert = newCodes.map(code => ({
        code,
        created_by: user?.id,
        batch_name: newBatch
      }));

      const { data, error } = await supabase
        .from('access_codes')
        .insert(codesForInsert)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${newCodes.length} access codes generated successfully.`
      });
      
      fetchCodes();
    } catch (error: any) {
      console.error('Error generating random codes:', error.message);
      toast({
        title: "Error",
        description: "Failed to generate random access codes.",
        variant: "destructive"
      });
    } finally {
      setGeneratingCodes(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Access Code</CardTitle>
          <CardDescription>
            Create a single access code or generate random codes for batch distribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="newCode" className="text-sm font-medium">New Code (8 digits)</label>
              <Input
                id="newCode"
                placeholder="Enter 8-digit code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                maxLength={8}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="batchName" className="text-sm font-medium">Batch Name (optional)</label>
              <Input
                id="batchName"
                placeholder="Enter batch name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={createCode}
            disabled={creatingCode || !newCode}
            className="bg-inuka-crimson hover:bg-inuka-crimson/90"
          >
            {creatingCode ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Code
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={generateRandomCodes}
            disabled={generatingCodes}
          >
            {generatingCodes ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Generate 5 Random Codes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="valid" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valid">Valid Codes</TabsTrigger>
          <TabsTrigger value="used">Used Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="valid" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Valid Access Codes</CardTitle>
              <CardDescription>
                List of all unused access codes that can be distributed to users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodesTable 
                codes={codes} 
                loading={loading} 
                onDelete={deleteCode} 
                showDelete={true}
                emptyMessage="No valid access codes found. Create some codes above."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="used" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Used Access Codes</CardTitle>
              <CardDescription>
                List of access codes that have been used by users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodesTable 
                codes={codes} 
                loading={loading} 
                onDelete={() => {}} 
                showDelete={false} 
                emptyMessage="No used access codes found."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CodesTableProps {
  codes: AccessCode[];
  loading: boolean;
  onDelete: (id: string) => void;
  showDelete: boolean;
  emptyMessage: string;
}

const CodesTable = ({ codes, loading, onDelete, showDelete, emptyMessage }: CodesTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-inuka-crimson" />
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Table>
      <TableCaption>List of access codes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Batch Name</TableHead>
          <TableHead>Created At</TableHead>
          {!showDelete && <TableHead>Used At</TableHead>}
          {!showDelete && <TableHead>Used By</TableHead>}
          <TableHead>Status</TableHead>
          {showDelete && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell className="font-mono font-medium">{code.code}</TableCell>
            <TableCell>
              {code.batch_name ? (
                <Badge variant="outline">{code.batch_name}</Badge>
              ) : (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </TableCell>
            <TableCell>{formatDate(code.created_at)}</TableCell>
            {!showDelete && <TableCell>{formatDate(code.used_at)}</TableCell>}
            {!showDelete && (
              <TableCell>{code.assigned_to ? code.assigned_to.substring(0, 8) + '...' : 'N/A'}</TableCell>
            )}
            <TableCell>
              {code.used ? (
                <Badge className="bg-gray-500">Used</Badge>
              ) : (
                <Badge className="bg-green-500">Valid</Badge>
              )}
            </TableCell>
            {showDelete && (
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(code.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CodesManagement;
