# AgroSentinel - Plan de développement MVP

## Objectif
Créer le frontend complet d'une plateforme SaaS de surveillance agricole par satellite avec landing page et authentification.

## Charte graphique
- Couleurs: vert (#2E7D32), bleu (#1565C0), blanc, gris clair
- Style: professionnel, orienté environnement et data
- Icônes: lucide-react

## Fichiers à créer/modifier

### 1. Configuration et styles
- `src/index.css` - Mise à jour des couleurs personnalisées
- `index.html` - Titre et meta pour AgroSentinel

### 2. Pages principales
- `src/pages/Index.tsx` - Landing page complète
- `src/pages/Auth.tsx` - Page d'authentification (login/signup)
- `src/pages/Dashboard.tsx` - Dashboard principal après connexion
- `src/pages/Maps.tsx` - Page cartes avec Leaflet
- `src/pages/Reports.tsx` - Page rapports
- `src/pages/Certifications.tsx` - Page certifications
- `src/pages/Settings.tsx` - Page paramètres

### 3. Composants réutilisables
- `src/components/Sidebar.tsx` - Navigation latérale
- `src/components/Header.tsx` - Header avec avatar et notifications

## Dépendances à ajouter
- leaflet + react-leaflet (cartes)
- recharts (graphiques)
- lucide-react (icônes)

## Fonctionnalités MVP
1. Landing page avec hero, sections marketing, CTA
2. Authentification simulée (mock)
3. Dashboard avec stats et carte placeholder
4. Navigation entre toutes les pages
5. Design responsive et professionnel