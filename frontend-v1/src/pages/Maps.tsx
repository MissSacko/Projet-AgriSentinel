import { useEffect, useState } from 'react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  Satellite, 
  MapPin, 
  Leaf,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Maps() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeLayers, setActiveLayers] = useState({
    parcelles: true,
    ndvi: true,
    deforestation: false,
    alerts: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const layers = [
    {
      key: 'parcelles' as keyof typeof activeLayers,
      name: 'Parcelles agricoles',
      icon: MapPin,
      color: 'text-blue-600',
      description: 'Délimitation des zones cultivées'
    },
    {
      key: 'ndvi' as keyof typeof activeLayers,
      name: 'Indice NDVI',
      icon: Leaf,
      color: 'text-green-600',
      description: 'Santé de la végétation'
    },
    {
      key: 'deforestation' as keyof typeof activeLayers,
      name: 'Zones de déforestation',
      icon: AlertTriangle,
      color: 'text-red-600',
      description: 'Changements de couverture forestière'
    },
    {
      key: 'alerts' as keyof typeof activeLayers,
      name: 'Alertes',
      icon: AlertTriangle,
      color: 'text-orange-600',
      description: 'Notifications en temps réel'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Cartes" />
        
        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Layer Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="mr-2 h-5 w-5" />
                    Couches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {layers.map((layer) => {
                    const Icon = layer.icon;
                    const isActive = activeLayers[layer.key];
                    
                    return (
                      <div key={layer.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4 w-4 ${layer.color}`} />
                          <div>
                            <p className="text-sm font-medium">{layer.name}</p>
                            <p className="text-xs text-gray-500">{layer.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLayer(layer.key)}
                          className={isActive ? 'text-green-600' : 'text-gray-400'}
                        >
                          {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Map Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Parcelles visibles</span>
                    <span className="text-sm font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Surface totale</span>
                    <span className="text-sm font-medium">2,847 ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">NDVI moyen</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      0.88
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alertes actives</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      3
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Satellite className="mr-2 h-4 w-4" />
                    Nouvelle analyse
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Ajouter une parcelle
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Créer une alerte
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Satellite className="mr-2 h-5 w-5" />
                      Carte interactive
                    </CardTitle>
                    <Tabs defaultValue="satellite" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="satellite">Satellite</TabsTrigger>
                        <TabsTrigger value="terrain">Terrain</TabsTrigger>
                        <TabsTrigger value="hybrid">Hybride</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="h-full pb-6">
                  <div className="h-full bg-gradient-to-br from-green-100 via-blue-100 to-green-200 rounded-lg relative overflow-hidden">
                    {/* Map Placeholder avec simulation de données */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Satellite className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Carte interactive Leaflet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Intégration complète avec imagerie satellite
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span>Parcelles</span>
                            </div>
                            <div className="text-xs text-gray-600">247 zones</div>
                          </div>
                          <div className="bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span>NDVI</span>
                            </div>
                            <div className="text-xs text-gray-600">0.88 moyen</div>
                          </div>
                          <div className="bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              <span>Déforestation</span>
                            </div>
                            <div className="text-xs text-gray-600">2 zones</div>
                          </div>
                          <div className="bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                              <span>Alertes</span>
                            </div>
                            <div className="text-xs text-gray-600">3 actives</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated map elements */}
                    <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-sm">
                      <div className="text-xs font-medium">Coordonnées</div>
                      <div className="text-xs text-gray-600">48.8566° N, 2.3522° E</div>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg shadow-sm">
                      <div className="text-xs font-medium">Zoom: 12</div>
                      <div className="text-xs text-gray-600">Échelle: 1:50,000</div>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg shadow-sm">
                      <div className="text-xs font-medium">Dernière mise à jour</div>
                      <div className="text-xs text-gray-600">Il y a 2 heures</div>
                    </div>

                    {/* Simulated parcels */}
                    {activeLayers.parcelles && (
                      <>
                        <div className="absolute top-1/3 left-1/3 w-16 h-12 border-2 border-blue-500 bg-blue-200/50 rounded"></div>
                        <div className="absolute top-1/2 right-1/3 w-20 h-16 border-2 border-blue-500 bg-blue-200/50 rounded"></div>
                        <div className="absolute bottom-1/3 left-1/2 w-14 h-10 border-2 border-blue-500 bg-blue-200/50 rounded"></div>
                      </>
                    )}

                    {/* Simulated NDVI overlay */}
                    {activeLayers.ndvi && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 to-yellow-300/30 pointer-events-none"></div>
                    )}

                    {/* Simulated alerts */}
                    {activeLayers.alerts && (
                      <>
                        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}