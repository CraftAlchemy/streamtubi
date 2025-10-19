
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

const SubscriptionPage: React.FC = () => {
    const { currentUser, upgradeToPremium } = useApp();
    const navigate = useNavigate();
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = () => {
        setIsUpgrading(true);
        // Simulate API call
        setTimeout(() => {
            upgradeToPremium();
            setIsUpgrading(false);
            navigate('/');
        }, 1000);
    };

    if (currentUser?.subscriptionPlan === 'Premium') {
        return (
            <div className="container mx-auto text-center py-20 px-4">
                <h1 className="text-3xl font-bold mb-4">You are already a Premium member!</h1>
                <p className="text-muted-foreground">Enjoy ad-free streaming across all of StreamTubi.</p>
                 <Button onClick={() => navigate('/')} className="mt-6">Back to Home</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4 flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Go Premium</CardTitle>
                    <CardDescription>Upgrade your experience and watch ad-free.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 mr-3"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" /></svg>
                            <span>Watch everything without ads</span>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 mr-3"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" /></svg>
                            <span>Access to our full library</span>
                        </div>
                         <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 mr-3"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" /></svg>
                            <span>Support the creators</span>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-4xl font-bold">$9.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full bg-brand-red hover:bg-red-700" 
                        size="lg"
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                    >
                        {isUpgrading ? 'Upgrading...' : 'Upgrade Now'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SubscriptionPage;
