import { Bell, TrendingUp, Flame, Target, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Alerts() {
  const { alerts, markAlertAsRead } = useApp();
  const navigate = useNavigate();

  const handleAlertClick = (alert: typeof alerts[0]) => {
    markAlertAsRead(alert.id);
    if (alert.actionUrl) {
      navigate(alert.actionUrl);
    }
  };

  const unreadAlerts = alerts.filter((a) => !a.isRead);
  const readAlerts = alerts.filter((a) => a.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case 'rate_change':
        return TrendingUp;
      case 'streak':
        return Flame;
      case 'milestone':
        return Target;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Notifications</h1>
        <p className="text-gray-600">Stay on top of your loan optimization</p>
      </div>

      {unreadAlerts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            New Alerts ({unreadAlerts.length})
          </h2>
          <div className="space-y-4">
            {unreadAlerts.map((alert, index) => {
              const Icon = getIcon(alert.alertType);
              return (
                <motion.button
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAlertClick(alert)}
                  className="w-full bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPriorityColor(
                        alert.priority
                      )} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                          <p className="text-gray-600">{alert.message}</p>
                        </div>
                        {alert.actionUrl && (
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {readAlerts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Earlier</h2>
          <div className="space-y-4">
            {readAlerts.map((alert) => {
              const Icon = getIcon(alert.alertType);
              return (
                <div
                  key={alert.id}
                  className="bg-white rounded-xl shadow-sm p-6 opacity-60"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-700 mb-1">{alert.title}</h3>
                      <p className="text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Alerts</h2>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
