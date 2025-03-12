"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphDate = () => {
  const data = {
    labels: [
      'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
      'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'
    ],
    datasets: [
      {
        label: ' Valores Mensais',
        data: [100, 120, 130, 200, 160, 180, 200, 220, 240, 220, 120, 150],
        borderColor: '#dafd00',
        backgroundColor: '#dafd00',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Adicione 'as const' para garantir que o TypeScript reconheça como um valor específico permitido
      },
      title: {
        display: true,
        text: 'Gráfico de Linha - Valores Mensais em 2024',
      },
    },
  };
  

  return (
    <Card className='mb-[25px] shadow-none'>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
        </Typography>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default GraphDate;
