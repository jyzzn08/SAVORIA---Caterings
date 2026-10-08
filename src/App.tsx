import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WelcomePage } from './components/landing/WelcomePage';
import { ProductCatalog } from './components/products/ProductCatalog';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { LoginPage } from './components/auth/LoginPage';
import { CustomerHome } from './components/customer/CustomerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CustomerOrdersPage } from './components/orders/CustomerOrdersPage';
import { NotificationPopover } from './components/notifications/NotificationPopover';
import { CheckoutModal } from './components/checkout/CheckoutModal';

import {
  ActiveView,
  Product,
  CartItem,
  CustomerOrder,
  NotificationItem,
  UserProfile,
  OrderStatus,
  BahanBaku,
  Resep,
  UserAccount,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BAHAN_BAKU,
  INITIAL_RESEP,
  INITIAL_USERS,
} from './data/mockData';
import { sendDataToGoogleSheets } from './utils/googleSheetsSync';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<ActiveView>('welcome');
  
  // Data State with Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('savoria_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('savoria_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>(() => {
    try {
      const saved = localStorage.getItem('savoria_bahan_baku');
      return saved ? JSON.parse(saved) : INITIAL_BAHAN_BAKU;
    } catch {
      return INITIAL_BAHAN_BAKU;
    }
  });

  const [resep, setResep] = useState<Resep[]>(() => {
    try {
      const saved = localStorage.getItem('savoria_resep');
      return saved ? JSON.parse(saved) : INITIAL_RESEP;
    } catch {
      return INITIAL_RESEP;
    }
  });
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('savoria_registered_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Auth State (Default: Guest or demo Customer)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedAuth = localStorage.getItem('savoria_active_user');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch {
      return null;
    }
  });

  // Modal & Drawer Overlays
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, notes?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { product, quantity, notes }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            const min = item.product.minOrder || 1;
            return { ...item, quantity: newQty < min ? min : newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Order Placement (Checkout)
  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Pesanan Baru Diterima',
      message: `Kontrak pesanan ${newOrder.orderNumber} (${newOrder.eventTitle}) telah berhasil diajukan ke dapur Savoria.`,
      type: 'order',
      timestamp: 'Baru saja',
      read: false,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Optional Auto-Sync to Google Sheets if configured
    const savedSheetsUrl = localStorage.getItem('savoria_sheets_url');
    if (savedSheetsUrl) {
      sendDataToGoogleSheets(savedSheetsUrl, {
        action: 'sync_orders',
        orders: [newOrder, ...orders],
      }).catch(console.error);
    }

    // Navigate to orders
    setActiveView('orders');
  };

  // Bahan Baku Handlers
  const handleUpdateBahanBakuStok = (id: string, delta: number) => {
    setBahanBaku((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStok = Math.max(0, item.stokSaatIni + delta);
          return {
            ...item,
            stokSaatIni: newStok,
            status: newStok <= item.stokMinimum ? 'menipis' : 'aman',
            lastUpdated: 'Baru saja',
          };
        }
        return item;
      })
    );
  };

  const handleAddBahanBaku = (newBahan: BahanBaku) => {
    setBahanBaku((prev) => {
      const next = [newBahan, ...prev];
      try {
        localStorage.setItem('savoria_bahan_baku', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Menu / Product Handlers
  const handleAddProduct = (
    newProduct: Product,
    newResep?: Resep,
    newBahanItems?: BahanBaku[]
  ) => {
    setProducts((prev) => {
      const updatedProds = [newProduct, ...prev];
      try {
        localStorage.setItem('savoria_products', JSON.stringify(updatedProds));
      } catch (e) {
        console.error(e);
      }
      return updatedProds;
    });

    if (newResep) {
      setResep((prev) => {
        const updatedResep = [newResep, ...prev];
        try {
          localStorage.setItem('savoria_resep', JSON.stringify(updatedResep));
        } catch (e) {
          console.error(e);
        }
        return updatedResep;
      });
    }

    if (newBahanItems && newBahanItems.length > 0) {
      setBahanBaku((prev) => {
        const updatedBahan = [...newBahanItems, ...prev];
        try {
          localStorage.setItem('savoria_bahan_baku', JSON.stringify(updatedBahan));
        } catch (e) {
          console.error(e);
        }
        return updatedBahan;
      });
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Menu Baru Ditambahkan',
      message: `Menu "${newProduct.name}" berhasil didaftarkan ke katalog katering beserta kalkulasi modal HPP dan formula resep.`,
      type: 'system',
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Optional Auto-Sync to Google Sheets if configured
    const savedSheetsUrl = localStorage.getItem('savoria_sheets_url');
    if (savedSheetsUrl) {
      sendDataToGoogleSheets(savedSheetsUrl, {
        action: 'sync_menu',
        products: [newProduct, ...products],
      }).catch(console.error);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('savoria_products', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleUpdatePaymentStatus = (
    orderId: string,
    newPaymentStatus: 'unpaid' | 'dp_paid' | 'fully_paid'
  ) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: newPaymentStatus,
          };
        }
        return ord;
      });
      try {
        localStorage.setItem('savoria_orders', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const statusText =
        newPaymentStatus === 'fully_paid'
          ? 'Lunas (100%)'
          : newPaymentStatus === 'dp_paid'
          ? 'DP 50% Diterima'
          : 'Belum Bayar';

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Status Pembayaran Diperbarui',
        message: `Pembayaran pesanan ${targetOrder.orderNumber} (${targetOrder.eventTitle}) telah diverifikasi: ${statusText}.`,
        type: 'payment',
        timestamp: 'Baru saja',
        read: false,
        orderId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleSendBroadcast = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'system'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Status advance from Admin
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            draft: 'Draft',
            pending_payment: 'Menunggu Pembayaran',
            processing: 'Diproses Dapur',
            production: 'Sedang Produksi',
            ready_to_ship: 'Siap Dikirim',
            completed: 'Selesai',
          };

          const updatedTimeline = ord.timeline.map((step) => {
            if (step.status === newStatus) {
              return { ...step, isCompleted: true, isCurrent: true, timestamp: 'Sekarang' };
            }
            return step;
          });

          return {
            ...ord,
            status: newStatus,
            statusLabel: statusLabels[newStatus] || newStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    // Notify
    const matched = orders.find((o) => o.id === orderId);
    if (matched) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Status Diperbarui: ${matched.orderNumber}`,
          message: `Pesanan ${matched.eventTitle} kini berstatus: ${newStatus.replace('_', ' ').toUpperCase()}`,
          type: newStatus === 'ready_to_ship' ? 'delivery' : 'production',
          timestamp: 'Baru saja',
          read: false,
          orderId,
        },
        ...prev,
      ]);
    }
  };

  // Notification Handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotificationOpen(false);
    if (notif.orderId) {
      setActiveView('orders');
    }
  };

  // Auth & Registration Handlers
  const handleRegisterUser = (newUser: UserAccount) => {
    setUsers((prev) => {
      const updated = [newUser, ...prev.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())];
      try {
        localStorage.setItem('savoria_registered_users', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save registered users to localStorage:', err);
      }

      // Synchronize immediately to Google Sheets tab "Pengguna"
      const savedSheetsUrl = localStorage.getItem('savoria_sheets_url');
      if (savedSheetsUrl) {
        sendDataToGoogleSheets(savedSheetsUrl, {
          action: 'sync_users',
          users: updated,
        }).catch(console.error);
      }

      return updated;
    });

    // Notify
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Akun Pengguna Berhasil Didaftarkan',
        message: `Selamat datang ${newUser.name}! Akun ${newUser.role} Anda telah aktif dan tersimpan ke Google Sheets.`,
        type: 'system',
        timestamp: 'Baru saja',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleLoginSuccess = (user: UserProfile, targetView: ActiveView = 'home') => {
    setCurrentUser(user);
    try {
      localStorage.setItem('savoria_active_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }
    if (user.role === 'customer' && user.email === 'alexander@corporate.id') {
      setNotifications(INITIAL_NOTIFICATIONS);
    } else {
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          title: 'Selamat Datang di Savoria',
          message: `Halo ${user.name}, akun ${user.role === 'admin' ? 'Administrator' : 'Pelanggan'} Anda siap digunakan.`,
          type: 'system',
          timestamp: 'Baru saja',
          read: false,
        },
      ]);
    }
    setActiveView(targetView);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setNotifications([]);
    try {
      localStorage.removeItem('savoria_active_user');
    } catch (err) {
      console.error(err);
    }
    setActiveView('welcome');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotificationCount = currentUser ? notifications.filter((n) => !n.read).length : 0;

  // Filter orders visible to customer: guests have empty array
  const customerOrders = currentUser
    ? currentUser.role === 'admin'
      ? orders
      : orders.filter((o) => {
          const matchEmail = currentUser.email && o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase();
          const matchName = currentUser.name && o.contactName?.toLowerCase() === currentUser.name?.toLowerCase();
          return matchEmail || matchName;
        })
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      
      {/* If view is Admin Dashboard, render standalone full-screen admin layout */}
      {activeView === 'admin' ? (
        <AdminDashboard
          orders={orders}
          products={products}
          bahanBaku={bahanBaku}
          resep={resep}
          users={users}
          currentUser={
            currentUser || {
              name: 'Chef Hendra (Operations Head)',
              email: 'admin.kitchen@savoria-catering.com',
              phone: '+62 811-2233-4455',
              role: 'admin',
              companyOrEvent: 'Savoria Central Kitchen',
            }
          }
          onExitAdmin={() => setActiveView('home')}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateBahanBakuStok={handleUpdateBahanBakuStok}
          onAddBahanBaku={handleAddBahanBaku}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          notifications={notifications}
          onSendBroadcast={handleSendBroadcast}
        />
      ) : (
        <>
          {/* Main Top Header */}
          <Header
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
            cartCount={totalCartCount}
            unreadNotificationCount={unreadNotificationCount}
            onOpenCart={() => setIsCartOpen(true)}
            onToggleNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Notification Popover Dropdown */}
          <NotificationPopover
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={currentUser ? notifications : []}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onNotificationClick={handleNotificationClick}
          />

          {/* View Page Router with Smooth Transitions */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeView === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <WelcomePage onNavigate={(view) => setActiveView(view)} />
                </motion.div>
              )}

              {activeView === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomerHome
                    user={
                      currentUser || {
                        name: 'Sahabat Savoria',
                        email: 'tamu@savoria.id',
                        phone: '',
                        role: 'customer',
                      }
                    }
                    products={products}
                    onNavigate={(view) => setActiveView(view)}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                </motion.div>
              )}

              {activeView === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCatalog
                    products={products}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}

              {activeView === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomerOrdersPage
                    orders={customerOrders}
                    currentUser={currentUser}
                    onNavigate={(view) => setActiveView(view)}
                    onBackToProducts={() => setActiveView('products')}
                  />
                </motion.div>
              )}

              {activeView === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28 }}
                >
                  <LoginPage
                    registeredUsers={users}
                    onLoginSuccess={handleLoginSuccess}
                    onRegisterUser={handleRegisterUser}
                    onNavigateBack={() => setActiveView('welcome')}
                    sheetsConnected={Boolean(localStorage.getItem('savoria_sheets_url'))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer (Rendered on consumer-facing views) */}
          <Footer onNavigateToCatalog={() => setActiveView('products')} />
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onConfirmOrder={handleConfirmOrder}
      />

    </div>
  );
}
