import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Satellite, 
  Shield, 
  TrendingUp, 
  Leaf, 
  MapPin, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Users, 
  Building
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Satellite,
      title: "Surveillance",
      description: "Détection des zones interdites et monitoring satellite"
    },
    {
      icon: Users,
      title: "Multi-Acteurs",
      description: "Planteurs, Coopératives, État et ONG sur une même plateforme"
    },
    {
      icon: TrendingUp,
      title: "Traçabilité",
      description: "Suivi complet de la récolte à la certification avec QR codes"
    },
    {
      icon: Leaf,
      title: "Gestion des Parcelles",
      description: "Créez et gérez vos parcelles avec le GPS Sizer automatique"
    }
  ];

  const benefits = [
    "Réduction de 40% des coûts de surveillance",
    "Conformité garantie aux réglementations européennes",
    "Détection précoce des risques de déforestation",
    "Traçabilité complète de la chaîne d'approvisionnement"
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice Agricole, BioFarm",
      content: "AgroSentinel nous a permis d'optimiser notre surveillance et de garantir notre conformité réglementaire.",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Responsable RSE, AgroTech",
      content: "Une solution révolutionnaire pour la traçabilité agricole. Interface intuitive et données précises.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-bold agro-green">AgriSentinel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Connexion
              </Button>
              <Button className="bg-agro-green hover-agro-green" onClick={() => navigate('/auth')}>
                Essayer gratuitement
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            🌱 Nouvelle génération de surveillance agricole
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AgroSentinel
            <span className="block agro-gradient bg-clip-text text-transparent">
              La traçabilité agricole par satellite
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Surveillez, analysez et certifiez vos pratiques agricoles grâce à l'intelligence artificielle 
            et l'imagerie satellite haute résolution. Garantissez la conformité réglementaire et optimisez vos rendements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-agro-green hover-agro-green" onClick={() => navigate('/auth')}>
              Essayer la démo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-agro-green text-agro-green">
              Demander un devis
            </Button>
          </div>
        </div>
      </section>

      {/* Problématique */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Les défis de l'agriculture moderne</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Face aux enjeux environnementaux et réglementaires, les agriculteurs ont besoin d'outils innovants
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-50 bg-amber-50  hover:shadow-lg transition-shadow ">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Déforestation</h3>
                <p className="text-red-700">Surveillance difficile des zones étendues et détection tardive</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Conformité UE</h3>
                <p className="text-orange-700">Nouvelles réglementations anti-déforestation complexes</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Traçabilité</h3>
                <p className="text-yellow-700">Manque de visibilité sur la chaîne d'approvisionnement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une plateforme SaaS complète combinant imagerie satellite, IA et cartographie interactive
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-green-200 hover:shadow-lg bg-white transition-shadow rounded-lg ">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12  rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Avantages concrets</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button className="mt-8 bg-agro-green hover-agro-green" onClick={() => navigate('/auth')}>
                Découvrir la plateforme
              </Button>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold agro-green">40%</div>
                  <div className="text-sm text-gray-600">Réduction des coûts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold agro-blue">99.9%</div>
                  <div className="text-sm text-gray-600">Précision satellite</div>
                </div>
                <div>
                  <div className="text-3xl font-bold agro-green">24/7</div>
                  <div className="text-sm text-gray-600">Surveillance continue</div>
                </div>
                <div>
                  <div className="text-3xl font-bold agro-blue">100%</div>
                  <div className="text-sm text-gray-600">Conformité garantie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 agro-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à révolutionner votre agriculture ?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Rejoignez les centaines d'agriculteurs qui font déjà confiance à AgroSentinel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100" onClick={() => navigate('/auth')}>
              Commencer maintenant
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
              Planifier une démo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AgroSentinel</span>
              </div>
              <p className="text-gray-400">
                La surveillance agricole par satellite nouvelle génération
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Fonctionnalités</li>
                <li>Tarifs</li>
                <li>API</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li>À propos</li>
                <li>Blog</li>
                <li>Carrières</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Communauté</li>
                <li>Statut</li>
                <li>Sécurité</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgroSentinel. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}