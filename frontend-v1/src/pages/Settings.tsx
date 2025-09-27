import { useEffect, useState } from 'react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Settings() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    alerts: true,
    reports: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const plans = [
    {
      name: 'Free',
      price: '0€',
      period: '/mois',
      features: [
        '100 hectares surveillés',
        '1 rapport par mois',
        'Support par email',
        'Données de base'
      ],
      current: true
    },
    {
      name: 'Pro',
      price: '99€',
      period: '/mois',
      features: [
        '1,000 hectares surveillés',
        'Rapports illimités',
        'Support prioritaire',
        'Analyses avancées',
        'API access'
      ],
      current: false
    },
    {
      name: 'Entreprise',
      price: 'Sur mesure',
      period: '',
      features: [
        'Hectares illimités',
        'Rapports personnalisés',
        'Support dédié',
        'Intégrations custom',
        'SLA garanti'
      ],
      current: false
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Paramètres" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="billing">Facturation</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" defaultValue="Jean" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" defaultValue="Dupont" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="email" type="email" defaultValue={user?.email} className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="phone" type="tel" placeholder="+33 1 23 45 67 89" className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea id="address" placeholder="Votre adresse complète" className="pl-10" />
                      </div>
                    </div>

                    <Button className="bg-agro-green hover-agro-green">
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      Informations de l'organisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Nom de l'organisation</Label>
                      <Input id="orgName" defaultValue={user?.organization} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Secteur d'activité</Label>
                        <Input id="industry" placeholder="Agriculture, Agroalimentaire..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Taille de l'entreprise</Label>
                        <Input id="size" placeholder="1-10, 11-50, 51-200..." />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Site web</Label>
                      <Input id="website" type="url" placeholder="https://www.exemple.com" />
                    </div>

                    <Button className="bg-agro-green hover-agro-green">
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      Préférences de notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications par email</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications push</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications dans le navigateur</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertes de surveillance</Label>
                        <p className="text-sm text-gray-600">Notifications pour les alertes de déforestation et anomalies</p>
                      </div>
                      <Switch 
                        checked={notifications.alerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, alerts: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Rapports automatiques</Label>
                        <p className="text-sm text-gray-600">Recevoir les rapports générés automatiquement</p>
                      </div>
                      <Switch 
                        checked={notifications.reports}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                      />
                    </div>

                    <Button className="bg-agro-green hover-agro-green">
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder les préférences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Sécurité du compte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" placeholder="••••••••" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </div>

                    <Button className="bg-agro-green hover-agro-green">
                      Changer le mot de passe
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sessions actives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Session actuelle</p>
                          <p className="text-sm text-gray-600">Chrome sur Windows • Paris, France</p>
                          <p className="text-xs text-gray-500">Dernière activité: maintenant</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actuelle</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Session mobile</p>
                          <p className="text-sm text-gray-600">Safari sur iPhone • Paris, France</p>
                          <p className="text-xs text-gray-500">Dernière activité: il y a 2 heures</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Déconnecter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Plan actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold">Plan Free</h3>
                        <p className="text-gray-600">100 hectares surveillés • 1 rapport par mois</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actuel</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plans disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {plans.map((plan, index) => (
                        <div 
                          key={index}
                          className={`border rounded-lg p-6 ${plan.current ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                        >
                          <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              <span className="text-gray-600">{plan.period}</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600 mb-6">
                              {plan.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className={`w-full ${plan.current ? 'bg-gray-400 cursor-not-allowed' : 'bg-agro-green hover-agro-green'}`}
                              disabled={plan.current}
                            >
                              {plan.current ? 'Plan actuel' : 'Choisir ce plan'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique de facturation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Plan Free</p>
                          <p className="text-sm text-gray-600">01/01/2024 - 31/01/2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">0,00 €</p>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Gratuit</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}