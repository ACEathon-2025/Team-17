const achievements = [
  { id: 1, name: 'First Analysis', icon: '🎯', condition: (count) => count >= 1 },
  { id: 2, name: 'Consistent Progress', icon: '🏆', condition: (count) => count >= 5 },
  { id: 3, name: 'Improvement Detected', icon: '📈', condition: (history) => {
    if (history.length < 2) return false
    return history[0].confidence < history[history.length - 1].confidence
  }},
  { id: 4, name: 'Dedicated Learner', icon: '⭐', condition: (count) => count >= 10 }
]

const AchievementBadge = ({ stats, history }) => {
  const unlockedAchievements = achievements.filter(achievement => {
    if (typeof achievement.condition === 'function') {
      return achievement.condition(stats.totalAnalyses, history)
    }
    return false
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {achievements.map(achievement => {
        const unlocked = unlockedAchievements.some(a => a.id === achievement.id)
        return (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-2xl text-center ${
              unlocked 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gray-200 dark:bg-gray-700 opacity-50'
            }`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <div className="text-sm font-bold">{achievement.name}</div>
            {unlocked && <div className="text-xs text-white mt-1">✓ Unlocked!</div>}
          </motion.div>
        )
      })}
    </div>
  )
}
