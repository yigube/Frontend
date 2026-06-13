import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export default function useSchoolSuccessFeedback() {
  const [colegiosSuccess, setColegiosSuccess] = useState('');
  const colegioSuccessAnim = useRef(new Animated.Value(0)).current;
  const colegiosSuccessTimerRef = useRef(null);

  const clearColegiosSuccessTimer = () => {
    if (!colegiosSuccessTimerRef.current) return;
    clearTimeout(colegiosSuccessTimerRef.current);
    colegiosSuccessTimerRef.current = null;
  };

  const hideColegiosSuccess = ({ animated = true } = {}) => {
    clearColegiosSuccessTimer();
    if (!colegiosSuccess) return;
    if (!animated) {
      colegioSuccessAnim.setValue(0);
      setColegiosSuccess('');
      return;
    }
    Animated.timing(colegioSuccessAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true
    }).start(() => setColegiosSuccess(''));
  };

  const showColegiosSuccess = (message) => {
    clearColegiosSuccessTimer();
    setColegiosSuccess(message);
    colegioSuccessAnim.setValue(0);
    Animated.timing(colegioSuccessAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true
    }).start();
    colegiosSuccessTimerRef.current = setTimeout(() => {
      hideColegiosSuccess({ animated: true });
    }, 2800);
  };

  useEffect(() => () => clearColegiosSuccessTimer(), []);

  return {
    colegiosSuccess,
    setColegiosSuccess,
    colegioSuccessAnim,
    clearColegiosSuccessTimer,
    hideColegiosSuccess,
    showColegiosSuccess
  };
}
