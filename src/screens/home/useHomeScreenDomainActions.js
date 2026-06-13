import useHomeAcademicActions from './useHomeAcademicActions';
import useHomeReportActions from './useHomeReportActions';
import useHomeUserActions from './useHomeUserActions';

export default function useHomeScreenDomainActions(config) {
  const academicActions = useHomeAcademicActions(config);
  const userActions = useHomeUserActions({
    ...config,
    academicActions
  });
  const reportActions = useHomeReportActions({
    ...config,
    academicActions
  });

  return {
    ...academicActions,
    ...userActions,
    ...reportActions
  };
}
