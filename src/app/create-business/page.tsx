
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createBusiness, updateUser } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateBusinessPage() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateBusiness = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      const newBusiness = await createBusiness({ name, country, ownerId: user.uid });
      await updateUser(user.uid, { businessId: newBusiness.id, tenantId: newBusiness.id });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create business:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Business Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Button onClick={handleCreateBusiness} className="w-full">Create Business</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
