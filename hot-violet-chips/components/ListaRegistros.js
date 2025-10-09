import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>📚 Registros de Leitura</Text>
      {registros.length > 0 ? [...registros].reverse().map(reg => (
        <View key={reg.id} style={styles.itemHistorico}>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTexto}>📖 Páginas/dia: <Text style={styles.valor}>{reg.paginas}</Text></Text>
            <Text style={styles.itemTexto}>📚 Livros/mês: <Text style={styles.valor}>{reg.livros}</Text></Text>
            <Text style={styles.itemTexto}>⏳ Tempo/dia: <Text style={styles.valor}>{reg.tempo}h</Text></Text>
            <Text style={styles.dataRegistro}>🗓 {reg.data}</Text>
          </View>

          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
              <Text style={styles.botaoTextoAcao}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
              <Text style={styles.botaoTextoAcao}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        <Text style={styles.itemTexto}>Nenhum registro encontrado.</Text>
      )}
    </View>
  );
}

// ... resto do código (mantido igual)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 5,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d68910',
    textAlign: 'center',
  },
  itemHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#f9e79f',
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemTexto: {
    fontSize: 16,
    color: '#7d6608', // Amarelo queimado
    marginBottom: 4,
  },
  valor: {
    fontWeight: 'bold',
    color: '#b9770e', // Mostarda
  },
  dataRegistro: {
    fontSize: 12,
    color: '#9a7d0a',
    marginTop: 6,
    fontStyle: 'italic',
  },
  botoesAcao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoEditar: {
    backgroundColor: '#f39c12', // Laranja amarelado
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  botaoDelete: {
    backgroundColor: '#d35400', // Amarelo queimado puxando pro laranja
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTextoAcao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

