import { Platform, StyleSheet } from 'react-native';

export const SHARED_ACTION_MODAL = {
  width: '92%',
  maxWidth: 500,
  maxHeight: '76%',
  alignSelf: 'center'
};

export const styles = StyleSheet.create({
  content: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, paddingBottom: 28 },
  mainColumn: { width: '100%', alignSelf: 'stretch', gap: 16 },
  hero: { width: '100%', height: 170, borderRadius: 18, overflow: 'hidden', backgroundColor: '#000', marginTop: 0, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.28, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 5, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%' },
  infoCard: { flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 12, gap: 10, borderWidth: 1, borderColor: 'rgba(56,189,248,0.4)', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 6, marginTop: -12 },
  infoAvatar: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.18)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.6)', alignItems: 'center', justifyContent: 'center' },
  infoAvatarText: { color: '#e0f2fe', fontWeight: '900', fontSize: 18 },
  infoBody: { flex: 1, gap: 6 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoLabelStrong: { color: '#e0f2fe', fontWeight: '800', fontSize: 13, letterSpacing: 0.4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.18)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.45)' },
  statusPillText: { color: '#bbf7d0', fontWeight: '700', fontSize: 11 },
  infoItem: { gap: 2 },
  infoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  infoLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
  infoValue: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
  actionGrid: { width: '100%', alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, columnGap: 10, marginTop: 0 },
  actionGridRector: { gap: 12 },
  actionGridMobile: { justifyContent: 'space-between', rowGap: 12, columnGap: 12 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  btnRowMobileStacked: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 },
  actionBtn: { width: '48.8%', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  actionBtnMobile: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, paddingHorizontal: 10 },
  actionBtnFull: { width: '100%' },
  actionBtnRector: { width: '48.8%' },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  actionBtnTextMobile: { fontSize: 12.5, flexShrink: 1, textAlign: 'center' },
  mobileLogoutRowCenter: { width: '100%', alignItems: 'center' },
  actionBtnTextMobileStacked: { width: '100%', lineHeight: 15, textAlign: 'center', alignSelf: 'center' },
  actionBtnTextCompact: { fontSize: 13, flexShrink: 1, textAlign: 'center' },
  logoutActionBtn: { backgroundColor: '#ef4444' },
  periodBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#7c3aed', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  periodBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  periodSaveBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    minWidth: 168,
    borderRadius: 999,
    marginTop: 8,
    backgroundColor: '#0891b2',
    borderWidth: 1,
    borderColor: '#67e8f9',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12,
    elevation: 4
  },
  periodSaveBtnText: { fontSize: 13.5, fontWeight: '900' },
  feedbackSuccess: { color: '#bbf7d0', fontWeight: '700', fontSize: 13, marginTop: 6 },
  feedbackError: { color: '#fecaca', fontWeight: '700', fontSize: 13, marginTop: 6 },
  statusModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  statusModalCard: { minWidth: 260, maxWidth: '90%', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18, backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(34,197,94,0.45)', flexDirection: 'row', alignItems: 'center', gap: 10 },
  estudianteDeleteSuccessCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.42)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8
  },
  estudianteDeleteSuccessIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,163,74,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.5)'
  },
  estudianteDeleteSuccessContent: { flex: 1, minWidth: 0, gap: 2 },
  estudianteDeleteSuccessTitle: { color: '#dcfce7', fontSize: 14, fontWeight: '900' },
  estudianteDeleteSuccessText: { color: '#bbf7d0', fontSize: 12.5, fontWeight: '700' },
  uploadTemplateSuccessCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#052e2b',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.42)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#0f766e',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8
  },
  uploadTemplateSuccessIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,184,166,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.6)'
  },
  uploadTemplateSuccessContent: { flex: 1, minWidth: 0, gap: 2 },
  uploadTemplateSuccessTitle: { color: '#ccfbf1', fontSize: 14.2, fontWeight: '900' },
  uploadTemplateSuccessText: { color: '#99f6e4', fontSize: 12.5, fontWeight: '700' },
  qrZipErrorCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#2a0b15',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#be123c',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8
  },
  qrZipErrorIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.5)'
  },
  qrZipErrorContent: { flex: 1, minWidth: 0, gap: 2 },
  qrZipErrorTitle: { color: '#ffe4e6', fontSize: 14.2, fontWeight: '900' },
  qrZipErrorText: { color: '#fecdd3', fontSize: 12.5, fontWeight: '700' },
  qrZipErrorCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,29,29,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.45)'
  },
  qrZipDownloadCard: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#0b1530',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.42)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8
  },
  qrZipDownloadIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.5)'
  },
  qrZipDownloadContent: { flex: 1, minWidth: 0, gap: 2 },
  qrZipDownloadTitle: { color: '#dbeafe', fontSize: 14.2, fontWeight: '900' },
  qrZipDownloadText: { color: '#bfdbfe', fontSize: 12.4, fontWeight: '700', lineHeight: 18 },
  qrZipDownloadCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,58,138,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.45)'
  },
  uploadedStudentsBox: {
    marginTop: 8,
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.32)',
    gap: 8
  },
  uploadedStudentsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  uploadedStudentsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  uploadedStudentsHeaderIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.42)'
  },
  uploadedStudentsTitle: { color: '#e0f2fe', fontWeight: '900', fontSize: 13.5 },
  uploadedStudentsCountBadge: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)'
  },
  uploadedStudentsCountText: { color: '#dcfce7', fontSize: 11.5, fontWeight: '900' },
  uploadedStudentsList: { maxHeight: 190 },
  uploadedStudentsListContent: { gap: 7, paddingVertical: 2 },
  uploadedStudentsItem: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(30,41,59,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.22)',
    gap: 2
  },
  uploadedStudentsItemName: { color: '#f8fafc', fontWeight: '800', fontSize: 12.8 },
  uploadedStudentsItemMeta: { color: '#bfdbfe', fontSize: 11.4, fontWeight: '700' },
  estudianteDeleteSuccessCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51,65,85,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)'
  },
  resetPasswordModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#0b1324',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.45)',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6
  },
  resetPasswordModalCardError: {
    borderColor: 'rgba(248,113,113,0.5)',
    shadowColor: '#ef4444'
  },
  resetPasswordIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.55)',
    marginBottom: 10
  },
  resetPasswordIconWrapError: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(248,113,113,0.55)'
  },
  resetPasswordModalTitle: { color: '#f8fafc', fontWeight: '900', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  resetPasswordModalText: { color: '#cbd5e1', fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  resetPasswordModalBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  resetPasswordModalBtnText: { color: '#ecfdf5', fontWeight: '900', fontSize: 14 },
  statusModalText: { color: '#dcfce7', fontWeight: '800', fontSize: 16 },
  existingStudentsModalCard: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0b1324',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.45)',
    alignSelf: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 7
  },
  existingStudentsHeader: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  existingStudentsIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.55)'
  },
  existingStudentsHeaderText: { flex: 1, minWidth: 0 },
  existingStudentsTitle: { color: '#fef3c7', fontWeight: '900', fontSize: 17 },
  existingStudentsSubtitle: { color: '#fde68a', fontWeight: '700', fontSize: 12.5, marginTop: 2 },
  existingStudentsList: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    marginBottom: 12
  },
  existingStudentsItem: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(30,41,59,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.26)'
  },
  existingStudentsName: { color: '#f8fafc', fontWeight: '800', fontSize: 13.5 },
  existingStudentsReason: { color: '#fbbf24', fontWeight: '700', fontSize: 11.5, marginTop: 2 },
  existingStudentsCloseBtn: {
    alignSelf: 'stretch',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#f59e0b'
  },
  existingStudentsCloseBtnText: { color: '#fff7ed', fontWeight: '900', fontSize: 13 },
  deleteModalCard: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 18, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(239,68,68,0.45)', alignItems: 'center' },
  deleteModalIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.45)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  deleteModalTitle: { color: '#fee2e2', fontWeight: '900', fontSize: 18, marginBottom: 6 },
  deleteModalText: { color: '#fecaca', textAlign: 'center', fontSize: 13, lineHeight: 18 },
  deleteModalActions: { flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' },
  deleteModalCancelBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: 'rgba(148,163,184,0.15)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.35)' },
  deleteModalConfirmBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: '#ff1f1f', borderWidth: 1, borderColor: '#ff6b6b' },
  deleteModalCancelText: { color: '#e2e8f0', fontWeight: '800' },
  deleteModalConfirmText: { color: '#fff', fontWeight: '900' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', maxHeight: '90%', width: '100%', alignSelf: 'center' },
  sharedActionModalCard: { ...SHARED_ACTION_MODAL },
  modalCardWide: { ...SHARED_ACTION_MODAL },
  reportesModalCard: { width: Platform.OS === 'web' ? '52%' : '92%', maxWidth: 780, maxHeight: '82%', alignSelf: 'center' },
  periodModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#061724',
    borderColor: 'rgba(34,211,238,0.34)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 8
  },
  cursoModalCard: { ...SHARED_ACTION_MODAL },
  docenteCrudModalCard: {
    ...SHARED_ACTION_MODAL,
    marginTop: -12,
    backgroundColor: '#061724',
    borderColor: 'rgba(34,211,238,0.34)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 8
  },
  docenteEditModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#081426',
    borderColor: 'rgba(96,165,250,0.34)'
  },
  docenteEditHeaderTitle: { flex: 1, gap: 2 },
  docenteEditHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.32)'
  },
  docenteEditIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.46)'
  },
  docentesModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#061724',
    borderColor: 'rgba(34,211,238,0.34)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 8
  },
  rectorSedesModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#071f1a',
    borderColor: 'rgba(74,222,128,0.32)'
  },
  changePasswordModalCard: { ...SHARED_ACTION_MODAL, maxWidth: 520 },
  quickInfoModalCard: { ...SHARED_ACTION_MODAL },
  colegioModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#061724',
    borderColor: 'rgba(34,211,238,0.34)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 8
  },
  colegioListModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#061724',
    borderColor: 'rgba(34,211,238,0.34)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 8
  },
  modalContent: { padding: 16, gap: 12 },
  periodModalContent: { padding: 14, gap: 10 },
  cursoModalContent: { padding: 14, gap: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adminDocentesModalHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(103,232,249,0.18)',
    backgroundColor: 'rgba(8,47,73,0.48)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 10
  },
  adminDocentesTitleBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  adminDocentesIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,165,233,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.46)'
  },
  adminDocentesTitleCopy: { flex: 1, minWidth: 0, gap: 2 },
  adminDocentesEyebrow: { color: '#67e8f9', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  adminDocentesTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '900' },
  adminDocentesCloseBtn: {
    backgroundColor: 'rgba(127,29,29,0.42)',
    borderColor: 'rgba(248,113,113,0.6)',
    shadowColor: '#ef4444',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  adminDocentesModalContent: { padding: 16, gap: 14 },
  modalHeaderTitle: { flex: 1, minWidth: 0 },
  modalHeaderActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  closeBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,29,29,0.3)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(248,113,113,0.45)' },
  closeBtnText: { color: '#fecaca', fontWeight: '700' },
  fieldLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  colegioControlsGrid: { gap: 10 },
  colegioControlsGridRow: { width: '100%', justifyContent: 'space-between', alignItems: 'stretch', columnGap: 10, rowGap: 10, flexWrap: 'nowrap' },
  colegioSaveRow: { justifyContent: 'center' },
  colegioControlGridBtn: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, minHeight: 42 },
  colegioControlGridBtnRow: { width: '100%', minWidth: 0, justifyContent: 'center' },
  colegioControlGridBtnText: { flexShrink: 1, textAlign: 'center' },
  colegioControlsRowMobile: { justifyContent: 'space-between', rowGap: 10, columnGap: 10, alignItems: 'stretch' },
  colegioControlBtnMobile: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  colegioControlBtnRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  colegioControlBtnTextMobile: { flexShrink: 1, textAlign: 'center', fontSize: 11.5 },
  selectBox: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', minWidth: 64, alignItems: 'center' },
  selectBoxFull: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', minWidth: 64 },
  selectText: { color: '#e5e7eb', fontWeight: '800' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepperBtn: { width: 32, height: 36, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  stepperText: { color: '#e5e7eb', fontWeight: '800', fontSize: 16 },
  periodTitle: { color: '#e5e7eb', fontWeight: '800', fontSize: 14, marginBottom: 4 },
  periodItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  periodCard: { padding: 14, borderRadius: 14, backgroundColor: 'rgba(15,23,42,0.55)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.16)', marginTop: 8 },
  adminPeriodPanel: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(8,47,73,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.22)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4
  },
  adminPeriodHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(14,116,144,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.24)'
  },
  adminPeriodFieldBlock: {
    gap: 10,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  adminPeriodNameLabel: {
    alignSelf: 'stretch',
    marginBottom: -2,
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '900'
  },
  adminPeriodNameInput: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#083d5a',
    borderColor: '#1f9ac1',
    borderWidth: 1,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    paddingHorizontal: 16
  },
  adminPeriodSectionLabel: {
    alignSelf: 'center',
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4
  },
  adminPeriodDateControls: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'column',
    maxWidth: '100%',
    gap: 8
  },
  adminPeriodDateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    alignSelf: 'stretch',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  adminPeriodStepper: {
    gap: 6,
    flexShrink: 0
  },
  adminPeriodStepperBtn: {
    width: 34,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(30,58,77,0.92)',
    borderColor: 'rgba(125,211,252,0.18)'
  },
  adminPeriodSelectBox: {
    minWidth: 66,
    height: 46,
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(30,58,77,0.92)',
    borderColor: 'rgba(125,211,252,0.18)'
  },
  adminPeriodMonthBox: {
    minWidth: 74,
    maxWidth: 82
  },
  adminPeriodSelectText: {
    color: '#f8fafc',
    fontSize: 15.5,
    fontWeight: '900',
    textAlign: 'center'
  },
  adminPeriodEditBox: {
    alignSelf: 'stretch',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(7,89,133,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.24)'
  },
  adminPeriodFormTitleCard: {
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#083d5a',
    borderWidth: 1,
    borderColor: '#1f9ac1'
  },
  adminPeriodFormTitleText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'left'
  },
  adminPeriodEditActions: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 280,
    marginTop: 2
  },
  adminPeriodEditActionBtn: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 42,
    marginTop: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 9
  },
  adminPeriodCreateOnlyBtn: {
    maxWidth: 180,
    alignSelf: 'center'
  },
  adminPeriodEditCancelBtn: {
    backgroundColor: '#ff1f1f',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    shadowColor: '#ef4444',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  adminPeriodSchoolBox: {
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.54)',
    borderColor: 'rgba(103,232,249,0.18)'
  },
  adminPeriodListHeader: {
    marginTop: 2,
    paddingHorizontal: 2,
    borderBottomWidth: 0
  },
  adminPeriodListTitleCard: {
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#083d5a',
    borderWidth: 1,
    borderColor: '#1f9ac1',
    marginTop: 2
  },
  adminPeriodListTitleText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center'
  },
  adminPeriodCard: {
    width: '100%',
    alignSelf: 'stretch',
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#082f49',
    borderColor: 'rgba(34,211,238,0.42)',
    shadowColor: '#0891b2',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 16,
    elevation: 5
  },
  periodContent: { flex: 1, gap: 12, alignItems: 'center', alignSelf: 'stretch' },
  periodHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, alignSelf: 'stretch' },
  periodNameBadge: {
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(14,165,233,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.42)',
    alignSelf: 'center',
    maxWidth: '100%'
  },
  periodName: { color: '#fff', fontWeight: '900', fontSize: 16, textAlign: 'center', flexShrink: 1 },
  periodRange: { color: '#bae6fd', fontSize: 12.5, lineHeight: 18, textAlign: 'center', fontWeight: '700' },
  periodDateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignSelf: 'stretch' },
  periodDateCard: { minWidth: 136, flex: 1, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(12,74,110,0.78)', borderWidth: 1, borderColor: 'rgba(125,211,252,0.26)', alignItems: 'center' },
  periodDateLabel: { color: '#7dd3fc', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  periodDateValue: { color: '#f8fafc', fontSize: 13.5, fontWeight: '900', marginTop: 5, textAlign: 'center' },
  periodDateTime: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  periodFooterRow: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, alignSelf: 'stretch' },
  periodDurationChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(16,185,129,0.16)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.34)', alignItems: 'center' },
  periodDurationText: { color: '#bbf7d0', fontSize: 11, fontWeight: '900', textAlign: 'center' },
  periodMeta: { color: '#a5f3fc', fontSize: 12, marginTop: 2, textAlign: 'center' },
  periodActions: { flexDirection: 'row', gap: 8, alignSelf: 'stretch', flexWrap: 'nowrap', justifyContent: 'center' },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  updateBtn: { backgroundColor: 'rgba(56,189,248,0.2)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.5)' },
  deleteBtn: { backgroundColor: '#ff1f1f', borderWidth: 1, borderColor: '#ff6b6b' },
  smallBtnText: { color: '#e5e7eb', fontWeight: '700', fontSize: 12 },
  emptyText: { color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
  dataBox: { width: '100%', alignSelf: 'stretch', marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4 },
  dataTitle: { color: '#e5e7eb', fontWeight: '800', marginBottom: 2 },
  studentsHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  dataItem: { color: '#cbd5e1' },
  dataValue: { color: '#fff', fontWeight: '800' },
  dataBullet: { color: '#cbd5e1', fontSize: 12 },
  assignedCoursesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  assignedCoursesBadge: {
    minWidth: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)'
  },
  assignedCoursesBadgeText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  assignedCoursesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  assignedCourseChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.22)'
  },
  assignedCourseChipActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderColor: 'rgba(96,165,250,0.48)'
  },
  assignedCourseChipText: { color: '#cbd5e1', fontSize: 12.5, fontWeight: '700' },
  assignedCourseChipTextActive: { color: '#eff6ff' },
  docentePerfilBox: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.24)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4
  },
  docentePerfilHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  docentePerfilTitleWrap: { flex: 1, gap: 2 },
  docentePerfilEyebrow: { color: '#93c5fd', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  docentePerfilTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '900' },
  docentePerfilBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)'
  },
  docentePerfilBadgeText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  docentePerfilSummary: { color: '#cbd5e1', fontSize: 13, lineHeight: 19 },
  docentePerfilError: { marginTop: 2 },
  docenteMateriaList: { gap: 10 },
  docenteMateriaCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30,41,59,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    gap: 10
  },
  docenteMateriaHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'nowrap' },
  docenteMateriaTitleBlock: { flexShrink: 0, minWidth: 120, paddingTop: 2 },
  docenteMateriaAside: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  docenteMateriaLabel: { color: '#93c5fd', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  docenteMateriaLabelInline: { color: '#93c5fd', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  docenteMateriaCourseLine: { color: '#fff', fontSize: 16, fontWeight: '800' },
  docenteMateriaCourse: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 2 },
  docenteMateriaMetaRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  docenteMateriaActionCenterRow: { width: '100%', marginTop: 8, alignItems: 'center' },
  docenteMateriaInlineChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.26)',
    maxWidth: '100%'
  },
  docenteMateriaInlineChipText: { color: '#dbeafe', fontSize: 12.5, fontWeight: '700', textAlign: 'center' },
  docenteMateriaActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(14,165,233,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.42)',
    flexShrink: 0
  },
  docenteMateriaActionText: { color: '#e0f2fe', fontSize: 11.5, fontWeight: '800' },
  docenteMateriaNamesWrap: { width: '100%', minWidth: 0, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  docenteMateriaChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.26)'
  },
  docenteMateriaChipText: { color: '#dbeafe', fontSize: 12, fontWeight: '700' },
  docenteMateriaEmptyHint: { color: '#94a3b8', fontSize: 12.5, fontStyle: 'italic' },
  docenteMateriaEmptyHintInline: { textAlign: 'right', alignSelf: 'center' },
  docenteMateriaEmptyCard: {
    minHeight: 74,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    backgroundColor: 'rgba(30,41,59,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 16
  },
  docenteMateriaEmptyText: { color: '#cbd5e1', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  docentesSearchBox: { marginTop: 10, gap: 6 },
  adminDocentesPanel: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(8,47,73,0.46)',
    borderColor: 'rgba(103,232,249,0.22)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4
  },
  adminDocentesSchoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(14,116,144,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.28)'
  },
  adminDocentesSchoolBadgeText: { color: '#ecfeff', fontSize: 12.5, fontWeight: '800' },
  adminDocentesSelectBox: {
    borderRadius: 15,
    backgroundColor: 'rgba(14,116,144,0.24)',
    borderColor: 'rgba(103,232,249,0.36)',
    paddingVertical: 12
  },
  adminDocentesSelectRow: { flexDirection: 'row', alignItems: 'center', gap: 9, width: '100%' },
  adminDocentesSelectText: { flex: 1, color: '#ecfeff' },
  adminDocentesPickerList: {
    borderRadius: 15,
    backgroundColor: 'rgba(6,24,38,0.98)',
    borderColor: 'rgba(103,232,249,0.24)',
    overflow: 'hidden'
  },
  adminDocentesPickerItem: { paddingVertical: 12, paddingHorizontal: 12 },
  adminDocentesPickerItemActive: {
    backgroundColor: 'rgba(14,165,233,0.22)',
    borderLeftWidth: 3,
    borderLeftColor: '#22d3ee'
  },
  adminDocentesPickerText: { color: '#dffafe', fontWeight: '700' },
  adminDocentesSectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 },
  adminDocentesSectionTitle: { color: '#ecfeff', fontSize: 15, fontWeight: '900' },
  adminDocentesSearchBox: { marginTop: 2 },
  adminDocentesSearchInputWrap: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(2,132,199,0.16)',
    borderColor: 'rgba(103,232,249,0.34)'
  },
  adminDocentesSearchInput: { color: '#ecfeff', fontWeight: '700' },
  adminDocentesClearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,47,73,0.72)'
  },
  adminDocentesSuggestions: {
    backgroundColor: 'rgba(6,24,38,0.98)',
    borderColor: 'rgba(103,232,249,0.24)'
  },
  docentesSearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  docentesSearchInput: { flex: 1, color: '#fff', paddingVertical: 10 },
  docentesSearchClearBtn: { padding: 2 },
  docentesSearchSuggestions: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15,23,42,0.96)',
    overflow: 'hidden'
  },
  docentesSearchSuggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  docentesSearchSuggestionName: { color: '#f8fafc', fontWeight: '700', fontSize: 13.5 },
  docentesSearchSuggestionMeta: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  docentesSearchEmpty: { color: '#94a3b8', fontSize: 12.5, paddingHorizontal: 12, paddingVertical: 10 },
  reportFieldGroup: { gap: 6 },
  reportFiltersGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 2 },
  reportFieldColumn: { flex: 1, minWidth: 160, gap: 6 },
  reportHeroCard: {
    marginTop: 2,
    marginBottom: 2,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.24)',
    gap: 10
  },
  reportHeroHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reportHeroIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,116,144,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.35)'
  },
  reportHeroTextWrap: { flex: 1, gap: 2 },
  reportHeroTitle: { color: '#ecfeff', fontSize: 14.5, fontWeight: '900' },
  reportHeroSubtitle: { color: '#cbd5e1', fontSize: 12.5, lineHeight: 17 },
  reportHeroChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reportHeroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)'
  },
  reportHeroChipText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  reportActionRow: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reportActionBtn: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportActionBtnPrimary: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8'
  },
  reportActionBtnInfo: {
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderColor: 'rgba(96,165,250,0.45)'
  },
  reportActionBtnGhost: {
    backgroundColor: 'rgba(30,41,59,0.78)',
    borderColor: 'rgba(148,163,184,0.35)'
  },
  reportActionBtnText: { color: '#f8fafc', fontSize: 12.5, fontWeight: '800' },
  reportGenerateBtn: { alignSelf: 'flex-start', marginTop: 10 },
  reportGenerateBtnDisabled: { opacity: 0.65 },
  reportPickerEmpty: { paddingHorizontal: 12, paddingVertical: 10 },
  reportMetricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reportMetricCard: {
    flexGrow: 1,
    minWidth: 150,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    padding: 14,
    gap: 4
  },
  reportMetricLabel: { color: '#94a3b8', fontSize: 11.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  reportMetricValue: { color: '#f8fafc', fontSize: 22, fontWeight: '900' },
  reportMetricHint: { color: '#cbd5e1', fontSize: 12, lineHeight: 17 },
  reportListSection: { marginTop: 10, gap: 8 },
  reportListItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    gap: 3
  },
  reportListTitle: { color: '#e2e8f0', fontSize: 13.5, fontWeight: '700' },
  reportListMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  docentesOverviewSection: { marginTop: 6, width: '100%', alignSelf: 'stretch' },
  colegiosRegisteredBox: {
    gap: 10,
    padding: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderColor: 'rgba(96,165,250,0.16)'
  },
  adminColegiosPanel: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(8,47,73,0.46)',
    borderColor: 'rgba(103,232,249,0.22)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4
  },
  colegiosRegisteredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 2
  },
  colegioRegisteredCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    gap: 12
  },
  adminColegioRegisteredCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderColor: 'rgba(34,211,238,0.24)',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 3
  },
  colegioRegisteredCardActive: {
    backgroundColor: 'rgba(14,165,233,0.16)',
    borderColor: 'rgba(103,232,249,0.5)'
  },
  colegioRegisteredTopRow: {
    gap: 8
  },
  colegioRegisteredTitleWrap: {
    flex: 1,
    minWidth: 0,
    gap: 6
  },
  adminColegioHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 11, width: '100%' },
  adminColegioAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,165,233,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.44)'
  },
  adminColegioCreatePanel: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(8,47,73,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.22)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4
  },
  adminColegioCreateHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(14,116,144,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.24)'
  },
  adminColegioCreateTitle: { color: '#ecfeff', fontSize: 15, fontWeight: '900' },
  adminColegioInput: {
    minHeight: 46,
    borderRadius: 15,
    color: '#ecfeff',
    fontWeight: '700',
    backgroundColor: 'rgba(2,132,199,0.16)',
    borderColor: 'rgba(103,232,249,0.34)'
  },
  colegioRegisteredActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    gap: 8
  },
  colegioRegisteredActionBtn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  adminColegioActionBtn: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    elevation: 3
  },
  adminColegioEditBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa'
  },
  adminColegioDeleteBtn: {
    backgroundColor: '#ff1f1f',
    borderColor: '#ff6b6b'
  },
  colegioRegisteredActionBtnRow: {
    width: '100%',
    justifyContent: 'center'
  },
  colegioRegisteredEyebrow: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7
  },
  colegioRegisteredName: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900'
  },
  colegioRegisteredMetaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  colegioRegisteredMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.28)'
  },
  adminColegioMetaChip: {
    backgroundColor: 'rgba(14,116,144,0.3)',
    borderColor: 'rgba(103,232,249,0.26)'
  },
  colegioRegisteredRoleChip: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderColor: 'rgba(74,222,128,0.28)'
  },
  colegioRegisteredMetaChipText: {
    color: '#dbeafe',
    fontSize: 11.5,
    fontWeight: '800'
  },
  adminColegioMetaChipText: { color: '#cffafe' },
  colegioRegisteredRoleChipText: {
    color: '#dcfce7'
  },
  colegioRegisteredDirectivoBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30,41,59,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.14)',
    gap: 10
  },
  colegioRegisteredDirectivoTitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '800'
  },
  colegioRegisteredInfoGrid: {
    gap: 8
  },
  colegioRegisteredInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.14)',
    gap: 6
  },
  colegioRegisteredInfoLabel: {
    color: '#93c5fd',
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  colegioRegisteredInfoValue: {
    color: '#f8fafc',
    fontSize: 12.5,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right'
  },
  colegioRegisteredEmptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.14)'
  },
  colegioRegisteredEmptyText: {
    color: '#cbd5e1',
    fontSize: 12.5,
    fontWeight: '600'
  },
  rectoresListWrap: {
    gap: 10
  },
  rectorRegisteredCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.22)',
    gap: 4
  },
  adminRectorRegisteredCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderColor: 'rgba(34,211,238,0.24)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 3
  },
  rectorRegisteredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  adminRectorHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 },
  adminRectorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,165,233,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.44)'
  },
  adminRectorMetaGrid: { gap: 8, marginTop: 2, alignSelf: 'stretch' },
  adminRectorMetaLine: { alignSelf: 'stretch', width: '100%' },
  rectorRegisteredName: {
    color: '#f8fafc',
    fontSize: 14.5,
    fontWeight: '800',
    flex: 1
  },
  rectorRegisteredMeta: {
    color: '#cbd5e1',
    fontSize: 12
  },
  rectorRegisteredActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    gap: 8,
    marginTop: 10
  },
  rectorModernActionBtn: {
    flex: 1,
    minWidth: 0,
    maxWidth: 'none',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4
  },
  rectorModernActionRow: {
    justifyContent: 'center'
  },
  rectorModernActionText: {
    color: '#f8fafc',
    fontWeight: '900',
    fontSize: 12.5
  },
  rectorEditBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa'
  },
  rectorDeleteBtn: {
    backgroundColor: '#ff1f1f',
    borderColor: '#ff6b6b'
  },
  rectorEditModalCard: {
    ...SHARED_ACTION_MODAL,
    borderColor: 'rgba(45,212,191,0.32)',
    backgroundColor: '#07131f'
  },
  rectorEditHeaderTitle: {
    gap: 2,
    flex: 1
  },
  rectorEditEyebrow: {
    color: '#5eead4',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  rectorEditHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(13,148,136,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.28)'
  },
  rectorEditIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,184,166,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(153,246,228,0.42)'
  },
  rectorEditHeroCopy: {
    flex: 1,
    minWidth: 0
  },
  rectorEditHeroTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900'
  },
  rectorEditHeroMeta: {
    color: '#99f6e4',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2
  },
  rectorEditRoleRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  rectorRolePill: {
    minWidth: 128,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.28)'
  },
  rectorRolePillActive: {
    backgroundColor: '#0891b2',
    borderColor: '#67e8f9'
  },
  rectorRolePillText: {
    color: '#bfdbfe',
    fontWeight: '900',
    fontSize: 12.5
  },
  rectorRolePillTextActive: {
    color: '#ecfeff'
  },
  rectorEditFormGrid: {
    gap: 10
  },
  rectorEditActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 280,
    gap: 8,
    flexWrap: 'nowrap',
    marginTop: 4
  },
  rectorEditActionRow: {
    width: '100%',
    minWidth: 0,
    justifyContent: 'center'
  },
  rectorEditActionText: {
    flexShrink: 1,
    textAlign: 'center'
  },
  rectorEditCancelBtn: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff1f1f',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    shadowColor: '#ef4444',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  rectorEditSaveBtn: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d9488',
    borderWidth: 1,
    borderColor: '#5eead4'
  },
  deleteRectorModalCard: {
    borderColor: 'rgba(251,113,133,0.55)',
    backgroundColor: '#1f1117'
  },
  deleteRectorIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(220,38,38,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  docenteInlineCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.22)',
    marginTop: 8,
    gap: 4
  },
  adminDocenteInlineCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderColor: 'rgba(34,211,238,0.24)',
    gap: 9,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 3
  },
  adminDocenteInlineHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  adminDocenteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,165,233,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.44)'
  },
  adminDocenteInlineTitleBlock: { flex: 1, minWidth: 0, gap: 2 },
  adminDocenteMetaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  adminDocenteMetaGridMobile: { flexWrap: 'nowrap', alignItems: 'stretch' },
  adminDocenteMetaPill: {
    color: '#cffafe',
    fontSize: 11.5,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(14,116,144,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.26)',
    overflow: 'hidden'
  },
  adminDocenteMetaPillMobile: { flex: 1, textAlign: 'center' },
  docenteInlineActions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  docenteInlineActionsMobile: { justifyContent: 'center', alignItems: 'center', width: '100%', flexWrap: 'nowrap', gap: 6 },
  docenteInlineName: { color: '#f8fafc', fontSize: 14.5, fontWeight: '800' },
  docenteInlineMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  docenteCourseChecklist: { marginTop: 6, gap: 8 },
  docenteCourseOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    overflow: 'hidden',
    alignSelf: 'stretch'
  },
  docenteCourseOptionActive: {
    backgroundColor: 'rgba(30,58,138,0.35)',
    borderColor: 'rgba(96,165,250,0.62)'
  },
  docenteCourseOptionText: { color: '#cbd5e1', fontSize: 15, fontWeight: '600' },
  docenteCourseOptionCopyMobile: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, maxWidth: '100%', overflow: 'hidden', gap: 3 },
  docenteCourseOptionTextMobile: { width: '100%', minWidth: 0, flexShrink: 1, fontSize: 13, lineHeight: 18, overflow: 'hidden' },
  docenteCourseOptionMetaMobile: { width: '100%', minWidth: 0, flexShrink: 1, color: '#a5f3fc', fontSize: 12, lineHeight: 17, fontWeight: '700', overflow: 'hidden' },
  docenteCourseOptionTextActive: { color: '#eff6ff', fontWeight: '800' },
  docenteMateriasByCursoWrap: { marginTop: 10, gap: 10 },
  docenteMateriaCursoItem: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)'
  },
  docenteMateriaCursoLabel: { color: '#dbeafe', fontSize: 12.5, fontWeight: '800' },
  docenteMateriaCursoInput: { minHeight: 44, textAlignVertical: 'top' },
  docenteMateriaCursoHint: { color: '#93c5fd', fontSize: 11.5, fontStyle: 'italic' },
  docenteSummaryCard: { padding: 12, borderRadius: 14, backgroundColor: 'rgba(15,23,42,0.55)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', marginTop: 10, gap: 10 },
  adminDocenteSummaryCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderColor: 'rgba(34,211,238,0.24)',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 3
  },
  docenteSummaryTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  docenteSummaryTopRowMobile: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  docenteSummaryHeader: { gap: 4, flex: 1, minWidth: 0 },
  docenteSummaryHeaderMobile: { width: '100%', minWidth: 0 },
  docenteSummaryActions: { flexDirection: 'row', gap: 8, alignSelf: 'flex-end', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '100%' },
  docenteSummaryActionsMobile: { width: '100%', alignSelf: 'stretch' },
  docenteSummaryActionBtnMobile: { flex: 1, minWidth: 0, alignItems: 'center' },
  docenteSummaryName: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  docenteSummaryEmail: { color: '#94a3b8', fontSize: 13 },
  docenteCursoList: { gap: 8 },
  docenteCursoChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 13, backgroundColor: 'rgba(8,47,73,0.48)', borderWidth: 1, borderColor: 'rgba(103,232,249,0.2)', gap: 4 },
  docenteCursoChipEmpty: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 13, backgroundColor: 'rgba(30,41,59,0.5)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)' },
  docenteCursoChipTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: '700' },
  docenteCursoChipMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  courseActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  rectorSedesHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 },
  rectorSedeCreateBtn: { alignSelf: 'flex-end' },
  courseForm: { marginBottom: 10, gap: 8 },
  courseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  adminCourseForm: { marginBottom: 10, gap: 8 },
  adminCourseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  rectorCourseForm: { marginBottom: 10, gap: 8 },
  rectorCourseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  estudianteMateriaSelectorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15,23,42,0.45)',
    gap: 8
  },
  estudianteMateriaChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estudianteMateriaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.24)'
  },
  estudianteMateriaChipActive: {
    backgroundColor: 'rgba(16,185,129,0.18)',
    borderColor: 'rgba(16,185,129,0.55)'
  },
  estudianteMateriaChipText: { color: '#cbd5e1', fontSize: 12.5, fontWeight: '700' },
  estudianteMateriaChipTextActive: { color: '#ecfdf5' },
  materiaCursoGroup: { gap: 6, marginTop: 8 },
  passwordInputWrap: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 44 },
  passwordEyeBtn: {
    position: 'absolute',
    right: 10,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  courseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  docenteEditActionsCentered: {
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  docenteEditCancelBtnMobile: {
    backgroundColor: '#ff1f1f',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 999,
    paddingHorizontal: 14,
    shadowColor: '#ef4444',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  docenteEditCancelTextMobile: { color: '#fff1f2', fontWeight: '900' },
  docenteEditUpdateBtnMobile: {
    borderRadius: 999,
    paddingHorizontal: 14,
    shadowColor: '#10b981',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  docenteCreateActions: { justifyContent: 'center', alignItems: 'center' },
  docenteCreateOptionBtn: { minWidth: 132, minHeight: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },
  docenteCreateOptionText: { textAlign: 'center', fontSize: 12, fontWeight: '800' },
  docenteCreateSaveBtn: { minWidth: 118, minHeight: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14 },
  docenteCreateSaveRow: { width: '100%', justifyContent: 'center' },
  docenteCreateSaveText: { minWidth: 44, textAlign: 'center', fontSize: 12.5, fontWeight: '800' },
  adminDocenteActionBtn: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    elevation: 3
  },
  adminDocenteResetBtn: {
    backgroundColor: '#0891b2',
    borderColor: '#22d3ee'
  },
  adminDocenteResetBtnMobile: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    alignSelf: 'stretch',
    paddingHorizontal: 6
  },
  adminDocenteInlineActionBtnMobile: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    alignSelf: 'stretch',
    paddingHorizontal: 6
  },
  adminDocenteResetBtnRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  adminDocenteActionRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  adminDocenteEditBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa'
  },
  adminDocenteDeleteBtn: {
    backgroundColor: '#ff1f1f',
    borderColor: '#ff6b6b'
  },
  adminDocenteActionText: { color: '#f8fafc', fontWeight: '900', fontSize: 12 },
  adminDocenteActionTextMobile: { flexShrink: 1, textAlign: 'center', fontSize: 9.8 },
  adminDocenteDeleteTextMobile: { marginTop: 5, lineHeight: 12, transform: [{ translateY: 3 }] },
  docenteConfigModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#081426',
    borderColor: 'rgba(34,211,238,0.32)'
  },
  docenteConfigHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(14,165,233,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.32)'
  },
  docenteConfigIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,165,233,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.42)'
  },
  docenteConfigActions: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  docenteConfigDoneBtn: { minWidth: 120, alignItems: 'center', justifyContent: 'center' },
  adminCourseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  rectorCourseFormActions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'nowrap', alignSelf: 'stretch' },
  rectorCancelBtn: {
    borderRadius: 999,
    backgroundColor: '#ff1f1f',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    shadowColor: '#ef4444',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  rectorPairedActionBtn: {
    flex: 1,
    flexBasis: 0,
    maxWidth: 168,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rectorPairedActionRow: {
    width: '100%',
    minWidth: 0,
    justifyContent: 'center'
  },
  rectorCancelRow: {
    width: '100%',
    justifyContent: 'center'
  },
  rectorCancelText: {
    color: '#fff1f2',
    fontWeight: '900',
    textAlign: 'center'
  },
  rectorCourseCreateBtn: { minWidth: 168, alignItems: 'center' },
  rectorCoursesListHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  rectorCourseEditModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#071426',
    borderColor: 'rgba(96,165,250,0.34)'
  },
  rectorCourseEditHeaderTitle: { flex: 1, gap: 2 },
  rectorCourseEditHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.32)'
  },
  rectorCourseEditIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.46)'
  },
  rectorCourseEditHeroCopy: { flex: 1, minWidth: 0 },
  rectorCourseEditHeroTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '900' },
  rectorCourseEditHeroMeta: { color: '#bfdbfe', fontSize: 12.5, fontWeight: '700', marginTop: 2 },
  rectorSedeModalCard: {
    ...SHARED_ACTION_MODAL,
    backgroundColor: '#071f1a',
    borderColor: 'rgba(74,222,128,0.32)'
  },
  rectorSedeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(22,163,74,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.32)'
  },
  rectorSedeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,163,74,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(134,239,172,0.46)'
  },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  infoBtn: { backgroundColor: 'rgba(59,130,246,0.18)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.45)' },
  createBtn: { backgroundColor: 'rgba(16,185,129,0.25)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.6)' },
  colegioRoleBtn: {
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.22)',
    shadowColor: '#020617',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2
  },
  adminColegioRoleBtn: {
    borderRadius: 999,
    backgroundColor: 'rgba(14,116,144,0.2)',
    borderColor: 'rgba(103,232,249,0.3)'
  },
  colegioRoleBtnActive: {
    backgroundColor: '#0891b2',
    borderColor: '#67e8f9',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.22
  },
  colegioCoordinatorRoleBtn: {
    borderRadius: 999,
    backgroundColor: 'rgba(8,145,178,0.22)',
    borderColor: 'rgba(103,232,249,0.42)',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  colegioCoordinatorRoleBtnActive: {
    backgroundColor: '#0891b2',
    borderColor: '#67e8f9',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.28,
    elevation: 5
  },
  colegioRoleBtnText: {
    color: '#f8fafc'
  },
  colegioRectoresBtn: {
    backgroundColor: 'rgba(6,78,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.55)',
    shadowColor: '#10b981',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  colegioListBtn: {
    backgroundColor: 'rgba(8,47,73,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.55)',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  colegioSaveBtn: {
    backgroundColor: '#10b981',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
    shadowColor: '#34d399',
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 14,
    elevation: 5
  },
  adminColegioSaveBtn: {
    borderRadius: 999,
    backgroundColor: '#0891b2',
    borderColor: '#67e8f9',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.3
  },
  adminColegioCreateBtn: {
    backgroundColor: '#f59e0b',
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.34
  },
  colegioCancelBtn: {
    backgroundColor: 'rgba(127,29,29,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.5)',
    shadowColor: '#ef4444',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  adminColegioCancelBtn: {
    borderRadius: 999,
    backgroundColor: '#ff1f1f',
    borderColor: '#ff6b6b'
  },
  colegioCancelActions: {
    justifyContent: 'center'
  },
  colegioActionBtnText: {
    color: '#f8fafc'
  },
  colegioSuccessBanner: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.45)',
    backgroundColor: 'rgba(6,78,59,0.55)'
  },
  colegioSuccessText: {
    color: '#d1fae5',
    fontSize: 12.5,
    fontWeight: '800'
  },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  courseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  courseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  courseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  courseRowActive: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 10, paddingHorizontal: 8 },
  courseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  courseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  adminCourseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  adminCourseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  adminCourseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  adminCourseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  adminCourseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  adminCourseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  rectorCourseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  rectorCourseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  rectorCourseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  rectorCourseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  rectorCourseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  rectorCourseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  estudianteRowCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(15,23,42,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.2)',
    marginTop: 8
  },
  estudianteRowContent: {
    gap: 5
  },
  estudianteRowName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21
  },
  estudianteRowMeta: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18
  },
  estudianteRowActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap'
  },
  estudianteRowActionBtn: {
    flex: 1,
    minWidth: 0,
    maxWidth: 170,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  pickerList: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 8 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10 },
  pickerItemActive: { backgroundColor: 'rgba(16,185,129,0.18)' },
  errorText: { color: '#fca5a5' },
  dropdownList: { marginTop: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemSelected: { backgroundColor: 'rgba(56,189,248,0.12)' },
  linkBtn: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.4)' },
  linkBtnText: { color: '#bfdbfe', fontWeight: '700', fontSize: 12 },
  logoutBtn: { width: '100%', alignSelf: 'stretch', marginTop: 8, borderRadius: 14, paddingVertical: 15, alignItems: 'center', backgroundColor: '#ef4444', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, elevation: 4 },
  docenteGridLogoutRow: { width: '100%', alignItems: 'center' },
  docenteGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  adminGridLogoutRow: { width: '100%', alignItems: 'center' },
  adminGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  rectorGridLogoutRow: { width: '100%', alignItems: 'center' },
  rectorGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  docenteFooterLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  logoutText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 }
});






