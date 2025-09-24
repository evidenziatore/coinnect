import React from "react";

const EsportazioniContent: React.FC = () => (
  <div>
    <h3>Contenuto Esportazioni</h3>
    {[...Array(500)].map((_, i) => (
      <p key={i}>Riga {i + 1}</p>
    ))}
  </div>
);

export default EsportazioniContent;
