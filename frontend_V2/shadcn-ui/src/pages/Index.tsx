import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Building, Shield, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Leaf,
      title: 'Gestion des Parcelles',
      description: 'Créez et gérez vos parcelles avec le GPS Sizer automatique'
    },
    {
      icon: Users,
      title: 'Multi-Acteurs',
      description: 'Planteurs, Coopératives, État et ONG sur une même plateforme'
    },
    {
      icon: Building,
      title: 'Traçabilité',
      description: 'Suivi complet de la récolte à la certification avec QR codes'
    },
    {
      icon: Shield,
      title: 'Surveillance',
      description: 'Détection des zones interdites et monitoring satellite'
    }
  ];

  const demoAccounts = [
    { email: 'planteur@demo.com', role: 'Planteur', password: 'demo123' },
    { email: 'coop@demo.com', role: 'Coopérative', password: 'demo123' },
    { email: 'etat@demo.com', role: 'État/Bailleurs', password: 'demo123' },
    { email: 'ong@demo.com', role: 'ONG/Certification', password: 'demo123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriSentinel</h1>
                <p className="text-sm text-gray-500">Surveillance agricole intelligente</p>
              </div>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Connexion
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Plateforme SaaS de Surveillance Agricole
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gérez vos parcelles, suivez vos récoltes et assurez la traçabilité 
            de vos produits agricoles avec notre solution multi-acteurs.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Commencer maintenant
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/v/demo-lot-123')}>
              Voir la démo publique
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Accounts */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Comptes de Démonstration</CardTitle>
            <CardDescription className="text-center">
              Testez la plateforme avec ces comptes pré-configurés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {demoAccounts.map((account, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-gray-900 mb-2">{account.role}</h4>
                  <p className="text-sm text-gray-600 mb-1">{account.email}</p>
                  <p className="text-sm text-gray-500">Mot de passe: {account.password}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button onClick={() => navigate('/auth')}>
                Tester maintenant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AgriSentinel. Plateforme de surveillance agricole intelligente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}