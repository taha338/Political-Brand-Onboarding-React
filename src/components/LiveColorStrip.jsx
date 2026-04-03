import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../context/BrandContext';

export default function LiveColorStrip() {
  const { state, getActiveColors } = useBrand();
  const hasColors = state.brandCore || (state.colorMode === 'custom' && state.customColors.primary);

  const colors = hasColors ? getActiveColors() : null;

  const colorEntries = colors
    ? Object.entries(colors).filter(([, v]) => v && typeof v === 'string')
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        zIndex: 9999,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="popLayout">
        {colorEntries.length > 0 ? (
          colorEntries.map(([key, color]) => (
            <motion.div
              key={key}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                flex: 1,
                backgroundColor: color,
                transformOrigin: 'left',
              }}
            />
          ))
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              background: 'linear-gradient(to right, #1C2E5B, #B22234)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
