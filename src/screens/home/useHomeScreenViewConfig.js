import buildHomeAcademicViewConfig from './buildHomeAcademicViewConfig';
import buildHomeReportViewConfig from './buildHomeReportViewConfig';
import buildHomeUserViewConfig from './buildHomeUserViewConfig';

export default function useHomeScreenViewConfig({
  app,
  rolePanelInput,
  schoolState,
  schoolUi,
  courseState,
  docenteState,
  estudianteState,
  periodState,
  reportesState,
  passwordState,
  feedbackState,
  derived,
  handlers
}) {
  return {
    app,
    rolePanel: {
      ...rolePanelInput
    },
    ...buildHomeAcademicViewConfig({
      app,
      schoolState,
      courseState,
      estudianteState,
      periodState,
      docenteState,
      derived,
      handlers
    }),
    ...buildHomeUserViewConfig({
      schoolState,
      schoolUi,
      docenteState,
      derived,
      handlers
    }),
    ...buildHomeReportViewConfig({
      schoolState,
      courseState,
      docenteState,
      estudianteState,
      periodState,
      reportesState,
      passwordState,
      feedbackState,
      derived,
      handlers
    })
  };
}
