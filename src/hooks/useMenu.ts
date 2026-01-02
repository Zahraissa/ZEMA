import { useState, useEffect } from 'react';
import { menuService, NavigationItem } from '../services/menuService';

interface UseMenuReturn {
  navigationItems: NavigationItem[];
  loading: boolean;
  error: string | null;
  refreshMenu: () => void;
  forceRefresh: () => Promise<void>;
}

export const useMenu = (): UseMenuReturn => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const menuData = await menuService.getMenuStructure();
      setNavigationItems(menuData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMenu = () => {
    menuService.clearCache();
    fetchMenu();
  };

  const forceRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const menuData = await menuService.refreshMenu();
      setNavigationItems(menuData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh menu');
      console.error('Error refreshing menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return {
    navigationItems,
    loading,
    error,
    refreshMenu,
    forceRefresh
  };
};


