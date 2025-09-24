import React from "react";

const GestioneContent: React.FC = () => (
  <div>
    <h3>Contenuto Gestione</h3>
    {[...Array(5)].map((_, i) => (
      <p key={i}>Riga {i + 1}</p>
    ))}
  </div>
);

export default GestioneContent;
