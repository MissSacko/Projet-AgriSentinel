import { useEffect } from 'react';
import { useAuth } from '@/App';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Award,
  FileCheck,
  TrendingUp,
  Calendar
} from 'lucide-react';

const certifications = [
  {
    id: 1,
    name: 'RSPO (Roundtable on Sustainable Palm Oil)',
    status: 'Conforme',
    progress: 95,
    lastAudit: '2024-01-10',
    nextAudit: '2024-07-10',
    validUntil: '2025-01-10',
    description: 'Certification pour l\'huile de palme durable'
  },
  {
    id: 2,
    name: 'Réglementation UE Anti-Déforestation',
    status: 'Conforme',
    progress: 88,
    lastAudit: '2024-01-15',
    nextAudit: '2024-04-15',
    validUntil: '2024-12-31',
    description: 'Conformité aux nouvelles réglementations européennes'
  },
  {
    id: 3,
    name: 'FSC (Forest Stewardship Council)',
    status: 'En cours',
    progress: 72,
    lastAudit: '2023-12-20',
    nextAudit: '2024-02-20',
    validUntil: '2024-12-20',
    description: 'Gestion forestière responsable'
  },
  {
    id: 4,
    name: 'Rainforest Alliance',
    status: 'À renouveler',
    progress: 45,
    lastAudit: '2023-11-15',
    nextAudit: '2024-02-01',
    validUntil: '2024-02-15',
    description: 'Conservation de la biodiversité et moyens de subsistance durables'
  }
];

const auditHistory = [
  {
    id: 1,
    certification: 'RSPO',
    date: '2024-01-10',
    result: 'Conforme',
    score: 95,
    auditor: 'Bureau Veritas'
  },
  {
    id: 2,
    certification: 'UE Anti-Déforestation',
    date: '2024-01-15',
    result: 'Conforme',
    score: 88,
    auditor: 'SGS'
  },
  {
    id: 3,
    certification: 'FSC',
    date: '2023-12-20',
    result: 'En cours',
    score: 72,
    auditor: 'TÜV SÜD'
  }
];

export default function Certifications() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Conforme':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Conforme</Badge>;
      case 'En cours':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case 'À renouveler':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">À renouveler</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Conforme':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'En cours':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'À renouveler':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Certifications" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Suivi des certifications</h2>
            <p className="text-gray-600">Gérez vos audits et maintenez votre conformité réglementaire</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certifications actives</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conformes</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">À renouveler</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {certifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(cert.status)}
                      <div>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conformité</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Dernier audit</p>
                      <p className="font-medium">{new Date(cert.lastAudit).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Prochain audit</p>
                      <p className="font-medium">{new Date(cert.nextAudit).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Valide jusqu'au</p>
                      <p className="font-medium">{new Date(cert.validUntil).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Audit History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Historique des audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditHistory.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{audit.certification}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(audit.date).toLocaleDateString('fr-FR')} • {audit.auditor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{audit.score}%</p>
                        <p className="text-sm text-gray-600">Score</p>
                      </div>
                      {getStatusBadge(audit.result)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nouvel audit</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Programmer un audit de certification
                </p>
                <Button variant="outline" className="w-full">
                  Planifier
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nouvelle certification</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ajouter une certification à suivre
                </p>
                <Button variant="outline" className="w-full">
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Rapport global</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Générer un rapport de conformité
                </p>
                <Button variant="outline" className="w-full">
                  Générer
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}