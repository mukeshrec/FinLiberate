import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_ACHIEVEMENTS } from '../utils/mockData';
import { motion } from 'framer-motion';

export function Achievements() {
  const { achievements } = useApp();

  const categories = ['prepayment', 'streak', 'savings', 'speed'];

  const categoryNames = {
    prepayment: 'Prepayment Hero',
    streak: 'Streak Master',
    savings: 'Smart Saver',
    speed: 'Speed Runner',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Your journey milestones</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const categoryAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.category === category);
          const unlocked = categoryAchievements.filter((a) =>
            achievements.some((ua) => ua.achievement.code === a.code)
          );

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">
                {categoryNames[category as keyof typeof categoryNames]}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {unlocked.length}/{categoryAchievements.length}
              </p>
              <p className="text-sm text-gray-600">unlocked</p>
            </div>
          );
        })}
      </div>

      {categories.map((category) => {
        const categoryAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.category === category);

        return (
          <div key={category} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {categoryNames[category as keyof typeof categoryNames]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = achievements.some((ua) => ua.achievement.code === achievement.code);
                const userAchievement = achievements.find(
                  (ua) => ua.achievement.code === achievement.code
                );

                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl border-2 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                            : 'bg-gray-300'
                        }`}
                      >
                        {isUnlocked ? (
                          <CheckCircle className="w-7 h-7 text-white" />
                        ) : (
                          <Lock className="w-7 h-7 text-gray-500" />
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isUnlocked
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        +{achievement.points} pts
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    {isUnlocked && userAchievement && (
                      <p className="text-xs text-gray-500">
                        Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
