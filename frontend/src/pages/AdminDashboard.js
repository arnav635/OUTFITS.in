import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
    
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('new_order', (order) => {
      toast.success(`New order received! Order #${order.id.slice(0, 8)}`);
      setOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const ordersData = response.data;
      setOrders(ordersData);
      
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = ordersData.filter((order) => order.status === 'pending').length;
      
      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div data-testid="admin-dashboard" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-12">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-primary" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
            <p className="text-3xl font-serif font-semibold">{stats.totalOrders}</p>
          </div>

          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-3xl font-serif font-semibold">${stats.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary" />
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Pending Orders</p>
            <p className="text-3xl font-serif font-semibold">{stats.pendingOrders}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-medium mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                data-testid={`admin-order-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm mt-2">User: {order.user_id.slice(0, 8)}</p>
                    <p className="text-sm">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold mb-2">${order.total_amount.toFixed(2)}</p>
                    <span
                      className={`inline-block px-3 py-1 text-xs uppercase tracking-wider ${
                        order.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : order.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;