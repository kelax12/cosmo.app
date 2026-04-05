import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, Target, CheckSquare, Calendar, Zap, Clock, MapPin } from 'lucide-react';
import { useTasks as useTasksContext } from '../context/TaskContext';
import { useTasks } from '@/modules/tasks';
import { useHabits } from '@/modules/habits';
import { useOkrs } from '@/modules/okrs';
import { useEvents } from '@/modules/events';
import DashboardChart from '../components/DashboardChart';
import TodayHabits from '../components/TodayHabits';
import TodayTasks from '../components/TodayTasks';
import CollaborativeTasks from '../components/CollaborativeTasks';
import ActiveOKRs from '../components/ActiveOKRs';
import TextType from '../components/TextType';

const DashboardPage: React.FC = () => {
  const { data: tasks = [] } = useTasks();
  const { data: okrs = [] } = useOkrs();
  const { data: events = [] } = useEvents();
  const { user } = useTasksContext();
  const { data: habits = [] } = useHabits();

  const displayUser = user || { id: 'demo', name: 'Utilisateur', email: 'demo@cosmo.app' };

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();

  const todayHabits = habits.filter(habit => habit.completions[today]);
  const activeOKRs = okrs.filter(okr => !okr.completed);

  const completedTasksToday = tasks.filter(task =>
    task.completed &&
    task.completedAt &&
    new Date(task.completedAt).toDateString() === now.toDateString()
  ).length;

  const todayEvents = events.filter(event =>
    new Date(event.start).toDateString() === now.toDateString()
  );

  // Next upcoming event
  const nextEvent = events
    .filter(e => new Date(e.start) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

  const formatEventTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    return now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
  };

  const statCards = [
    { icon: CheckSquare, label: 'Tâches', value: completedTasksToday, subtitle: 'Complétées aujourd\'hui', gradient: 'from-blue-500 to-cyan-400' },
    { icon: Calendar,    label: 'Agenda',  value: todayEvents.length,   subtitle: 'Événements aujourd\'hui', gradient: 'from-violet-500 to-purple-400' },
    { icon: Target,      label: 'OKR',     value: activeOKRs.length,    subtitle: 'Objectifs en cours',      gradient: 'from-emerald-500 to-teal-400' },
    { icon: Repeat,      label: 'Habitudes', value: todayHabits.length, subtitle: 'Réalisées aujourd\'hui',  gradient: 'from-amber-500 to-orange-400' },
  ];

  return (
    <div className="relative min-h-screen bg-[rgb(var(--color-background))] p-4 sm:p-6 lg:p-8 overflow-hidden transition-colors duration-300">

      {/* Ambient gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 dark:bg-blue-500/15 blur-[120px]" />
        <div className="absolute -top-16 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/15 dark:bg-purple-500/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/10 dark:bg-indigo-400/8 blur-[80px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-[1600px] mx-auto space-y-6 lg:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
              <span>Bonjour, </span>
              <TextType
                text={displayUser.name}
                typingSpeed={80}
                pauseDuration={5000}
                deletingSpeed={50}
                loop={false}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="text-blue-500 dark:text-blue-400"
                textClassName="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              />
            </h1>
            <p className="text-[rgb(var(--color-text-secondary))] text-base lg:text-lg">
              Voici votre tableau de bord pour aujourd'hui
            </p>
          </div>
          <div className="text-right">
            <p className="text-[rgb(var(--color-text-primary))] font-semibold text-lg capitalize">
              {formatDate()}
            </p>
            <p className="text-[rgb(var(--color-text-muted))] text-sm">
              {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </motion.div>

        {/* Next event banner */}
        {nextEvent && (
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] dark:bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/20 flex items-center justify-center">
                <Calendar size={18} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[rgb(var(--color-text-muted))] font-medium uppercase tracking-wider mb-0.5">
                  Prochain événement
                </p>
                <p className="text-[rgb(var(--color-text-primary))] font-semibold truncate">
                  {nextEvent.title}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {formatEventTime(nextEvent.start)}
                </span>
                {nextEvent.location && (
                  <span className="hidden sm:flex items-center gap-1.5">
                    <MapPin size={13} />
                    {nextEvent.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-2 xl:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] dark:bg-white/[0.03] backdrop-blur-xl p-5 cursor-pointer hover:border-white/[0.15] hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
              <div className="relative">
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 mb-3`}>
                  <stat.icon size={18} className="text-white" strokeWidth={2.5} />
                </div>
                <motion.p
                  className="text-3xl lg:text-4xl font-black text-[rgb(var(--color-text-primary))] mb-1"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.2, type: 'spring' }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs font-bold text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text-primary))] transition-colors">
                  {stat.label}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart + Habits */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8" variants={containerVariants}>
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <DashboardChart />
          </motion.div>
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <TodayHabits />
          </motion.div>
        </motion.div>

        {/* OKRs + Tasks */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <ActiveOKRs />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TodayTasks />
          </motion.div>
        </motion.div>

        {/* Collaborative tasks */}
        <motion.div variants={itemVariants}>
          <CollaborativeTasks />
        </motion.div>

        {/* FAB */}
        <motion.button
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white z-50 hover:shadow-blue-500/50 transition-shadow duration-300"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        >
          <Zap size={22} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
