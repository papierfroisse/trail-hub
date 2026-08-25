import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ElevationProfile({ profileData = [], color = "#f97316", height = "260px" }) {
  if (!profileData || profileData.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
        Aucun profil d'altitude disponible pour cet itinéraire.
      </div>
    );
  }

  const labels = profileData.map(p => `${p.dist} km`);
  const elevations = profileData.map(p => p.ele);

  const minEle = Math.floor(Math.min(...elevations) * 0.95);
  const maxEle = Math.ceil(Math.max(...elevations) * 1.05);

  const data = {
    labels,
    datasets: [
      {
        label: 'Altitude (m)',
        data: elevations,
        borderColor: color,
        borderWidth: 2.5,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, `${color}66`); // 40% opacité
          gradient.addColorStop(1, `${color}00`); // 0% opacité
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        titleColor: '#f97316',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (tooltipItems) => `Distance : ${tooltipItems[0].label}`,
          label: (context) => ` Altitude : ${context.raw} m`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', maxTicksLimit: 10, font: { size: 11 } }
      },
      y: {
        min: minEle,
        max: maxEle,
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        ticks: { 
          color: '#9ca3af', 
          font: { size: 11 },
          callback: (value) => `${value}m`
        }
      }
    }
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
}
