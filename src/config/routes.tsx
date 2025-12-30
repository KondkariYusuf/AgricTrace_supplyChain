/**
 * Route Configuration
 * Centralized route definitions for the application
 */

import { lazy } from 'react';
import { ROUTES, USER_ROLES } from '@/constants';

// Lazy load pages for better performance
const Landing = lazy(() => import('@/pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('@/pages/Auth/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('@/pages/Auth/Signup').then(m => ({ default: m.Signup })));
const UnifiedDashboard = lazy(() => import('@/pages/Dashboard/UnifiedDashboard').then(m => ({ default: m.UnifiedDashboard })));
const Marketplace = lazy(() => import('@/pages/Marketplace').then(m => ({ default: m.Marketplace })));
const FarmerMarketplace = lazy(() => import('@/pages/FarmerMarketplace').then(m => ({ default: m.FarmerMarketplace })));
const DistributorMarketplace = lazy(() => import('@/pages/DistributorMarketplace').then(m => ({ default: m.DistributorMarketplace })));
const RetailerMarketplace = lazy(() => import('@/pages/RetailerMarketplace').then(m => ({ default: m.RetailerMarketplace })));
const DistributorInventory = lazy(() => import('@/pages/DistributorInventory').then(m => ({ default: m.DistributorInventory })));
const RetailerInventory = lazy(() => import('@/pages/RetailerInventory').then(m => ({ default: m.RetailerInventory })));
const BatchRegistration = lazy(() => import('@/pages/BatchRegistration').then(m => ({ default: m.BatchRegistration })));
const TrackProducts = lazy(() => import('@/pages/TrackProducts').then(m => ({ default: m.TrackProducts })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const Admin = lazy(() => import('@/pages/Admin').then(m => ({ default: m.Admin })));
const Unauthorized = lazy(() => import('@/pages/Unauthorized').then(m => ({ default: m.Unauthorized })));
const UnifiedVerificationSystem = lazy(() => import('@/components/UnifiedVerificationSystem').then(m => ({ default: m.UnifiedVerificationSystem })));
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  isProtected?: boolean;
  allowedRoles?: string[];
  title?: string;
}

export const routeConfig: RouteConfig[] = [
  // Public Routes
  {
    path: ROUTES.HOME,
    element: Landing,
    title: 'Home',
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
    title: 'Login',
  },
  {
    path: ROUTES.SIGNUP,
    element: Signup,
    title: 'Sign Up',
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: Unauthorized,
    title: 'Unauthorized',
  },
  {
    path: ROUTES.VERIFICATION,
    element: UnifiedVerificationSystem,
    title: 'Verification',
  },
  {
    path: ROUTES.ABOUT,
    element: Index,
    title: 'About',
  },

  // Protected Routes
  {
    path: ROUTES.DASHBOARD,
    element: UnifiedDashboard,
    isProtected: true,
    title: 'Dashboard',
  },
  {
    path: ROUTES.MARKETPLACE,
    element: Marketplace,
    isProtected: true,
    allowedRoles: [USER_ROLES.FARMER, USER_ROLES.DISTRIBUTOR],
    title: 'Marketplace',
  },
  {
    path: ROUTES.RETAILER_MARKETPLACE,
    element: RetailerMarketplace,
    isProtected: true,
    allowedRoles: [USER_ROLES.RETAILER, USER_ROLES.DISTRIBUTOR],
    title: 'Retailer Marketplace',
  },
  {
    path: ROUTES.DISTRIBUTOR_INVENTORY,
    element: DistributorInventory,
    isProtected: true,
    allowedRoles: [USER_ROLES.DISTRIBUTOR],
    title: 'Distributor Inventory',
  },
  {
    path: ROUTES.RETAILER_INVENTORY,
    element: RetailerInventory,
    isProtected: true,
    allowedRoles: [USER_ROLES.RETAILER],
    title: 'Retailer Inventory',
  },
  {
    path: ROUTES.BATCH_REGISTRATION,
    element: BatchRegistration,
    isProtected: true,
    allowedRoles: [USER_ROLES.FARMER],
    title: 'Register Batch',
  },
  {
    path: ROUTES.TRACK,
    element: TrackProducts,
    isProtected: true,
    title: 'Track Products',
  },
  {
    path: ROUTES.PROFILE,
    element: Profile,
    isProtected: true,
    title: 'Profile',
  },
  {
    path: ROUTES.ADMIN,
    element: Admin,
    isProtected: true,
    allowedRoles: [USER_ROLES.ADMIN],
    title: 'Admin Panel',
  },

  // 404 Route
  {
    path: ROUTES.NOT_FOUND,
    element: NotFound,
    title: 'Not Found',
  },
];

