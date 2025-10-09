import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function Grafico({ registros }) {
  if (registros.length < 2) {
    return (
      <Text style={{ textAlign: 'center', margin: 10 }}>
        Adicione pelo menos 2 registros para ver o gráfico.
      </Text>
    );
  }

  const data = {
    labels: registros
      .map(reg => new Date(reg.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
      .reverse(), // Eixo X (Datas)
    datasets: [
      {
        data: registros.map(reg => reg.paginas).reverse(), // Eixo Y (Valores, troque se quiser outro campo)
      },
    ],
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
        Evolução de Páginas Lidas
      </Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40} // largura da tela
        height={220}
        yAxisSuffix=" pág."
        chartConfig={{
          backgroundColor: '#f1c40f',
          backgroundGradientFrom: '#f39c12',
          backgroundGradientTo: '#f1c40f',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}
