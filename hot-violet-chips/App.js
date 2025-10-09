import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Grafico from './components/Grafico';

export default function App() {
  const [paginas, setPaginas] = useState('');
  const [livros, setLivros] = useState('');
  const [tempo, setTempo] = useState('');
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes');

  // Carregar registros
  useEffect(() => {
    const carregar = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('registros');
        if (dadosSalvos) setRegistros(JSON.parse(dadosSalvos));
      } catch (error) {
        console.log('Erro ao carregar registros:', error);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const salvarNoAsync = async (novosRegistros) => {
    try {
      await AsyncStorage.setItem('registros', JSON.stringify(novosRegistros));
    } catch (error) {
      console.log('Erro ao salvar registros:', error);
    }
  };

  // Salvar registro (novo ou edição)
  const handleSave = () => {
    const paginasNum = Number(paginas);
    const livrosNum = Number(livros);
    const tempoNum = Number(tempo);

    if (isNaN(paginasNum) || isNaN(livrosNum) || isNaN(tempoNum)) {
      return Alert.alert("Erro de Validação", "Digite apenas números válidos.");
    }
    if (paginasNum < 0 || livrosNum < 0 || tempoNum < 0) {
      return Alert.alert("Erro de Validação", "Nenhum valor pode ser negativo.");
    }

    if (registroEditando) {
      const novosRegistros = registros.map(r =>
        r.id === registroEditando.id ? { ...r, paginas: paginasNum, livros: livrosNum, tempo: tempoNum } : r
      );
      setRegistros(novosRegistros);
      salvarNoAsync(novosRegistros);
      setRegistroEditando(null);
    } else {
      const novoRegistro = {
        id: Date.now(),
        paginas: paginasNum,
        livros: livrosNum,
        tempo: tempoNum,
      };
      const novosRegistros = [...registros, novoRegistro];
      setRegistros(novosRegistros);
      salvarNoAsync(novosRegistros);
    }

    setPaginas('');
    setLivros('');
    setTempo('');

    Alert.alert('Sucesso!', 'Seu registro foi salvo!');
  };

  // Deletar registro
  const handleDelete = (id) => {
    const novosRegistros = registros.filter((item) => item.id !== id);
    setRegistros(novosRegistros);
    salvarNoAsync(novosRegistros);
    Alert.alert('Sucesso!', 'O registro foi deletado.');
  };

  // Editar registro
  const handleEdit = (registro) => {
    setRegistroEditando(registro);
    setPaginas(registro.paginas.toString());
    setLivros(registro.livros.toString());
    setTempo(registro.tempo.toString());
  };

  // Ordenação
  let registrosExibidos = [...registros];
  if (ordenacao === 'maior_paginas') {
    registrosExibidos.sort((a, b) => b.paginas - a.paginas);
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando registros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.titulo}>Seu Diário de Leitura</Text>
        <Text style={styles.subtituloApp}>Transforme seus hábitos em conquistas 📚</Text>

        {/* Gráfico */}
        <Grafico registros={registrosExibidos} />

        {/* Formulário */}
        <View style={styles.card}>
          <Text style={styles.subtitulo}>{registroEditando ? 'Editar Registro' : 'Novo Registro'}</Text>

          <Text>Quantas páginas você lê por dia?</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={paginas}
            onChangeText={setPaginas}
          />

          <Text>Quantos livros você lê por mês?</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={livros}
            onChangeText={setLivros}
          />

          <Text>Quanto tempo você costuma ler por dia? (em horas)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={tempo}
            onChangeText={setTempo}
          />

          <TouchableOpacity style={styles.botaoAmarelo} onPress={handleSave}>
            <Text style={styles.textoBotaoAmarelo}>{registroEditando ? 'Atualizar Registro' : 'Salvar Registro'}</Text>
          </TouchableOpacity>
        </View>

        {/* Botões de ordenação */}
        <View style={styles.botoesOrdenacao}>
          <TouchableOpacity style={styles.botaoAmarelo} onPress={() => setOrdenacao('recentes')}>
            <Text style={styles.textoBotaoAmarelo}>Mais Recentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAmarelo} onPress={() => setOrdenacao('maior_paginas')}>
            <Text style={styles.textoBotaoAmarelo}>Maior Valor (Páginas)</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de registros */}
        <Text style={styles.subtitulo}>📚 Registros de Leitura</Text>
        {registrosExibidos.length === 0 ? (
          <Text style={{ textAlign: 'center' }}>Nenhum registro encontrado.</Text>
        ) : (
          <FlatList
            data={registrosExibidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{`📖 Páginas/dia: ${item.paginas}`}</Text>
                <Text>{`📚 Livros/mês: ${item.livros}`}</Text>
                <Text>{`⏰ Tempo: ${item.tempo}h`}</Text>
                <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#9a7d0a' }}>
                  {new Date(item.id).toLocaleDateString('pt-BR')}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.botaoAmarelo, { backgroundColor: '#f1c40f', marginRight: 8 }]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.textoBotaoAmarelo}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.botaoAmarelo, { backgroundColor: '#e67e22' }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.textoBotaoAmarelo}>Deletar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Botão exportar */}
        <TouchableOpacity
          style={styles.botaoExportar}
          onPress={() => Alert.alert('Exportar', 'Aqui você exportaria o banco de dados!')}
        >
          <Text style={styles.botaoTexto}>Exportar "Banco de Dados"</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff8e1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#f39c12',
  },
  subtituloApp: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: -20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#b9770e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fef9e7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 15,
    elevation: 2,
  },
  botoesOrdenacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  botaoAmarelo: {
    backgroundColor: '#f1c40f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  textoBotaoAmarelo: {
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoExportar: {
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 40,
  },
  botaoTexto: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
