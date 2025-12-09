import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getEstudiantes } from '../services/estudiantes';
import ScreenBackground from '../components/ScreenBackground';
export default function EstudiantesScreen(){
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  useEffect(()=>{(async()=>{try{const res=await getEstudiantes();setData(res);}catch(e){setError(e?.response?.data?.message||e.message);}finally{setLoading(false);}})();},[]);
  if(loading)return <ScreenBackground contentStyle={styles.loader}><ActivityIndicator /></ScreenBackground>;
  if(error)return <ScreenBackground contentStyle={styles.loader}><Text style={styles.error}>{error}</Text></ScreenBackground>;
  return (
    <ScreenBackground contentStyle={styles.listContainer}>
      <FlatList data={data} keyExtractor={(item,idx)=>String(item.id||idx)} renderItem={({item})=>(
        <View style={styles.card}>
          <Text style={styles.title}>{item.nombre||`${item.nombres} ${item.apellidos}`}</Text>
          {item.documento ? <Text style={styles.meta}>ID: {item.documento}</Text> : null}
        </View>
      )}
      ItemSeparatorComponent={()=><View style={{height:10}}/>}
      />
    </ScreenBackground>
  );
}

const styles=StyleSheet.create({
  listContainer:{ flex:1 },
  loader:{ flex:1, alignItems:'center', justifyContent:'center' },
  error:{ color:'red', textAlign:'center' },
  card:{ backgroundColor:'rgba(255,255,255,0.92)', padding:16, borderRadius:12 },
  title:{ fontWeight:'700', fontSize:16, color:'#111' },
  meta:{ color:'#333', marginTop:4 }
});
