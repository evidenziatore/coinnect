import React from "react";

const StatisticheContent: React.FC = () => (
  <div>
    <h3>Contenuto Statistiche</h3>
    {[...Array(50)].map((_, i) => (
      <p key={i}>Riga {i + 1}</p>
    ))}
  </div>
);

export default StatisticheContent;
