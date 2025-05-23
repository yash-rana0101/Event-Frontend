import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';

const EventsGrid = ({ events, handleViewAttendees }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <EventCard event={event} handleViewAttendees={handleViewAttendees} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EventsGrid;
