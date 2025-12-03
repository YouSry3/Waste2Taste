import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Shield, Store, Heart, Lock, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { authService } from '@/services/auth/authService';

interface LoginPageProps {
  onLogin: (panelType: 'admin' | 'vendor' | 'charity') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedPanel, setSelectedPanel] = useState<'admin' | 'vendor' | 'charity'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useDemo, setUseDemo] = useState(true); // Toggle for demo mode

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (useDemo) {
        // DEMO MODE: Simulate login without backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Store mock user data
        localStorage.setItem('user', JSON.stringify({
          id: 'demo-user-' + Date.now(),
          email: email || 'demo@example.com',
          name: 'Demo User',
          panelType: selectedPanel,
          roles: [selectedPanel],
        }));
        localStorage.setItem('panelType', selectedPanel);
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        onLogin(selectedPanel);
      } else {
        // PRODUCTION MODE: Use real API
        if (!email || !password) {
          throw new Error('Please enter email and password');
        }

        const response = await authService.login({ email, password }, selectedPanel);
        
        if (response.user.panelType !== selectedPanel) {
          throw new Error('Account does not have access to the selected panel');
        }
        
        onLogin(selectedPanel);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const panelOptions = [
    {
      value: 'admin',
      label: 'Moderation Panel',
      description: 'Platform management and oversight',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'vendor',
      label: 'Corporate Panel',
      description: 'Vendor and branch management',
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'charity',
      label: 'Charity Panel',
      description: 'NGO user verification and listings',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-green-600 items-center justify-center mb-4">
            <Store className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2">Food Rescue Platform</h1>
          <p className="text-gray-600">Sign in to access your panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Demo Mode</p>
              <p className="text-xs text-gray-500">Currently: {useDemo ? 'Enabled (no backend required)' : 'Disabled (backend required)'}</p>
            </div>
            <Button
              type="button"
              variant={useDemo ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUseDemo(!useDemo)}
            >
              {useDemo ? 'Switch to API' : 'Switch to Demo'}
            </Button>
          </div>

          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Panel Selection */}
          <div>
            <Label className="mb-3 block">Select Panel Type</Label>
            <RadioGroup value={selectedPanel} onValueChange={(value) => setSelectedPanel(value as any)}>
              <div className="space-y-3">
                {panelOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        selectedPanel === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPanel(option.value as any)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${option.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Info Note */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Demo Mode: Enter any credentials to access the selected panel
          </p>
        </form>
      </Card>
    </div>
  );
}
