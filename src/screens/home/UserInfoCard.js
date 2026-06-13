import React from 'react';
import { Text, View } from 'react-native';

export default function UserInfoCard({
  styles,
  user,
  teacherInitial,
  isAdmin
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoAvatar}>
        <Text style={styles.infoAvatarText}>{teacherInitial}</Text>
      </View>
      <View style={styles.infoBody}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoLabelStrong}>Perfil de usuario</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Activo</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Usuario</Text>
          <Text style={styles.infoValue}>{user?.email || 'Sin correo'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Rol</Text>
          <Text style={styles.infoValue}>{user?.rol || 'Sin rol'}</Text>
        </View>
        {!isAdmin ? (
          <>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Colegio</Text>
              <Text style={styles.infoValue}>{user?.schoolName || user?.schoolId || 'No asignado'}</Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}
