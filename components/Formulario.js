import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [paginasPorDia, setPaginasPorDia] = useState('');
  const [livrosPorMes, setLivrosPorMes] = useState('');
  const [tempoPorDia, setTempoPorDia] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setPaginasPorDia(String(registroEmEdicao.paginas));
      setLivrosPorMes(String(registroEmEdicao.livros));
      setTempoPorDia(String(registroEmEdicao.tempo));
    } else {
      setPaginasPorDia('');
      setLivrosPorMes('');
      setTempoPorDia('');
    }
  }, [registroEmEdicao]);

  // 🔹 Agora passando os 3 valores para o App.js
  const handleSaveClick = () => {
    onSave(paginasPorDia, livrosPorMes, tempoPorDia);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Quantas páginas você lê por dia?"
        keyboardType="numeric"
        value={paginasPorDia}
        onChangeText={setPaginasPorDia}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantos livros você lê por mês?"
        keyboardType="numeric"
        value={livrosPorMes}
        onChangeText={setLivrosPorMes}
      />

      <TextInput
        style={styles.input}
        placeholder="Quanto tempo você costuma ler por dia? (em horas)"
        keyboardType="numeric"
        value={tempoPorDia}
        onChangeText={setTempoPorDia}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ... resto do código (mantido igual)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffbea',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 5,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d68910', // Dourado/mostarda
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f1c40f',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: '#fffdf2',
  },
  botao: {
    backgroundColor: '#f39c12', // Laranja amarelado
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#f7d794', // Amarelo clarinho
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

